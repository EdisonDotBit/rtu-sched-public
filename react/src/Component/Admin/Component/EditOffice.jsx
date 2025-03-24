import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import the CSS

function EditOffice({ selectedOffid, setShowEdit, onSuccess }) {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const [formData, setFormData] = useState({
        offname: "",
        offabbr: "",
        offlimit: "", // Initialize as empty string to allow empty input
        offbranch: "",
    });
    const [isLoading, setIsLoading] = useState(false); // Loading state

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value, // Keep as string to allow empty input
        }));
    };

    // Fetch office data when selectedOffid changes
    useEffect(() => {
        const getData = async () => {
            try {
                const getRes = await axios.get(
                    `${apiBaseUrl}/api/office/info/${selectedOffid}`
                );
                const responseData = getRes.data.data;
                if (responseData) {
                    setFormData({
                        offabbr: responseData.offabbr,
                        offname: responseData.offname,
                        offlimit: responseData.offlimit.toString(), // Convert to string
                        offbranch: responseData.offbranch,
                    });
                }
            } catch (error) {
                console.error("Error fetching office data:", error);
                toast.error(
                    "Failed to fetch office data. Please try again later."
                );
            }
        };

        if (selectedOffid) {
            getData();
        }
    }, [selectedOffid, apiBaseUrl]);

    // Handle form submission
    const editoff = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Set loading state

        // Convert offlimit to a number before submission
        const offlimitNumber =
            formData.offlimit === "" ? 0 : Number(formData.offlimit);

        // Basic validation
        if (
            !formData.offname ||
            !formData.offabbr ||
            offlimitNumber <= 0 || // Ensure limit is a positive number
            !formData.offbranch
        ) {
            toast.error(
                "Please fill out all fields and ensure the limit is a positive number."
            );
            setIsLoading(false); // Reset loading state
            return;
        }

        // Ensure selectedOffid is valid
        if (!selectedOffid) {
            toast.error("Invalid office ID.");
            setIsLoading(false); // Reset loading state
            return;
        }

        try {
            const res = await axios.put(
                `${apiBaseUrl}/api/office/edit/${selectedOffid}`,
                {
                    ...formData,
                    offlimit: offlimitNumber, // Send as number
                }
            );

            if (res.status === 200) {
                console.log(res.data.message);
                toast.success("Office edited successfully.");
                setShowEdit(false); // Close the edit modal
                onSuccess(); // Call the onSuccess callback to refetch data
            }
        } catch (error) {
            if (error.response) {
                // Server responded with an error
                toast.error(
                    error.response.data.error ||
                        "Error editing office. Please double check the details."
                );
            } else if (error.request) {
                // No response received
                toast.error("No response from the server. Please try again.");
            } else {
                // Other errors
                toast.error("An unexpected error occurred. Please try again.");
            }
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };

    return (
        <>
            <div className="relative z-20 w-full h-full">
                <div className="w-full h-[400px] flex justify-center">
                    <div className="w-full md:w-3/4 lg:w-[50%] border border-gray-300 bg-[#194F90] rounded-md shadow-md px-8 py-2">
                        <div className="flex flex-col space-y-4">
                            <div className="flex flex-col space-y-4">
                                <h2 className="text-white text-xl font-semibold text-center mt-4">
                                    Edit Office
                                </h2>

                                {/* Office Name */}
                                <label className="block text-white">
                                    Office Name:
                                    <input
                                        className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75]"
                                        name="offname"
                                        value={formData.offname}
                                        onChange={handleChange}
                                        type="text"
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
                                        aria-label="Office Abbreviation"
                                    />
                                </label>

                                {/* Office Limit */}
                                <label className="block text-white">
                                    Limit:
                                    <input
                                        name="offlimit"
                                        value={formData.offlimit}
                                        onChange={handleChange}
                                        type="number"
                                        min="1"
                                        className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75]"
                                        aria-label="Appointment Limit"
                                    />
                                </label>

                                {/* Buttons */}
                                <div className="flex justify-center gap-6">
                                    <button
                                        className="btn bg-[#FFDB75] text-[#194F90] font-semibold hover:bg-[#f3cd64] hover:text-[#194F90] rounded-md px-6 py-2"
                                        onClick={() => setShowEdit(false)}
                                        disabled={isLoading} // Disable button while loading
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        className="btn bg-[#FFDB75] text-[#194F90] font-semibold hover:bg-[#f3cd64] hover:text-[#194F90] rounded-md px-6 py-2"
                                        onClick={editoff}
                                        disabled={isLoading} // Disable button while loading
                                    >
                                        {isLoading ? "Saving..." : "Save Edit"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EditOffice;
