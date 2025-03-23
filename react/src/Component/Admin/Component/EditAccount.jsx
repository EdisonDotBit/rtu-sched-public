import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import the CSS

function EditAccount({ selectedaccid, setShowEdit, onSuccess }) {
    // Add onSuccess prop
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const [formData, setFormData] = useState({
        admuser: "",
        admpass: "",
        admname: "",
        admrole: "",
    });
    const [offData, setOffData] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [selectedOffice, setSelectedOffice] = useState("");

    // Handle input changes
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }, []);

    // Handle form submission
    const editAcc = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.admname || !formData.admpass || !formData.admrole) {
            toast.error("Please fill out all fields."); // Show error toast
            return;
        }

        try {
            const res = await axios.put(
                `${apiBaseUrl}/api/admin/edit/${selectedaccid}`,
                formData
            );

            if (res.status === 200) {
                toast.success("Admin edited successfully."); // Show success toast
                setShowEdit(false); // Close the edit modal
                onSuccess(); // Call the onSuccess function to refetch data in the parent
            }
        } catch (error) {
            if (error.response) {
                // Server responded with an error
                toast.error(
                    error.response.data.error ||
                        "Error editing admin. Please double check the details."
                ); // Show error toast
            } else if (error.request) {
                // No response received
                toast.error("No response from the server. Please try again."); // Show error toast
            } else {
                // Other errors
                toast.error("An unexpected error occurred. Please try again."); // Show error toast
            }
        }
    };

    // Fetch account and office data
    useEffect(() => {
        const getAccountData = async () => {
            try {
                const getRes = await axios.get(
                    `${apiBaseUrl}/api/admin/info/${selectedaccid}`
                );
                const responseData = getRes.data.data;
                setFormData({
                    admuser: responseData.admuser,
                    admpass: responseData.admpass,
                    admname: responseData.admname,
                    admrole: responseData.admrole,
                });
                setSelectedOffice(responseData.admrole); // Set the selected office
            } catch (error) {
                console.error("Error fetching account data:", error);
                toast.error("Failed to fetch account data. Please try again."); // Show error toast
            }
        };

        const getOfficesData = async () => {
            try {
                const getRes = await axios.get(`${apiBaseUrl}/api/office/all`);
                setOffData(getRes.data);
            } catch (error) {
                console.error("Error fetching office data:", error);
                toast.error("Failed to fetch office data. Please try again."); // Show error toast
            }
        };

        // Fetch data only if selectedaccid is valid
        if (selectedaccid) {
            getAccountData();
            getOfficesData();
        }
    }, [selectedaccid]);

    // Memoize office options to avoid unnecessary re-renders
    const officeOptions = useMemo(() => {
        return [
            ...new Map(offData.map((item) => [item.offabbr, item])).values(),
        ];
    }, [offData]);

    return (
        <>
            <div className="w-full h-[500px] flex justify-center">
                <div className="w-full md:w-3/4 lg:w-[50%] border border-gray-300 bg-[#194F90] rounded-md shadow-md px-8 py-2">
                    <div className="flex flex-col space-y-4">
                        <div className="flex flex-col space-y-4">
                            <h2 className="text-white text-xl font-semibold text-center mt-4">
                                Edit Admin Account
                            </h2>

                            {/* Admin Name */}
                            <label className="block text-white">
                                Admin Name:
                                <input
                                    className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75]"
                                    name="admname"
                                    value={formData.admname}
                                    onChange={handleChange}
                                    type="text"
                                    aria-label="Admin Name"
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
                                    disabled
                                    aria-label="Username"
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
                                            aria-label="Password"
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
                                            aria-pressed={showPassword}
                                        >
                                            {showPassword ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                </label>
                            </div>

                            {/* Assigned Office */}
                            <label className="block text-white">
                                Assigned Office:
                                <select
                                    className="text-gray-800 bg-white w-full mt-1 py-2 px-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75]"
                                    name="admrole"
                                    value={selectedOffice}
                                    onChange={(e) => {
                                        handleChange(e);
                                        setSelectedOffice(e.target.value);
                                    }}
                                    aria-label="Assigned Office"
                                >
                                    <option value="" disabled>
                                        --Select Office--
                                    </option>
                                    {officeOptions.map((option) => (
                                        <option
                                            key={option.offid}
                                            value={option.offabbr}
                                        >
                                            {option.offabbr}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            {/* Buttons */}
                            <div className="flex justify-center gap-6">
                                <button
                                    className="btn bg-[#FFDB75] text-[#194F90] font-semibold hover:bg-[#f3cd64] hover:text-[#194F90] rounded-md px-6 py-2"
                                    onClick={() => setShowEdit(false)}
                                >
                                    Back
                                </button>
                                <button
                                    type="button"
                                    className="btn bg-[#FFDB75] text-[#194F90] font-semibold hover:bg-[#f3cd64] hover:text-[#194F90] rounded-md px-6 py-2"
                                    onClick={editAcc}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EditAccount;
