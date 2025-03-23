import { useState } from "react";
import { useAuth } from "../../Hooks/useAuth";
import Logo from "../Subcomponent/Asset/rtu_logo_v3.png";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import the CSS

function LoginAdmin() {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        admuser: "",
        admpass: "",
    });
    const [loading, setLoading] = useState(false); // Loading state

    const { login } = useAuth();

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

        setLoading(true); // Set loading state

        try {
            const response = await axios.post(
                `${apiBaseUrl}/api/admin/login`,
                formData
            );

            if (response.status === 200) {
                // Pass the entire response to the login function
                login({
                    user: formData.admuser,
                    role: response.data.admrole,
                    branch: response.data.admbranch,
                });
                toast.success("Login Success");
            }
        } catch (error) {
            // Handle different types of errors
            if (error.response) {
                // Server responded with an error status code
                toast.error(
                    error.response.data.message ||
                        "Wrong credentials. Please try again."
                );
            } else if (error.request) {
                // No response received
                toast.error("Network error. Please check your connection.");
            } else {
                // Other errors
                toast.error("An unexpected error occurred. Please try again.");
            }
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div className="w-full h-full flex flex-col justify-center items-center gap-8">
            <div>
                <img
                    src={Logo}
                    alt="RTU Online Appointment Logo"
                    className="w-[400px]"
                />
            </div>
            <div className="h-[350px] w-full md:w-2/4 lg:w-[30%] border border-gray-300 bg-[#194F90] rounded-md shadow-md px-8 py-4">
                <div className="flex flex-col space-y-4">
                    <h2 className="text-white text-xl font-semibold text-center mt-4">
                        Login Admin Account
                    </h2>

                    {/* Username Field */}
                    <label className="block text-white">
                        Username:
                        <input
                            className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75]"
                            name="admuser"
                            type="text"
                            value={formData.admuser}
                            onChange={handleChange}
                            placeholder="Enter Username"
                            disabled={loading} // Disable input while loading
                        />
                    </label>

                    {/* Password Field */}
                    <label className="block text-white">
                        Password:
                        <div className="relative">
                            <input
                                name="admpass"
                                value={formData.admpass}
                                onChange={handleChange}
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter Password"
                                className="text-gray-800 bg-white w-full mt-1 py-2 px-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75]"
                                disabled={loading} // Disable input while loading
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                                disabled={loading} // Disable button while loading
                            >
                                {showPassword ? (
                                    <FaEyeSlash className="w-5 h-5" />
                                ) : (
                                    <FaEye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </label>

                    {/* Sign In Button */}
                    <div className="flex justify-center gap-6">
                        <button
                            type="button"
                            className="btn bg-[#FFDB75] text-[#194F90] font-semibold hover:bg-[#f3cd64] hover:text-[#194F90] rounded-md px-6 py-2 mt-4"
                            onClick={handleLogin}
                            disabled={loading} // Disable button while loading
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginAdmin;
