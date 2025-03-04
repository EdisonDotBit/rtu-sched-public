import { useState, useEffect } from "react";
import { useStudentAuth } from "../../Hooks/useStudentAuth";
import axios from "axios";
import Cookies from "js-cookie";

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
    const [isVerified, setIsVerified] = useState(false);
    const [verificationMessage, setVerificationMessage] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [updateMessage, setUpdateMessage] = useState("");
    const [verificationPin, setVerificationPin] = useState([
        "",
        "",
        "",
        "",
        "",
        "",
    ]); // 6-digit PIN
    const [isPinInputVisible, setIsPinInputVisible] = useState(false); // Show PIN input after request

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
            setIsVerified(user.is_verified);
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

    // Handle PIN input changes
    const handlePinChange = (index, value) => {
        if (/^[0-9]?$/.test(value)) {
            const newPin = [...verificationPin];
            newPin[index] = value;
            setVerificationPin(newPin);

            if (value !== "" && index < 5) {
                document.getElementById(`pin-${index + 1}`).focus();
            }
        }
    };

    // Request verification PIN with validation
    const handleRequestVerification = async () => {
        setIsVerifying(true);
        setVerificationMessage("");

        // Validate student number format
        const studentNumberPattern = /^\d{4}-\d{6}$/; // Ensures ####-###### format
        if (!studentNumberPattern.test(formData.student_number)) {
            setVerificationMessage(
                "Invalid student number format. Use YYYY-######."
            );
            setIsVerifying(false);
            return;
        }

        try {
            const token = Cookies.get("studentToken");
            const response = await axios.post(
                `${apiBaseUrl}/api/users/send-verification-email`,
                { student_number: formData.student_number },
                {
                    withCredentials: true,
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.status === 200) {
                setVerificationMessage("Verification PIN sent to your email.");
                setIsPinInputVisible(true);
            }
        } catch (error) {
            setVerificationMessage("Verification request failed. Try again.");
        } finally {
            setIsVerifying(false);
        }
    };

    // Verify student number using PIN
    const handleVerifyPin = async () => {
        try {
            const token = Cookies.get("studentToken");
            const response = await axios.post(
                `${apiBaseUrl}/api/users/verify-student-number`,
                { pin: verificationPin },
                {
                    withCredentials: true,
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.status === 200) {
                setVerificationMessage("Student number verified successfully!");
                setIsVerified(true);
                setIsPinInputVisible(false);
                setTimeout(() => {
                    window.location.reload();
                }, 1000); // Optional delay for better UX
            }
        } catch (error) {
            setVerificationMessage("Invalid PIN. Please try again.");
        }
    };

    // Handle account update
    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdateMessage("");

        const token = Cookies.get("studentToken"); // Retrieve token here

        if (!token) {
            setUpdateMessage(
                "Authentication token not found. Please log in again."
            );
            return;
        }

        try {
            const updateData = {
                full_name: formData.full_name,
                contact_number: formData.contact_number,
                password: password || undefined, // Only send password if it's set
            };

            // If user entered a new password, include password confirmation
            if (password) {
                updateData.password = password;
                updateData.password_confirmation = password; // Add this line
            }

            console.log("Sending update request:", updateData); // Log request data

            const response = await axios.put(
                `${apiBaseUrl}/api/users/update`,
                updateData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );

            console.log("Update response:", response); // Log response

            if (response.status === 200) {
                setUpdateMessage("Account updated successfully.");
                setTimeout(() => {
                    window.location.reload(); // Reload page after successful update
                }, 1000); // Optional delay for better UX
            } else {
                setUpdateMessage("Failed to update account. Please try again.");
            }
        } catch (error) {
            console.error("Update failed:", error.response?.data || error);
            setUpdateMessage("Failed to update account. Please try again.");
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

                    {updateMessage && (
                        <p className="text-green-400 text-center">
                            {updateMessage}
                        </p>
                    )}

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
                            <div className="flex items-center gap-2 mt-1">
                                <input
                                    className={`text-gray-800 w-full py-2 px-3 border border-gray-300 rounded-lg ${
                                        isVerified
                                            ? "bg-gray-300 cursor-not-allowed"
                                            : "bg-white"
                                    }`}
                                    name="student_number"
                                    type="text"
                                    value={formData.student_number}
                                    onChange={handleChange}
                                    disabled={isVerified}
                                    placeholder="Ex: 2021-101###"
                                    required
                                    pattern="^\d{4}-\d{6}$"
                                    title="Student number must be in the format ####-###### (e.g., 2021-101864)"
                                />
                                {!isVerified && (
                                    <button
                                        type="button"
                                        className="py-2 px-3 bg-[#FFDB75] text-[#194F90] font-semibold rounded-lg hover:bg-[#f3cd64] transition"
                                        onClick={handleRequestVerification}
                                        disabled={isVerifying}
                                    >
                                        {isVerifying ? "Sending..." : "Verify"}
                                    </button>
                                )}
                            </div>
                        </div>

                        {isPinInputVisible && (
                            <div className="col-span-2">
                                <label className="block text-white">
                                    Enter Verification PIN:
                                </label>
                                <div className="flex gap-2">
                                    {verificationPin.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={`pin-${index}`}
                                            type="text"
                                            value={digit}
                                            maxLength={1}
                                            onChange={(e) =>
                                                handlePinChange(
                                                    index,
                                                    e.target.value
                                                )
                                            }
                                            className="w-12 h-12 text-center text-xl border bg-white border-gray-300 rounded-lg"
                                        />
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    className="mt-3 py-2 px-4 bg-[#FFDB75] text-[#194F90] font-semibold rounded-lg hover:bg-[#f3cd64] transition duration-200"
                                    onClick={handleVerifyPin}
                                >
                                    Submit PIN
                                </button>
                            </div>
                        )}

                        <div className="col-span-2">
                            <label className="block text-white">
                                New Password:
                            </label>
                            <div className="relative">
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"} // Toggle password visibility
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
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
