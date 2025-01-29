import { useState } from "react";
import { useAuth } from "../../Hooks/useAuth";
import Logo from "../Subcomponent/Asset/rtu_logo_v3.png";
import axios from "axios";

function LoginAdmin() {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({});
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
                alert("Login Success");
            }
        } catch (error) {
            alert("Wrong Credentials please try again");
        }
    };

    return (
        <>
            <div className="w-full h-full flex flex-col justify-center items-center gap-8">
                <div>
                    <img
                        src={Logo}
                        alt="RTU Online Appointment Logo"
                        className="w-[400px]"
                    />
                </div>
                <div className="h-[340px] w-full md:w-2/4 lg:w-[30%] border border-gray-300 bg-[#194F90] rounded-md shadow-md px-8 py-4">
                    <div className="flex flex-col space-y-4">
                        <div className="flex flex-col space-y-4">
                            <h2 className="text-white text-xl font-semibold text-center mt-4">
                                Login Admin Account
                            </h2>
                            {/* Full Name */}
                            <label className="block text-white">
                                Username:
                                <input
                                    className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75]"
                                    name="admuser"
                                    type="text"
                                    value={formData.admuser}
                                    onChange={handleChange}
                                    placeholder="Enter Username"
                                />
                            </label>
                            {/* Password */}
                            <div className="relative w-full">
                                <label className="block text-white">
                                    Password:
                                    <div className="relative">
                                        <input
                                            name="admpass"
                                            value={formData.admpass}
                                            onChange={handleChange}
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Enter Password"
                                            className="text-gray-800 bg-white w-full mt-1 py-2 px-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                        >
                                            {showPassword ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                </label>
                            </div>

                            <div className="flex justify-center gap-6">
                                <button
                                    type="button"
                                    className="btn btn-outline px-6 text-[#194F90] bg-[#FFDB75] hover:bg-[#f3cd64] hover:text-[#194F90] mt-2"
                                    onClick={handleLogin}
                                >
                                    Sign in
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LoginAdmin;
