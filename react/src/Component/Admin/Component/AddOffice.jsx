import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../../Hooks/useAuth";

function AddOffice() {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const { branch } = useAuth();
    const [formData, setFormData] = useState({
        offabbr: "",
        offname: "",
        offlimit: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const addoff = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(`${apiBaseUrl}/api/office/add`, {
                ...formData,
                offbranch: branch,
            });

            if (res.status === 200) {
                console.log(res.data.message);
                alert("Office added successfully.");
                window.location.reload();
            }
        } catch (error) {
            alert("Error adding office. Please check the fields.");
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
                                    onInput={(e) => {
                                        // Use onInput event to handle input
                                        e.target.value = e.target.value.replace(
                                            /[^0-9]/g,
                                            ""
                                        ); // Remove non-numeric characters
                                    }}
                                    type="text"
                                    placeholder="e.g. 180 = 20 appointments per time slot"
                                />
                            </label>

                            <div className="flex justify-center gap-6">
                                <a href="#main">
                                    <button className="btn btn-outline px-6 text-[#194F90] bg-[#FFDB75] hover:bg-[#f3cd64] hover:text-[#194F90] mt-2">
                                        Back
                                    </button>
                                </a>
                                <button
                                    type="button"
                                    className="btn btn-outline px-6 text-[#194F90] bg-[#FFDB75] hover:bg-[#f3cd64] hover:text-[#194F90] mt-2"
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
