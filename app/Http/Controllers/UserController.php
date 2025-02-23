<?php

namespace App\Http\Controllers;

use App\Mail\SendVerificationPin;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;

class UserController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|unique:users',
            'email' => 'required|email|unique:users',
            'contact_number' => 'nullable|string',
            'password' => 'required|min:6',
            'full_name' => 'required|string',
            'student_number' => 'nullable|string|unique:users',
            'role' => 'required|in:Student,admin',
        ]);

        // Generate a random 6-digit PIN
        $pin = random_int(100000, 999999);

        // Store registration data and PIN in session
        session([
            'registration_data' => [
                'username' => $validated['username'],
                'email' => $validated['email'],
                'contact_number' => $validated['contact_number'],
                'password' => $validated['password'],
                'full_name' => $validated['full_name'],
                'student_number' => $validated['student_number'],
                'role' => $validated['role'],
            ],
            'verification_pin' => $pin,
        ]);

        // Log stored PIN and session ID
        Log::info('Stored PIN: ' . session('verification_pin'));
        Log::info('Registration data: ' . json_encode(session('registration_data')));
        Log::info('Session ID after storing PIN: ' . session()->getId());

        // Send email with PIN
        Mail::to($validated['email'])->send(new SendVerificationPin($pin));

        return response()->json([
            'success' => true,
            'message' => 'A verification PIN has been sent to your email.'
        ], 201);
    }

    public function verifyPin(Request $request)
    {
        $request->validate([
            'pin' => 'required|array',
        ]);

        // Combine the PIN array into a single string
        $enteredPin = implode('', $request->pin);

        // Retrieve session data
        $sessionPin = session('verification_pin');
        $registrationData = session('registration_data');

        // Log entered PIN, stored PIN, and session ID
        Log::info('Entered PIN: ' . $enteredPin);
        Log::info('Stored PIN: ' . session('verification_pin'));
        Log::info('Registration data: ' . json_encode(session('registration_data')));
        Log::info('Session ID during verification: ' . session()->getId());

        // Check if the PINs match
        if ($sessionPin && $registrationData && (string)$enteredPin === (string)$sessionPin) {
            // Save the user to the database
            $user = new User($registrationData);
            $user->password = bcrypt($registrationData['password']);
            $user->save();

            // Clear session data after successful registration
            session()->forget(['verification_pin', 'registration_data']);

            return response()->json(['success' => true, 'message' => 'Account verified and registered successfully.']);
        } else {
            return response()->json(['success' => false, 'message' => 'Invalid PIN.'], 422);
        }
    }

    public function resendPin(Request $request)
    {
        // Retrieve session data
        $registrationData = session('registration_data');

        if (!$registrationData) {
            return response()->json([
                'success' => false,
                'message' => 'Session expired. Please register again.'
            ], 400);
        }

        // Generate a new 6-digit PIN
        $newPin = random_int(100000, 999999);

        // Store the new PIN in session
        session(['verification_pin' => $newPin]);

        // Send new PIN via email
        Mail::to($registrationData['email'])->send(new SendVerificationPin($newPin));

        return response()->json([
            'success' => true,
            'message' => 'A new verification PIN has been sent to your email.'
        ]);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        $user = User::where('username', $validated['username'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'error' => 'The provided credentials are incorrect.'
            ], 422);
        }

        $token = $user->createToken('authToken')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 200);
    }


    public function logout(Request $request)
    {
        // Revoke the token that was used to authenticate the current request
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully.'
        ]);
    }


    public function userInfo(Request $request)
    {
        return response()->json($request->user());
    }
}
