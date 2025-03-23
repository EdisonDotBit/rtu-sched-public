import React, { useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../../../Hooks/useAuth";

function AddOffice({ setShowAdd, onSuccess }) {
    // Add onSuccess prop
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const { branch } = useAuth();
    const [formData, setFormData] = useState({
        offabbr: "",
        offname: "",
        offlimit: "",
    });

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: name === "offlimit" ? Number(value) : value, // Convert to number for offlimit
        }));
    }, []);

    const addoff = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.offname || !formData.offabbr || !formData.offlimit) {
            alert("Please fill out all fields.");
            return;
        }

        // Validate appointment limit (must be a number)
        if (isNaN(formData.offlimit)) {
            alert("Appointment limit must be a number.");
            return;
        }

        try {
            const res = await axios.post(`${apiBaseUrl}/api/office/add`, {
                ...formData,
                offbranch: branch,
            });

            if (res.status === 200) {
                console.log(res.data.message);
                alert("Office added successfully.");
                onSuccess(); // Call the onSuccess callback to refetch data
                setShowAdd(false); // Close the AddOffice modal
            }
        } catch (error) {
            if (error.response) {
                // Server responded with an error
                alert(
                    error.response.data.error ||
                        "Error adding office. Please double check the details."
                );
            } else if (error.request) {
                // No response received
                alert("No response from the server. Please try again.");
            } else {
                // Other errors
                alert("An unexpected error occurred. Please try again.");
            }
        }
    };

    return (
        <>
            <div className="w-full h-[420px] flex justify-center">
                <div className="w-full md:w-3/4 lg:w-[50%] border border-gray-300 bg-[#194F90] rounded-md shadow-md px-8 py-2">
                    <div className="flex flex-col space-y-4">
                        <div className="flex flex-col space-y-4">
                            <h2 className="text-white text-xl font-semibold text-center mt-4">
                                Add Office
                            </h2>
                            {/* Full Name */}
                            <label className="block text-white">
                                Office Name:
                                <input
                                    className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75]"
                                    name="offname"
                                    value={formData.offname}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="Enter Office Name"
                                    aria-label="Office Name"
                                />
                            </label>

                            {/* Office Abbreviation */}
                            <label className="block text-white">
                                Office Abbreviation:
                                <input
                                    className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75]"
                                    name="offabbr"
                                    value={formData.offabbr}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="e.g. MISO"
                                    aria-label="Office Abbreviation"
                                />
                            </label>

                            {/* Appointment Limit */}
                            <label className="block text-white">
                                Appointment Limit:
                                <input
                                    className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75]"
                                    name="offlimit"
                                    value={formData.offlimit}
                                    onChange={handleChange}
                                    type="number"
                                    min="1"
                                    placeholder="e.g. 180 = 20 appointments per time slot"
                                    aria-label="Appointment Limit"
                                />
                            </label>

                            <div className="flex justify-center gap-6 mt-4">
                                <button
                                    className="btn bg-[#FFDB75] text-[#194F90] font-semibold hover:bg-[#f3cd64] hover:text-[#194F90] rounded-md px-6 py-2"
                                    onClick={() => setShowAdd(false)}
                                >
                                    Back
                                </button>

                                <button
                                    type="button"
                                    className="btn bg-[#FFDB75] text-[#194F90] font-semibold  hover:bg-[#f3cd64] hover:text-[#194F90] rounded-md px-6 py-2"
                                    onClick={addoff}
                                >
                                    Add Office
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AddOffice;
