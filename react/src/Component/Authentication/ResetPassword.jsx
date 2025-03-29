import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../Subcomponent/Asset/rtu_logo_v3.png";
import Cookies from "js-cookie";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                `${apiBaseUrl}/api/users/reset-password`,
                {
                    password: newPassword,
                    password_confirmation: confirmPassword,
                },
                { withCredentials: true }
            );

            if (response.data.success) {
                Cookies.remove("password_reset_data");
                toast.success(response.data.message);
                setTimeout(() => {
                    navigate("/student/login", {
                        state: {
                            message: response.data.message,
                        },
                    });
                }, 1000);
            } else {
                throw new Error(
                    response.data.message || "Failed to reset password."
                );
            }
        } catch (error) {
            console.error(
                "Error during password reset:",
                error.response?.data || error.message
            );
            toast.error(
                error.response?.data?.message || "Failed to reset password."
            );
        } finally {
            setLoading(false);
        }
    };

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
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

            {/* Reset Password Form */}
            <div className="w-full max-w-md bg-[#194F90] rounded-lg shadow-md p-4 sm:p-6 md:px-8 lg:px-10">
                <form
                    onSubmit={handleResetPassword}
                    className="space-y-4 sm:space-y-6"
                >
                    <h2 className="text-white text-xl sm:text-2xl font-semibold text-center">
                        Reset Password
                    </h2>

                    {/* New Password Input with Toggle */}
                    <div>
                        <label className="block text-white text-sm sm:text-base">
                            New Password:
                        </label>
                        <div className="relative">
                            <input
                                className="text-gray-800 bg-white w-full mt-1 py-2 px-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75] transition text-sm sm:text-base"
                                type={showNewPassword ? "text" : "password"}
                                placeholder="Enter New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                disabled={loading}
                                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};:'\\|,.<>/?~`]).{8,}$"
                                title="Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character."
                            />
                            <button
                                type="button"
                                onClick={toggleNewPasswordVisibility}
                                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                aria-label={
                                    showNewPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                                disabled={loading}
                            >
                                {showNewPassword ? (
                                    <FaEye className="w-5 h-5" /> // Show open eye when password is visible
                                ) : (
                                    <FaEyeSlash className="w-5 h-5" /> // Show slashed eye when password is hidden
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Confirm New Password Input */}
                    <div>
                        <label className="block text-white text-sm sm:text-base">
                            Confirm New Password:
                        </label>
                        <input
                            className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75] transition text-sm sm:text-base"
                            type="password"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Reset Password Button */}
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-[#FFDB75] text-[#194F90] font-semibold rounded-lg hover:bg-[#f3cd64] transition duration-200 text-sm sm:text-base disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;
