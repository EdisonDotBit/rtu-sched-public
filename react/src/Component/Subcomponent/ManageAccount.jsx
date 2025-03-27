import { useState, useEffect } from "react";
import { useStudentAuth } from "../../Hooks/useStudentAuth";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function ManageAccount() {
    const { user } = useStudentAuth();
    const [formData, setFormData] = useState({
        full_name: "",
        contact_number: "",
        student_number: "",
        email: "",
        username: "",
        role: "",
    });
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [updateMessage, setUpdateMessage] = useState("");

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.full_name,
                contact_number: user.contact_number,
                student_number: user.student_number || "",
                email: user.email,
                username: user.username,
                role: user.role,
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdateMessage("");

        if (password && password !== passwordConfirmation) {
            toast.error("Passwords do not match.");
            return;
        }

        const token = Cookies.get("studentToken");

        if (!token) {
            toast.error("Authentication token not found. Please log in again.");
            return;
        }

        try {
            const updateData = {
                full_name: formData.full_name,
                contact_number: formData.contact_number,
                ...(password && {
                    password: password,
                    password_confirmation: passwordConfirmation,
                }),
            };

            const response = await axios.put(
                `${apiBaseUrl}/api/users/update`,
                updateData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );

            if (response.status === 200) {
                toast.success("Account updated successfully.");
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        } catch (error) {
            console.error("Update failed:", error.response?.data || error);
            toast.error(
                error.response?.data?.message ||
                    "Failed to update account. Please try again."
            );
        }
    };

    return (
        <div className="flex flex-col justify-center items-center font-roboto">
            <div className="w-full max-w-[800px] bg-[#194F90] rounded-lg shadow-md p-4 md:p-6 lg:px-8">
                <form onSubmit={handleUpdate} className="space-y-4">
                    <h2 className="text-white text-xl md:text-2xl font-semibold text-center">
                        Manage Account
                    </h2>

                    <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
                        {/* Username */}
                        <div className="w-full">
                            <label className="block text-white text-sm md:text-base">
                                Username:
                            </label>
                            <input
                                className="text-gray-800 bg-gray-300 cursor-not-allowed w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg"
                                name="username"
                                type="text"
                                value={formData.username}
                                readOnly
                                disabled
                            />
                        </div>

                        {/* Email */}
                        <div className="w-full">
                            <label className="block text-white text-sm md:text-base">
                                Email:
                            </label>
                            <input
                                className="text-gray-800 bg-gray-300 cursor-not-allowed w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg"
                                name="email"
                                type="email"
                                value={formData.email}
                                readOnly
                                disabled
                            />
                        </div>

                        {/* Full Name */}
                        <div className="w-full">
                            <label className="block text-white text-sm md:text-base">
                                Full Name:
                            </label>
                            <input
                                className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75]"
                                name="full_name"
                                type="text"
                                value={formData.full_name}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Contact Number */}
                        <div className="w-full">
                            <label className="block text-white text-sm md:text-base">
                                Contact Number:
                            </label>
                            <input
                                className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75]"
                                name="contact_number"
                                type="text"
                                value={formData.contact_number}
                                onChange={handleChange}
                                pattern="^09\d{9}$"
                                title="Contact number must start with '09' and be 11 digits long."
                            />
                        </div>

                        {/* Student Number */}
                        <div className="w-full md:col-span-2">
                            <label className="block text-white text-sm md:text-base">
                                Student Number:
                            </label>
                            <input
                                className="text-gray-800 bg-gray-300 cursor-not-allowed w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg"
                                name="student_number"
                                type="text"
                                value={formData.student_number}
                                readOnly
                                disabled
                            />
                        </div>

                        {/* New Password */}
                        <div className="w-full md:col-span-2">
                            <label className="block text-white text-sm md:text-base">
                                New Password:
                            </label>
                            <div className="relative">
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                                    title="Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character."
                                    placeholder="Enter New Password"
                                    className="text-gray-800 bg-white w-full mt-1 py-2 px-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75]"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? (
                                        <FaEye className="w-5 h-5" /> // Show open eye when password is visible
                                    ) : (
                                        <FaEyeSlash className="w-5 h-5" /> // Show slashed eye when password is hidden
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="w-full md:col-span-2">
                            <label className="block text-white text-sm md:text-base">
                                Confirm New Password:
                            </label>
                            <input
                                name="password_confirmation"
                                type="password"
                                value={passwordConfirmation}
                                onChange={(e) =>
                                    setPasswordConfirmation(e.target.value)
                                }
                                placeholder="Confirm New Password"
                                className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75]"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-[#FFDB75] text-[#194F90] font-semibold rounded-lg hover:bg-[#f3cd64] transition duration-200 mt-4"
                    >
                        Update Account
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ManageAccount;
