import { useState } from "react";
import { useStudentAuth } from "../../Hooks/useStudentAuth";
import Logo from "../Subcomponent/Asset/rtu_logo_v3.png";
import { NavLink } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
    const { studentLogin, isStudentAuthenticated } = useStudentAuth();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    // If user is already logged in, redirect them to set-appointment
    if (isStudentAuthenticated()) {
        return <Navigate to="/student/set-appointment" />;
    }

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await studentLogin(formData);
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.message || "Invalid credentials.");
            } else {
                setError("An error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Toggle password visibility
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
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4 sm:space-y-6"
                >
                    <h2 className="text-white text-xl sm:text-2xl font-semibold text-center">
                        Login Account
                    </h2>

                    {error && (
                        <p className="text-red-500 text-center text-sm sm:text-base">
                            {error}
                        </p>
                    )}

                    <div>
                        <label className="block text-white text-sm sm:text-base">
                            Username:
                            <input
                                className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75] transition text-sm sm:text-base"
                                name="username"
                                type="text"
                                placeholder="Enter Username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </label>
                    </div>

                    <div>
                        <label className="block text-white text-sm sm:text-base">
                            Password:
                            <div className="relative">
                                <input
                                    name="password"
                                    type={passwordVisible ? "text" : "password"}
                                    placeholder="Enter Password"
                                    className="text-gray-800 bg-white w-full mt-1 py-2 px-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75] transition text-sm sm:text-base"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
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
                                        <FaEye className="w-5 h-5" /> // Show open eye when password is visible
                                    ) : (
                                        <FaEyeSlash className="w-5 h-5" /> // Show slashed eye when password is hidden
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
                        {loading ? "Logging in..." : "Log In"}
                    </button>

                    <p className="text-white text-xs sm:text-sm text-center mb-6 sm:mb-8">
                        <NavLink to="../student/forgot-password">
                            <span className="text-[#FFDB75] hover:underline cursor-pointer">
                                Forgot Password?
                            </span>
                        </NavLink>
                    </p>

                    <div className="border-t border-[#FFDB75] pt-4">
                        <NavLink to="../student/register">
                            <button
                                type="button"
                                className="w-full py-2 px-4 bg-[#FFDB75] text-[#194F90] font-semibold rounded-lg hover:bg-[#f3cd64] transition duration-200 text-sm sm:text-base disabled:opacity-50"
                                disabled={loading}
                            >
                                Create Student Account
                            </button>
                        </NavLink>
                    </div>

                    <p className="text-white text-xs sm:text-sm text-center mt-4">
                        OR
                    </p>

                    <p className="text-white text-xs sm:text-sm text-center mt-4">
                        <NavLink to="../guest/set-appointment">
                            <span className="text-[#FFDB75] hover:underline cursor-pointer">
                                Sign in as Guest
                            </span>
                        </NavLink>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;
