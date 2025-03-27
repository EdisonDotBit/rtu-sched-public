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
    const [loading, setLoading] = useState(false);
    const { isStudentAuthenticated } = useStudentAuth();
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    if (isStudentAuthenticated()) {
        return <Navigate to="/student/set-appointment" />;
    }

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (value.length <= 1 && /^[0-9]*$/.test(value)) {
            const newPin = [...pin];
            newPin[index] = value;
            setPin(newPin);

            if (value !== "" && index < pin.length - 1) {
                document.getElementById(`pin-${index + 1}`).focus();
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(
                `${apiBaseUrl}/api/users/verify-password-reset-pin`,
                { pin },
                { withCredentials: true }
            );

            if (response.status === 200 && response.data.success) {
                Cookies.set(
                    "password_reset_data",
                    JSON.stringify({ email: location.state?.email }),
                    { expires: 1 }
                );
                toast.success(response.data.message);
                setTimeout(() => {
                    navigate("/student/reset-password", {
                        state: { message: response.data.message },
                    });
                }, 2000);
            } else {
                throw new Error(
                    response.data.message || "Verification failed."
                );
            }
        } catch (error) {
            console.error(
                "Error during PIN verification:",
                error.response?.data || error.message
            );
            toast.error(
                error.response?.data?.message || "Verification failed."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (isResending) return;

        setIsResending(true);
        toast.info("Resending PIN...");

        try {
            const response = await axios.post(
                `${apiBaseUrl}/api/users/request-password-reset`,
                { email: location.state?.email },
                { withCredentials: true }
            );

            if (response.status === 200 && response.data.success) {
                toast.success("A new PIN has been sent to your email.");
            } else {
                throw new Error("Failed to resend PIN. Try again later.");
            }
        } catch (error) {
            console.error("Resend PIN Error:", error.response?.data || error);
            toast.error(
                error.response?.data?.message ||
                    "An error occurred. Please try again."
            );
        } finally {
            setTimeout(() => {
                setIsResending(false);
            }, 20000);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 py-4 sm:py-8 px-4 font-roboto">
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
                className="mt-12 sm:mt-0"
            />

            <div className="mb-4 w-full flex justify-center">
                <img
                    src={Logo}
                    alt="RTU Online Appointment Logo"
                    className="w-[250px] sm:w-[300px] lg:w-[350px]"
                />
            </div>

            <div className="w-full max-w-md bg-[#194F90] rounded-lg shadow-md p-4 sm:p-6 md:px-8 lg:px-10">
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4 sm:space-y-6"
                >
                    <h2 className="text-white text-xl sm:text-2xl font-semibold text-center">
                        Verify Your PIN
                    </h2>

                    <p className="text-white text-xs sm:text-sm text-center">
                        Kindly check the email that will receive the PIN.
                    </p>

                    <div className="flex justify-center gap-1 sm:gap-2">
                        {pin.map((digit, index) => (
                            <input
                                key={index}
                                id={`pin-${index}`}
                                type="text"
                                value={digit}
                                onChange={(e) => handleChange(e, index)}
                                maxLength={1}
                                className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-xl border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75] transition"
                                disabled={loading}
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-[#FFDB75] text-[#194F90] font-semibold rounded-lg hover:bg-[#f3cd64] transition duration-200 text-sm sm:text-base disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Verify PIN"}
                    </button>

                    <p className="text-white text-xs sm:text-sm text-center">
                        Didn't receive a PIN?{" "}
                        <button
                            type="button"
                            onClick={handleResendCode}
                            disabled={isResending}
                            className={`text-[#FFDB75] hover:underline ${
                                isResending
                                    ? "opacity-50 cursor-not-allowed"
                                    : "cursor-pointer"
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
