import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../Subcomponent/Asset/rtu_logo_v3.png";

function Register() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        contact_number: "",
        password: "",
        full_name: "",
        student_number: "",
        role: "Student",
    });

    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Handle input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post(
                `${apiBaseUrl}/api/users/register`,
                formData,
                { withCredentials: true }
            );

            if (response.status === 201) {
                navigate("/student/authenticate"); // Redirect to authentication
            }
        } catch (error) {
            setError(error.response?.data?.message || "Registration failed.");
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

                    {error && (
                        <p className="text-red-500 text-center">{error}</p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-white">
                                Username:
                                <input
                                    className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75] transition"
                                    name="username"
                                    type="text"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Enter Username"
                                    required
                                />
                            </label>
                        </div>

                        <div>
                            <label className="block text-white">
                                Email:
                                <input
                                    className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75] transition"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter Email"
                                    required
                                />
                            </label>
                        </div>

                        <div>
                            <label className="block text-white">
                                Contact Number:
                                <input
                                    className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75] transition"
                                    name="contact_number"
                                    type="text"
                                    value={formData.contact_number}
                                    onChange={handleChange}
                                    placeholder="Enter Contact Number"
                                />
                            </label>
                        </div>

                        <div>
                            <label className="block text-white">
                                Full Name:
                                <input
                                    className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75] transition"
                                    name="full_name"
                                    type="text"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    placeholder="Enter Full Name"
                                    required
                                />
                            </label>
                        </div>

                        <div>
                            <label className="block text-white">
                                Student Number:
                                <input
                                    className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75] transition"
                                    name="student_number"
                                    type="text"
                                    value={formData.student_number}
                                    onChange={handleChange}
                                    placeholder="Enter Student Number"
                                />
                            </label>
                        </div>

                        <div>
                            <label className="block text-white">
                                Password:
                                <input
                                    className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75] transition"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter Password"
                                    required
                                />
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-[#FFDB75] text-[#194F90] font-semibold rounded-lg hover:bg-[#f3cd64] transition duration-200"
                    >
                        Register
                    </button>

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
