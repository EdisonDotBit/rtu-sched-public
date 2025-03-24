import { useState, useEffect } from "react";
import { useStudentAuth } from "../../Hooks/useStudentAuth";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import the CSS

function ManageAccount() {
    const { user } = useStudentAuth();
    const [formData, setFormData] = useState({
        full_name: "",
        contact_number: "",
        student_number: "",
        email: "",
        username: "",
        password: "",
        role: "",
    });
    const [password, setPassword] = useState(""); // New password input
    const [showPassword, setShowPassword] = useState(false); // Toggle visibility
    const [confirmPassword, setConfirmPassword] = useState(""); // Confirm password input
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
                password: user.password,
                role: user.role,
            });
        }
    }, [user]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle password change separately
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    // Handle account update
    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdateMessage("");

        // Validate password match
        if (password && password !== confirmPassword) {
            toast.error("Passwords do not match."); // Show error toast
            return;
        }

        const token = Cookies.get("studentToken"); // Retrieve token here

        if (!token) {
            toast.error("Authentication token not found. Please log in again."); // Show error toast
            return;
        }

        try {
            const updateData = {
                full_name: formData.full_name,
                contact_number: formData.contact_number,
                password: password || undefined, // Only send password if it's set
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
                toast.success("Account updated successfully."); // Show success toast
                setTimeout(() => {
                    window.location.reload(); // Reload page after successful update
                }, 1000); // Optional delay for better UX
            } else {
                toast.error("Failed to update account. Please try again."); // Show error toast
            }
        } catch (error) {
            console.error("Update failed:", error.response?.data || error);
            toast.error("Failed to update account. Please try again."); // Show error toast
        }
    };

    return (
        <div className="flex flex-col justify-center items-center font-roboto">
            {/* Account Management Box */}
            <div className="w-full max-w-[800px] bg-[#194F90] rounded-lg shadow-md p-6 md:px-8 lg:px-10">
                <form onSubmit={handleUpdate} className="space-y-4">
                    <h2 className="text-white text-2xl font-semibold text-center">
                        Manage Account
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-white">
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

                        <div>
                            <label className="block text-white">Email:</label>
                            <input
                                className="text-gray-800 bg-gray-300 cursor-not-allowed w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg"
                                name="email"
                                type="email"
                                value={formData.email}
                                readOnly
                                disabled
                            />
                        </div>

                        <div>
                            <label className="block text-white">
                                Full Name:
                            </label>
                            <input
                                className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg"
                                name="full_name"
                                type="text"
                                value={formData.full_name}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-white">
                                Contact Number:
                            </label>
                            <input
                                className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg"
                                name="contact_number"
                                type="text"
                                value={formData.contact_number}
                                onChange={handleChange}
                                pattern="^09\d{9}$"
                                title="Contact number must start with '09' and be 11 digits long."
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-white">
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

                        <div className="col-span-2">
                            <label className="block text-white">
                                New Password:
                            </label>
                            <div className="relative">
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"} // Toggle password visibility
                                    value={password}
                                    onChange={handlePasswordChange}
                                    placeholder="Enter New Password"
                                    className="text-gray-800 bg-white w-full mt-1 py-2 px-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75]"
                                />
                                {/* Show/Hide Password Button */}
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
                        </div>

                        <div className="col-span-2">
                            <label className="block text-white">
                                Confirm New Password:
                            </label>
                            <input
                                name="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                placeholder="Confirm New Password"
                                className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-[#FFDB75] text-[#194F90] font-semibold rounded-lg hover:bg-[#f3cd64] transition duration-200"
                    >
                        Update Account
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ManageAccount;
