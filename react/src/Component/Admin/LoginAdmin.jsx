import { useState } from "react";
import { useAuth } from "../../Hooks/useAuth";
import Logo from "../Subcomponent/Asset/rtu_logo_v3.png";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navigate } from "react-router-dom";

function LoginAdmin() {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [formData, setFormData] = useState({
        admuser: "",
        admpass: "",
    });
    const [loading, setLoading] = useState(false);

    const { login, user, role } = useAuth();

    // Redirect if the user is already authenticated
    if (user) {
        if (role === "superadmin") {
            return <Navigate to="/rtu/suppa/dashboard" replace />;
        } else {
            return <Navigate to="/rtu/admin/dashboard" replace />;
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        // Basic form validation
        if (!formData.admuser || !formData.admpass) {
            toast.error("Please fill in all fields.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                `${apiBaseUrl}/api/admin/login`,
                formData
            );

            if (response.status === 200) {
                login({
                    user: formData.admuser,
                    role: response.data.admrole,
                    branch: response.data.admbranch,
                });
                toast.success("Login Success");
            }
        } catch (error) {
            if (error.response) {
                toast.error(
                    error.response.data.message ||
                        "Wrong credentials. Please try again."
                );
            } else if (error.request) {
                toast.error("Network error. Please check your connection.");
            } else {
                toast.error("An unexpected error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 py-4 sm:py-8 px-4 font-roboto">
            <div className="mb-4 w-full flex justify-center">
                <img
                    src={Logo}
                    alt="RTU Online Appointment Logo"
                    className="w-[250px] sm:w-[300px] lg:w-[350px]"
                />
            </div>
            <div className="w-full max-w-md bg-[#194F90] rounded-lg shadow-md p-4 sm:p-6 md:px-8 lg:px-10">
                <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
                    <h2 className="text-white text-xl sm:text-2xl font-semibold text-center">
                        Login Admin Account
                    </h2>

                    <div>
                        <label className="block text-white text-sm sm:text-base">
                            Username:
                            <input
                                className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75] transition text-sm sm:text-base"
                                name="admuser"
                                type="text"
                                value={formData.admuser}
                                onChange={handleChange}
                                placeholder="Enter Username"
                                disabled={loading}
                                required
                            />
                        </label>
                    </div>

                    <div>
                        <label className="block text-white text-sm sm:text-base">
                            Password:
                            <div className="relative">
                                <input
                                    name="admpass"
                                    type={passwordVisible ? "text" : "password"}
                                    value={formData.admpass}
                                    onChange={handleChange}
                                    placeholder="Enter Password"
                                    className="text-gray-800 bg-white w-full mt-1 py-2 px-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75] transition text-sm sm:text-base"
                                    disabled={loading}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                    aria-label={
                                        passwordVisible
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                    disabled={loading}
                                >
                                    {passwordVisible ? (
                                        <FaEye className="w-5 h-5" />
                                    ) : (
                                        <FaEyeSlash className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-[#FFDB75] text-[#194F90] font-semibold rounded-lg hover:bg-[#f3cd64] transition duration-200 text-sm sm:text-base disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginAdmin;
