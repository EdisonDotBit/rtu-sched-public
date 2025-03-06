import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Logo from "../Subcomponent/Asset/rtu_logo_v3.png";
import { useStudentAuth } from "../../Hooks/useStudentAuth";
import Cookies from "js-cookie";

function Authentication() {
    const navigate = useNavigate();
    const location = useLocation();
    const [pin, setPin] = useState(["", "", "", "", "", ""]);
    const [errorMessage, setErrorMessage] = useState("");
    const [resendMessage, setResendMessage] = useState("");
    const [isResending, setIsResending] = useState(false);

    // Get the API base URL from environment variables
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    const handleChange = (e, index) => {
        const value = e.target.value;
        // Only allow digits and max 1 character per input
        if (value.length <= 1 && /^[0-9]*$/.test(value)) {
            const newPin = [...pin];
            newPin[index] = value;
            setPin(newPin);

            // Auto focus next input
            if (value !== "" && index < pin.length - 1) {
                document.getElementById(`pin-${index + 1}`).focus();
            }
        }
    };

    const { studentLogin } = useStudentAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${apiBaseUrl}/api/users/verify-pin`,
                { pin },
                { withCredentials: true }
            );

            console.log("Verification Response:", response.data); // Debugging

            if (response.status === 200 && response.data.success) {
                // Retrieve stored registration data
                const storedRegistrationData = Cookies.get("registration_data");
                console.log(
                    "Stored Registration Data:",
                    storedRegistrationData
                ); // Debugging

                if (!storedRegistrationData) {
                    throw new Error(
                        "Verification succeeded but registration data is missing."
                    );
                }

                const parsedData = JSON.parse(storedRegistrationData);
                if (!parsedData.username || !parsedData.password) {
                    throw new Error(
                        "Verification succeeded but missing user credentials."
                    );
                }

                // Automatically log in the user with their username & password
                await studentLogin({
                    username: parsedData.username,
                    password: parsedData.password,
                });

                // Remove registration data and redirect
                Cookies.remove("registration_data");
                navigate("/student/set-appointment");
            } else {
                setErrorMessage(
                    "Verification failed due to an unexpected response."
                );
            }
        } catch (error) {
            console.error("Verification Error:", error);
            setErrorMessage(error.message || "Verification failed.");
        }
    };

    // Handle Resend Code
    const handleResendCode = async () => {
        if (isResending) return; // Prevent multiple clicks

        setIsResending(true);
        setResendMessage(""); // Clear previous messages

        try {
            const response = await axios.post(
                `${apiBaseUrl}/api/users/resend-pin`,
                {},
                { withCredentials: true }
            );

            if (response.status === 200 && response.data.success) {
                setResendMessage("A new PIN has been sent to your email.");
            } else {
                setResendMessage("Failed to resend PIN. Try again later.");
            }
        } catch (error) {
            setResendMessage("An error occurred. Please try again.");
        }

        // Allow resending after 30 seconds
        setTimeout(() => setIsResending(false), 30000);
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 py-8 font-roboto">
            {/* Logo */}
            <div className="mb-4">
                <img
                    src={Logo}
                    alt="RTU Online Appointment Logo"
                    className="w-[300px] lg:w-[400px]"
                />
            </div>

            {/* Authentication Box */}
            <div className="w-full max-w-md bg-[#194F90] rounded-lg shadow-md p-6 md:px-8 lg:px-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <h2 className="text-white text-2xl font-semibold text-center">
                        Verify Your Email
                    </h2>

                    <p className="text-white text-sm text-center mt-4">
                        Kindly check the email that will receive the PIN.
                    </p>

                    {/* Display Messages */}
                    {location.state?.message && (
                        <p className="text-green-400 text-center">
                            {location.state.message}
                        </p>
                    )}
                    {errorMessage && (
                        <p className="text-red-400 text-center">
                            {errorMessage}
                        </p>
                    )}

                    {/* PIN Input Fields */}
                    <div className="flex justify-center gap-2">
                        {pin.map((digit, index) => (
                            <input
                                key={index}
                                id={`pin-${index}`}
                                type="text"
                                value={digit}
                                onChange={(e) => handleChange(e, index)}
                                maxLength={1}
                                className="w-12 h-12 text-center text-xl border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75] transition"
                            />
                        ))}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-[#FFDB75] text-[#194F90] font-semibold rounded-lg hover:bg-[#f3cd64] transition duration-200"
                    >
                        Verify PIN
                    </button>

                    {/* Resend Code */}
                    <p className="text-white text-sm text-center mt-4">
                        Didn't receive a PIN?{" "}
                        <button
                            type="button"
                            onClick={handleResendCode}
                            disabled={isResending}
                            className={`text-[#FFDB75] hover:underline cursor-pointer ${
                                isResending
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                            }`}
                        >
                            {isResending ? "Resend in 30s..." : "Resend Code"}
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Authentication;
