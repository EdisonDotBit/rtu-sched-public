import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import Logo from "../Subcomponent/Asset/rtu_logo_v3.png";
import { useStudentAuth } from "../../Hooks/useStudentAuth";

function Authentication() {
    const navigate = useNavigate();
    const location = useLocation();
    const [pin, setPin] = useState(["", "", "", "", "", ""]);
    const [errorMessage, setErrorMessage] = useState("");
    const [isResending, setIsResending] = useState(false);

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const { studentLogin } = useStudentAuth();

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
        try {
            const response = await axios.post(
                `${apiBaseUrl}/api/users/verify-pin`,
                { pin },
                { withCredentials: true }
            );

            if (response.status === 200 && response.data.success) {
                toast.success("Verification successful! Logging in...");
                const storedRegistrationData = Cookies.get("registration_data");
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

                await studentLogin({
                    username: parsedData.username,
                    password: parsedData.password,
                });

                Cookies.remove("registration_data");
                navigate("/student/set-appointment");
            } else {
                setErrorMessage(
                    "Verification failed due to an unexpected response."
                );
            }
        } catch (error) {
            toast.error(error.message || "Verification failed.");
        }
    };

    const handleResendCode = async () => {
        if (isResending) return;

        setIsResending(true);
        try {
            const response = await axios.post(
                `${apiBaseUrl}/api/users/resend-pin`,
                {},
                { withCredentials: true }
            );

            if (response.status === 200 && response.data.success) {
                toast.success("A new PIN has been sent to your email.");
            } else {
                throw new Error("Failed to resend PIN.");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        }
        setTimeout(() => setIsResending(false), 30000);
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 py-4 sm:py-8 px-4 font-roboto">
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
                className="mt-12 sm:mt-0"
            />

            {/* Logo */}
            <div className="mb-4 w-full flex justify-center">
                <img
                    src={Logo}
                    alt="RTU Online Appointment Logo"
                    className="w-[250px] sm:w-[300px] lg:w-[350px]"
                />
            </div>

            {/* Authentication Box */}
            <div className="w-full max-w-md bg-[#194F90] rounded-lg shadow-md p-4 sm:p-6 md:px-8 lg:px-10">
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4 sm:space-y-6"
                >
                    <h2 className="text-white text-xl sm:text-2xl font-semibold text-center">
                        Verify Your Email
                    </h2>

                    <p className="text-white text-xs sm:text-sm text-center">
                        Kindly check the email that will receive the PIN.
                    </p>

                    {/* Display Messages */}
                    {location.state?.message && (
                        <p className="text-green-400 text-center text-sm sm:text-base">
                            {location.state.message}
                        </p>
                    )}
                    {errorMessage && (
                        <p className="text-red-400 text-center text-sm sm:text-base">
                            {errorMessage}
                        </p>
                    )}

                    {/* PIN Input Fields */}
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
                            />
                        ))}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-[#FFDB75] text-[#194F90] font-semibold rounded-lg hover:bg-[#f3cd64] transition duration-200 text-sm sm:text-base"
                    >
                        Verify PIN
                    </button>

                    {/* Resend Code */}
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
                            {isResending ? "Resend in 30s..." : "Resend Code"}
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Authentication;
