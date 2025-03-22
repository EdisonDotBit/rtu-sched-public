import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Logo from "../Subcomponent/Asset/rtu_logo_v3.png";

function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setMessage("");
        setErrorMessage("");
        setLoading(true);

        if (newPassword !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
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

            setMessage(response.data.message);
            if (response.data.success) {
                navigate("/student/login", {
                    state: {
                        message: response.data.message,
                    },
                });
            }
        } catch (error) {
            setErrorMessage("Failed to reset password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 py-8 font-roboto">
            <div className="mb-4">
                <img
                    src={Logo}
                    alt="RTU Online Appointment Logo"
                    className="w-[300px] lg:w-[400px]"
                />
            </div>
            <div className="w-full max-w-md bg-[#194F90] rounded-lg shadow-md p-6 md:px-8 lg:px-10">
                <form onSubmit={handleResetPassword} className="space-y-6">
                    <h2 className="text-white text-2xl font-semibold text-center">
                        Reset Password
                    </h2>
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
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-[#FFDB75] text-[#194F90] font-semibold rounded-lg hover:bg-[#f3cd64] transition duration-200"
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Reset Password"}
                    </button>
                    {message && (
                        <p className="text-green-400 text-center mt-4">
                            {message}
                        </p>
                    )}
                    {errorMessage && (
                        <p className="text-red-400 text-center mt-4">
                            {errorMessage}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;
