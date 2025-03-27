import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../Subcomponent/Asset/rtu_logo_v3.png";
import { useStudentAuth } from "../../Hooks/useStudentAuth";
import { Navigate } from "react-router-dom";

function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const { isStudentAuthenticated } = useStudentAuth();
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    // If user is already logged in, redirect them to set-appointment
    if (isStudentAuthenticated()) {
        return <Navigate to="/student/set-appointment" />;
    }

    const handleRequestPin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(
                `${apiBaseUrl}/api/users/request-password-reset`,
                { email },
                { withCredentials: true }
            );

            if (response.data.success) {
                toast.success(response.data.message);
                setTimeout(() => {
                    navigate("/student/forgot-password-authenticate", {
                        state: { email },
                    });
                }, 2000);
            } else {
                throw new Error("Failed to send verification email.");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error(
                error.response?.data?.message ||
                    "Failed to send verification email."
            );
        } finally {
            setLoading(false);
        }
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
                className="mt-12 sm:mt-0" // Adjust position for mobile
            />

            {/* Logo */}
            <div className="mb-4 w-full flex justify-center">
                <img
                    src={Logo}
                    alt="RTU Online Appointment Logo"
                    className="w-[250px] sm:w-[300px] lg:w-[350px]"
                />
            </div>

            {/* Forgot Password Form */}
            <div className="w-full max-w-md bg-[#194F90] rounded-lg shadow-md p-4 sm:p-6 md:px-8 lg:px-10">
                <form
                    onSubmit={handleRequestPin}
                    className="space-y-4 sm:space-y-6"
                >
                    <h2 className="text-white text-xl sm:text-2xl font-semibold text-center">
                        Forgot Password
                    </h2>

                    {/* Email Input */}
                    <div>
                        <label className="block text-white text-sm sm:text-base">
                            Institutional Email:
                            <input
                                className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75] transition text-sm sm:text-base"
                                type="email"
                                placeholder="Enter Your Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-[#FFDB75] text-[#194F90] font-semibold rounded-lg hover:bg-[#f3cd64] transition duration-200 text-sm sm:text-base disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Send Verification PIN"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;
