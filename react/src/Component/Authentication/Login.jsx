import { useState } from "react";
import { useStudentAuth } from "../../Hooks/useStudentAuth";
import Logo from "../Subcomponent/Asset/rtu_logo_v3.png";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";

function Login() {
    const { studentLogin } = useStudentAuth();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post(
                "http://localhost:8000/api/users/login",
                formData
            );

            if (response.status === 200) {
                studentLogin(response.data); // Store user data using studentLogin
                navigate("../student/set-appointment"); // Redirect after successful login
            }
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.message || "Invalid credentials.");
            } else {
                setError("An error occurred. Please try again.");
            }
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
                <form onSubmit={handleSubmit} className="space-y-6">
                    <h2 className="text-white text-2xl font-semibold text-center">
                        Login Account
                    </h2>

                    {error && (
                        <p className="text-red-500 text-center">{error}</p>
                    )}

                    <div>
                        <label className="block text-white">
                            Username:
                            <input
                                className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75] transition"
                                name="username"
                                type="text"
                                placeholder="Enter Username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </label>
                    </div>

                    <div>
                        <label className="block text-white">
                            Password:
                            <input
                                name="password"
                                type="password"
                                placeholder="Enter Password"
                                className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75] transition"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-[#FFDB75] text-[#194F90] font-semibold rounded-lg hover:bg-[#f3cd64] transition duration-200"
                    >
                        Sign in
                    </button>

                    <p className="text-white text-sm text-center mt-4">
                        Don't have an account?{" "}
                        <NavLink to="../student/register">
                            <span className="text-[#FFDB75] hover:underline cursor-pointer">
                                Create One Here!
                            </span>
                        </NavLink>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;
