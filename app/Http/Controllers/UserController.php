<?php

namespace App\Http\Controllers;

use App\Mail\SendVerificationPin;
use App\Mail\StudentNumberVerificationMail;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;


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
            // 'student_number' => 'nullable|string|unique:users',
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
                // 'student_number' => $validated['student_number'],
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

    public function sendVerificationPin(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        $studentNumber = $request->input('student_number');
        $pin = random_int(100000, 999999); // Generate a 6-digit verification PIN

        // Store PIN and student number in session (like registration)
        session([
            'verification_pin' => $pin,
            'verification_data' => [
                'student_number' => $studentNumber,
                'user_id' => $user->id,
            ],
        ]);

        // Log stored PIN and session ID
        Log::info('Stored Student Verification PIN: ' . session('verification_pin'));
        Log::info('Session Data: ' . json_encode(session('verification_data')));

        // Send the PIN to the user's institutional email
        $email = $studentNumber . '@rtu.edu.ph';
        Mail::to($email)->send(new StudentNumberVerificationMail($pin));

        return response()->json(['success' => true, 'message' => 'Verification PIN sent successfully.'], 200);
    }

    public function verifyStudentNumberPin(Request $request)
    {
        $request->validate([
            'pin' => 'required|array',
        ]);

        // Combine the PIN array into a single string
        $enteredPin = implode('', $request->pin);
        $sessionPin = session('verification_pin');
        $verificationData = session('verification_data');

        // Log for debugging
        Log::info('Entered PIN: ' . $enteredPin);
        Log::info('Stored PIN: ' . $sessionPin);
        Log::info('Session Data: ' . json_encode($verificationData));

        if (!$sessionPin || !$verificationData || (string)$enteredPin !== (string)$sessionPin) {
            return response()->json(['success' => false, 'message' => 'Invalid verification PIN.'], 422);
        }

        // Retrieve the user from the database
        $user = User::find($verificationData['user_id']);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Update user details
        $user->student_number = $verificationData['student_number'];
        $user->is_verified = true;
        $user->save();

        // Clear session data after successful verification
        session()->forget(['verification_pin', 'verification_data']);

        return response()->json(['success' => true, 'message' => 'Student number verified successfully.'], 200);
    }


    public function updateAccount(Request $request)
    {
        $user = User::find(auth()->id()); // Ensure user is properly retrieved

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $validated = $request->validate([
            'full_name' => 'nullable|string|max:255',
            'contact_number' => 'nullable|string|max:20',
            'password' => 'nullable|string|min:6|confirmed', // Password is optional
        ]);

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']); // Hash new password
        }

        $user->full_name = $validated['full_name'] ?? $user->full_name;
        $user->contact_number = $validated['contact_number'] ?? $user->contact_number;

        $user->save(); // Ensure save() is called on a valid instance

        return response()->json(['message' => 'Account updated successfully.', 'user' => $user], 200);
    }
}
