import { useState } from "react";
import { useStudentAuth } from "../../Hooks/useStudentAuth";
import Logo from "../Subcomponent/Asset/rtu_logo_v3.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const { studentLogin } = useStudentAuth();

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:8000/api/users/register",
                formData,
                { withCredentials: true }
            );

            if (response.status === 201) {
                // Redirect to authentication page
                navigate("/student/authenticate");
            }
        } catch (error) {
            console.error(error.response.data);
            alert("Registration failed.");
        }
    };

    return (
        <div className="w-full h-full flex flex-col justify-center items-center gap-8 font-roboto">
            <img
                src={Logo}
                alt="RTU Online Appointment Logo"
                className="w-[400px]"
            />
            <form
                onSubmit={handleSubmit}
                className="h-auto w-full md:w-2/4 lg:w-[50%] border border-gray-300 bg-[#194F90] rounded-md shadow-md px-8 py-8"
            >
                <h2 className="text-white text-xl font-semibold text-center mb-6">
                    Register Account
                </h2>

                <div className="flex justify-center flex-wrap gap-4">
                    <div className="w-full md:w-[48%]">
                        <label className="block text-white">
                            Username:
                            <input
                                className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg"
                                name="username"
                                type="text"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter Username"
                            />
                        </label>
                    </div>

                    <div className="w-full md:w-[48%]">
                        <label className="block text-white">
                            Email:
                            <input
                                className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter Email"
                            />
                        </label>
                    </div>

                    <div className="w-full md:w-[48%]">
                        <label className="block text-white">
                            Contact Number:
                            <input
                                className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg"
                                name="contact_number"
                                type="text"
                                value={formData.contact_number}
                                onChange={handleChange}
                                placeholder="Enter Contact Number"
                            />
                        </label>
                    </div>

                    <div className="w-full md:w-[48%]">
                        <label className="block text-white">
                            Full Name:
                            <input
                                className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg"
                                name="full_name"
                                type="text"
                                value={formData.full_name}
                                onChange={handleChange}
                                placeholder="Enter Full Name"
                            />
                        </label>
                    </div>

                    <div className="w-full md:w-[48%]">
                        <label className="block text-white">
                            Student Number:
                            <input
                                className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg"
                                name="student_number"
                                type="text"
                                value={formData.student_number}
                                onChange={handleChange}
                                placeholder="Enter Student Number"
                            />
                        </label>
                    </div>

                    <div className="w-full md:w-[48%]">
                        <label className="block text-white">
                            Password:
                            <input
                                className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter Password"
                            />
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-outline w-full text-[#194F90] bg-[#FFDB75] hover:bg-[#f3cd64] hover:text-[#194F90] mt-4"
                    >
                        Register
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Register;
