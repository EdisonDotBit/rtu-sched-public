import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { useDebouncedEffect } from "../../Hooks/useDebouncedEffect";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import the CSS

function ManageAcc() {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const [formData, setFormData] = useState({
        admname: "",
        admuser: "",
        admpass: "",
        admid: "",
        admrole: "", // Add admrole to the state
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false); // Loading state

    // Fetch admin data on mount
    useDebouncedEffect(
        () => {
            const fetchData = async () => {
                const items = JSON.parse(localStorage.getItem("user"));
                if (items) {
                    try {
                        const getRes = await axios.get(
                            `${apiBaseUrl}/api/admin/informa/${items}`
                        );
                        const responseData = getRes.data.data; // Corrected response data access
                        setFormData({
                            admuser: responseData.admuser || "",
                            admpass: responseData.admpass || "",
                            admname: responseData.admname || "",
                            admid: responseData.admid || "",
                            admrole: responseData.admrole || "", // Fetch and set admrole
                        });
                    } catch (error) {
                        console.error("Error fetching admin data:", error);
                        toast.error(
                            "Failed to fetch admin data. Please try again."
                        );
                    }
                }
            };
            fetchData();
        },
        [apiBaseUrl],
        500
    );

    // Handle form input changes
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }, []);

    // Handle form submission
    const editAcc = useCallback(
        async (e) => {
            e.preventDefault();

            // Basic form validation
            if (!formData.admname || !formData.admpass) {
                toast.error("Please fill in all fields.");
                return;
            }

            setLoading(true); // Set loading state

            try {
                const res = await axios.put(
                    `${apiBaseUrl}/api/admin/edit/${formData.admid}`,
                    formData // Include admrole in the payload
                );

                if (res.status === 200) {
                    toast.success("Your account was edited successfully.");
                }
            } catch (error) {
                toast.error(
                    error.response?.data?.message ||
                        "Error editing account. Please try again."
                );
            } finally {
                setLoading(false); // Reset loading state
            }
        },
        [apiBaseUrl, formData]
    );

    // Memoize the password toggle icon
    const passwordToggleIcon = useMemo(
        () =>
            showPassword ? (
                <FaEyeSlash className="w-5 h-5" />
            ) : (
                <FaEye className="w-5 h-5" />
            ),
        [showPassword]
    );

    return (
        <div className="w-full h-auto flex justify-center">
            <div className="w-full md:w-3/4 lg:w-[50%] border border-gray-300 bg-[#194F90] rounded-md shadow-md p-8">
                <div className="flex flex-col space-y-4">
                    <h2 className="text-white text-xl font-semibold text-center mt-4">
                        Account Settings
                    </h2>

                    {/* Full Name */}
                    <label className="block text-white">
                        Full Name:
                        <input
                            className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75]"
                            name="admname"
                            value={formData.admname}
                            onChange={handleChange}
                            type="text"
                            placeholder="Enter Full Name"
                            disabled={loading} // Disable input while loading
                        />
                    </label>

                    {/* Username */}
                    <label className="block text-white">
                        Username:
                        <input
                            className="text-gray-500 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75]"
                            name="admuser"
                            value={formData.admuser}
                            onChange={handleChange}
                            type="text"
                            placeholder="Enter Username"
                            disabled // Username is disabled
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
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter Password"
                                    className="text-gray-800 bg-white w-full mt-1 py-2 px-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75]"
                                    disabled={loading} // Disable input while loading
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
                                    disabled={loading} // Disable button while loading
                                >
                                    {passwordToggleIcon}
                                </button>
                            </div>
                        </label>
                    </div>

                    {/* Hidden admrole field (not displayed in UI but included in formData) */}
                    <input
                        type="hidden"
                        name="admrole"
                        value={formData.admrole}
                    />

                    {/* Save Button */}
                    <div className="flex justify-center">
                        <button
                            type="button"
                            className="btn bg-[#FFDB75] text-[#194F90] font-semibold hover:bg-[#f3cd64] hover:text-[#194F90] rounded-md px-6 py-2 mt-4"
                            onClick={editAcc}
                            disabled={loading} // Disable button while loading
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManageAcc;
