import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../Subcomponent/Asset/rtu_logo_v3.png";
import Cookies from "js-cookie";
import { useStudentAuth } from "../../Hooks/useStudentAuth";
import { Navigate } from "react-router-dom";

function Register() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        contact_number: "",
        password: "",
        full_name: "",
        role: "Student",
    });

    const { isStudentAuthenticated } = useStudentAuth(); // Use the hook here
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    // If user is already logged in, redirect them to set-appointment
    if (isStudentAuthenticated()) {
        return <Navigate to="/student/set-appointment" />;
    }

    // Handle input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(
                `${apiBaseUrl}/api/users/register`,
                formData,
                { withCredentials: true }
            );

            console.log("Registration Response:", response.data); // Debugging

            if (response.status === 201) {
                // Store only username & password in cookies
                Cookies.set(
                    "registration_data",
                    JSON.stringify({
                        username: formData.username,
                        password: formData.password,
                    }),
                    { expires: 1 }
                );

                // Redirect to authentication
                navigate("/student/authenticate");
            } else {
                alert("Unexpected response from the server.");
            }
        } catch (error) {
            console.error("Registration Error:", error.response?.data || error);
            alert(error.response?.data?.message || "Registration failed.");
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

            <div className="w-full max-w-[800px] bg-[#194F90] rounded-lg shadow-md p-6 md:px-8 lg:px-10">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h2 className="text-white text-2xl font-semibold text-center">
                        Register Student Account
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Username */}
                        <div>
                            <label className="block text-white">
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
                                    className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75] transition"
                                />
                            </label>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-white">
                                Email:
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Ex: 2021-1018##@rtu.edu.ph"
                                    required
                                    pattern="^\d{4}-\d{6}@rtu\.edu\.ph$"
                                    title="Email must be in the format ####-######@rtu.edu.ph"
                                    className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75] transition"
                                />
                            </label>
                        </div>

                        {/* Full Name */}
                        <div>
                            <label className="block text-white">
                                Full Name:
                                <input
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    placeholder="Enter Full Name"
                                    required
                                    // pattern="^[A-Z][a-zA-Z' -]{1,99}$"
                                    // title="Only letters, hyphens, and apostrophes are allowed."
                                    className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75] transition"
                                />
                            </label>
                        </div>

                        {/* Contact Number */}
                        <div>
                            <label className="block text-white">
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
                                    className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75] transition"
                                />
                            </label>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-white">
                                Password:
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter Password"
                                    required
                                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                                    title="Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character."
                                    className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75] transition"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-[#FFDB75] text-[#194F90] font-semibold rounded-lg hover:bg-[#f3cd64] transition duration-200"
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Register"}
                    </button>

                    {/* Sign In Links */}
                    <p className="text-white text-sm text-center mt-4">
                        Already have a student account?{" "}
                        <NavLink to="../student/login">
                            <span className="text-[#FFDB75] hover:underline cursor-pointer">
                                Sign in Here!
                            </span>
                        </NavLink>
                    </p>
                    <p className="text-white text-sm text-center mt-4">OR</p>
                    <p className="text-white text-sm text-center mt-4">
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
