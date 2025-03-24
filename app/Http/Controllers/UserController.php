<?php

namespace App\Http\Controllers;

use App\Mail\ForgotPasswordPin;
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
            'student_number' => 'required|string|unique:users', // Add student_number validation
            'contact_number' => 'nullable|string',
            'password' => 'required|min:6',
            'full_name' => 'required|string',
            'role' => 'required|in:Student,admin',
        ]);

        // Generate email from student number
        $email = $validated['student_number'] . '@rtu.edu.ph';

        // Generate a random 6-digit PIN
        $pin = random_int(100000, 999999);

        // Store registration data and PIN in session
        session([
            'registration_data' => [
                'username' => $validated['username'],
                'email' => $email, // Use generated email
                'contact_number' => $validated['contact_number'],
                'password' => $validated['password'],
                'full_name' => $validated['full_name'],
                'student_number' => $validated['student_number'], // Include student number
                'role' => $validated['role'],
            ],
            'verification_pin' => $pin,
        ]);

        // Log stored PIN and session ID
        Log::info('Stored PIN: ' . session('verification_pin'));
        Log::info('Registration data: ' . json_encode(session('registration_data')));
        Log::info('Session ID after storing PIN: ' . session()->getId());

        // Send email with PIN
        Mail::to($email)->send(new SendVerificationPin($pin));

        return response()->json([
            'success' => true,
            'message' => 'A verification PIN has been sent to your institutional email.'
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



    // Forgot Password
    public function requestPasswordReset(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $validated['email'])->first();

        // Generate a random 6-digit PIN
        $pin = random_int(100000, 999999);

        // Store PIN and email in session
        session([
            'password_reset_data' => [
                'email' => $validated['email'],
                'pin' => $pin,
            ],
        ]);

        // Log stored PIN and session ID
        Log::info('Stored Password Reset PIN: ' . $pin);
        Log::info('Session Data: ' . json_encode(session('password_reset_data')));
        Log::info('Session ID: ' . session()->getId());

        // Send email with PIN
        Mail::to($validated['email'])->send(new ForgotPasswordPin($pin));

        return response()->json([
            'success' => true,
            'message' => 'A verification PIN has been sent to your email.'
        ], 200);
    }

    public function verifyPasswordResetPin(Request $request)
    {
        $request->validate([
            'pin' => 'required|array',
        ]);

        // Combine the PIN array into a single string
        $enteredPin = implode('', $request->pin);

        // Retrieve session data
        $sessionPin = session('password_reset_data.pin');
        $resetEmail = session('password_reset_data.email');

        // Log entered PIN, stored PIN, and session ID
        Log::info('Entered PIN: ' . $enteredPin);
        Log::info('Stored PIN: ' . $sessionPin);
        Log::info('Session Data: ' . json_encode(session('password_reset_data')));
        Log::info('Session ID: ' . session()->getId());

        // Check if the PINs match
        if ($sessionPin && $resetEmail && (string)$enteredPin === (string)$sessionPin) {
            session(['password_reset_verified' => true]);
            return response()->json(['success' => true, 'message' => 'PIN verified successfully.']);
        } else {
            return response()->json(['success' => false, 'message' => 'Invalid PIN.'], 422);
        }
    }

    public function resetPassword(Request $request)
    {
        $validated = $request->validate([
            'password' => 'required|min:6|confirmed',
        ]);

        // Check if the PIN was verified
        if (!session('password_reset_verified')) {
            return response()->json(['success' => false, 'message' => 'PIN not verified.'], 422);
        }

        // Retrieve email from session
        $resetEmail = session('password_reset_data.email');
        $user = User::where('email', $resetEmail)->first();

        // Update user password
        $user->password = Hash::make($validated['password']);
        $user->save();

        // Clear session data after successful password reset
        session()->forget(['password_reset_data', 'password_reset_verified']);

        return response()->json(['success' => true, 'message' => 'Password reset successfully.'], 200);
    }
}
