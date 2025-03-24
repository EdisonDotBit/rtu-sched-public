import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../Subcomponent/Asset/rtu_logo_v3.png";
import { useStudentAuth } from "../../Hooks/useStudentAuth";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

function ForgotPasswordAuthentication() {
    const navigate = useNavigate();
    const location = useLocation();
    const [pin, setPin] = useState(["", "", "", "", "", ""]);
    const [isResending, setIsResending] = useState(false);
    const [loading, setLoading] = useState(false); // Add loading state
    const { isStudentAuthenticated } = useStudentAuth();
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    // If user is already logged in, redirect them to set-appointment
    if (isStudentAuthenticated()) {
        return <Navigate to="/student/set-appointment" />;
    }

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true when the form is submitted

        try {
            const response = await axios.post(
                `${apiBaseUrl}/api/users/verify-password-reset-pin`,
                { pin },
                { withCredentials: true }
            );

            if (response.status === 200 && response.data.success) {
                // Set the password_reset_data cookie
                Cookies.set(
                    "password_reset_data",
                    JSON.stringify({ email: location.state?.email }),
                    { expires: 1 }
                ); // Expires in 1 day

                toast.success(response.data.message); // Show success toast

                // Add a small delay before navigation
                setTimeout(() => {
                    navigate("/student/reset-password", {
                        state: {
                            message: response.data.message,
                        },
                    });
                }, 2000); // 2-second delay
            } else {
                throw new Error(
                    response.data.message || "Verification failed."
                );
            }
        } catch (error) {
            console.error(
                "Error during PIN verification:",
                error.response?.data || error.message
            ); // Debugging
            toast.error(
                error.response?.data?.message || "Verification failed."
            ); // Show error toast
        } finally {
            setLoading(false); // Set loading to false when the request is complete
        }
    };

    const handleResendCode = async () => {
        if (isResending) return; // Prevent multiple clicks

        setIsResending(true);
        toast.info("Resending PIN..."); // Show info toast

        try {
            const response = await axios.post(
                `${apiBaseUrl}/api/users/request-password-reset`,
                { email: location.state?.email },
                { withCredentials: true }
            );

            if (response.status === 200 && response.data.success) {
                toast.success("A new PIN has been sent to your email."); // Show success toast
            } else {
                throw new Error("Failed to resend PIN. Try again later.");
            }
        } catch (error) {
            console.error("Resend PIN Error:", error.response?.data || error);
            toast.error(
                error.response?.data?.message ||
                    "An error occurred. Please try again."
            ); // Show error toast
        } finally {
            // Allow resending after 20 seconds
            setTimeout(() => {
                setIsResending(false); // Enable the resend button after 20 seconds
            }, 20000);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 py-8 font-roboto">
            {/* Toast Container */}
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            {/* Logo */}
            <div className="mb-4">
                <img
                    src={Logo}
                    alt="RTU Online Appointment Logo"
                    className="w-[300px] lg:w-[400px]"
                />
            </div>

            {/* Verify PIN Form */}
            <div className="w-full max-w-md bg-[#194F90] rounded-lg shadow-md p-6 md:px-8 lg:px-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <h2 className="text-white text-2xl font-semibold text-center">
                        Verify Your PIN
                    </h2>

                    <p className="text-white text-sm text-center mt-4">
                        Kindly check the email that will receive the PIN.
                    </p>

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

                    {/* Verify PIN Button */}
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-[#FFDB75] text-[#194F90] font-semibold rounded-lg hover:bg-[#f3cd64] transition duration-200"
                        disabled={loading} // Disable the button when loading
                    >
                        {loading ? "Processing..." : "Verify PIN"}
                    </button>

                    {/* Resend Code Section */}
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
                            {isResending ? "Resend in 20s..." : "Resend Code"}
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default ForgotPasswordAuthentication;
