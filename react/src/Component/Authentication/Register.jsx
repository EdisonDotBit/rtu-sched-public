import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../Subcomponent/Asset/rtu_logo_v3.png";
import Cookies from "js-cookie";
import { useStudentAuth } from "../../Hooks/useStudentAuth";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Register() {
    const [formData, setFormData] = useState({
        username: "",
        student_number: "",
        contact_number: "",
        password: "",
        confirm_password: "",
        full_name: "",
        role: "Student",
    });

    const { isStudentAuthenticated } = useStudentAuth();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    if (isStudentAuthenticated()) {
        return <Navigate to="/student/set-appointment" />;
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Check if passwords match
        if (formData.password !== formData.confirm_password) {
            toast.error("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                `${apiBaseUrl}/api/users/register`,
                formData,
                { withCredentials: true }
            );

            if (response.status === 201) {
                Cookies.set(
                    "registration_data",
                    JSON.stringify({
                        username: formData.username,
                        password: formData.password,
                    }),
                    { expires: 1 }
                );
                navigate("/student/authenticate");
                toast.success(
                    "Verification PIN sent to your institutional email."
                );
            } else {
                toast.error("Unexpected response from the server.");
            }
        } catch (error) {
            console.error("Registration Error:", error.response?.data || error);
            toast.error(
                error.response?.data?.message || "Registration failed."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex flex-col bg-gray-100 sm:justify-center p-4 font-roboto overflow-y-auto">
            <div className="mb-4 w-full flex justify-center">
                <img
                    src={Logo}
                    alt="RTU Online Appointment Logo"
                    className="w-[200px] sm:w-[300px] lg:w-[350px]"
                />
            </div>

            <div className="w-full max-w-[800px] bg-[#194F90] rounded-lg shadow-md p-4 sm:p-6 md:px-6 lg:px-8 mx-auto">
                <form
                    onSubmit={handleSubmit}
                    className="space-y-3 sm:space-y-4"
                >
                    <h2 className="text-white text-xl sm:text-2xl font-semibold text-center">
                        Register Student Account
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        {/* Username */}
                        <div>
                            <label className="block text-white text-sm sm:text-base">
                                Username:
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter Username"
                                    pattern="^(?=.{3,20}$)(?![_.])[a-zA-Z0-9._]+(?<![_.])$"
                                    title="Username must be 3-20 characters long and cannot start or end with _ or ."
                                    className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75] transition text-sm sm:text-base"
                                />
                            </label>
                        </div>

                        {/* Student Number */}
                        <div>
                            <label className="block text-white text-sm sm:text-base">
                                Student Number:
                                <input
                                    type="text"
                                    name="student_number"
                                    value={formData.student_number}
                                    onChange={handleChange}
                                    placeholder="Ex: 2021-1018##"
                                    required
                                    pattern="^\d{4}-\d{6}$"
                                    title="Student number must be in the format ####-######."
                                    className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75] transition text-sm sm:text-base"
                                />
                            </label>
                        </div>

                        {/* Full Name */}
                        <div>
                            <label className="block text-white text-sm sm:text-base">
                                Full Name:
                                <input
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    placeholder="Enter Full Name"
                                    required
                                    className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75] transition text-sm sm:text-base"
                                />
                            </label>
                        </div>

                        {/* Contact Number */}
                        <div>
                            <label className="block text-white text-sm sm:text-base">
                                Contact Number:
                                <input
                                    type="tel"
                                    name="contact_number"
                                    value={formData.contact_number}
                                    onChange={handleChange}
                                    placeholder="Enter Contact Number"
                                    required
                                    pattern="^09\d{9}$"
                                    title="Contact number must start with '09' and be 11 digits long."
                                    className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75] transition text-sm sm:text-base"
                                />
                            </label>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-white text-sm sm:text-base">
                                Password:
                                <div className="relative">
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter Password"
                                        required
                                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$"
                                        title="Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character."
                                        className="text-gray-800 bg-white w-full mt-1 py-2 px-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75] transition text-sm sm:text-base"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword ? (
                                            <FaEyeSlash className="w-5 h-5" />
                                        ) : (
                                            <FaEye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </label>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-white text-sm sm:text-base">
                                Confirm Password:
                                <input
                                    type="password"
                                    name="confirm_password"
                                    value={formData.confirm_password}
                                    onChange={handleChange}
                                    placeholder="Confirm Password"
                                    required
                                    className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75] transition text-sm sm:text-base"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-[#FFDB75] text-[#194F90] font-semibold rounded-lg hover:bg-[#f3cd64] transition duration-200 text-sm sm:text-base disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Register"}
                    </button>

                    {/* Sign In Links */}
                    <p className="text-white text-xs sm:text-sm text-center mt-3 sm:mt-4">
                        Already have a student account?{" "}
                        <NavLink to="../student/login">
                            <span className="text-[#FFDB75] hover:underline cursor-pointer">
                                Sign in Here!
                            </span>
                        </NavLink>
                    </p>
                    <p className="text-white text-xs sm:text-sm text-center mt-3 sm:mt-4">
                        OR
                    </p>
                    <p className="text-white text-xs sm:text-sm text-center mt-3 sm:mt-4">
                        <NavLink to="../guest/set-appointment">
                            Don't have a student account?{" "}
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

export default Register;
