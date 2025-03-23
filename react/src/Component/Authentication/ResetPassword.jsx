import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../Subcomponent/Asset/rtu_logo_v3.png";
import Cookies from "js-cookie";

function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match."); // Show error toast
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
                // Clear the password_reset_data cookie
                Cookies.remove("password_reset_data");

                toast.success(response.data.message); // Show success toast
                setTimeout(() => {
                    navigate("/student/login", {
                        state: {
                            message: response.data.message,
                        },
                    });
                }, 1000); // 1 second delay
            } else {
                throw new Error(
                    response.data.message || "Failed to reset password."
                );
            }
        } catch (error) {
            console.error(
                "Error during password reset:",
                error.response?.data || error.message
            ); // Debugging
            toast.error(
                error.response?.data?.message || "Failed to reset password."
            ); // Show error toast
        } finally {
            setLoading(false);
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

            {/* Reset Password Form */}
            <div className="w-full max-w-md bg-[#194F90] rounded-lg shadow-md p-6 md:px-8 lg:px-10">
                <form onSubmit={handleResetPassword} className="space-y-6">
                    <h2 className="text-white text-2xl font-semibold text-center">
                        Reset Password
                    </h2>

                    {/* New Password Input */}
                    <div>
                        <label className="block text-white">
                            New Password:
                        </label>
                        <input
                            className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75] transition"
                            type="password"
                            placeholder="Enter New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Confirm New Password Input */}
                    <div>
                        <label className="block text-white">
                            Confirm New Password:
                        </label>
                        <input
                            className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75] transition"
                            type="password"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Reset Password Button */}
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-[#FFDB75] text-[#194F90] font-semibold rounded-lg hover:bg-[#f3cd64] transition duration-200"
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
