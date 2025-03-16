import React, { useEffect, useState } from "react";
import axios from "axios";

function EditOffice({ selectedOffid, setShowEdit }) {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const [formData, setFormData] = useState({
        offname: "",
        offabbr: "",
        offlimit: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    useEffect(() => {
        const getData = async () => {
            try {
                const getRes = await axios.get(
                    `${apiBaseUrl}/api/office/info/${selectedOffid}`
                );
                const responseData = getRes.data.data; // Corrected response data access
                setFormData({
                    offabbr: responseData.offabbr,
                    offname: responseData.offname,
                    offlimit: responseData.offlimit,
                });
            } catch (error) {
                console.error("Error fetching office data:", error);
            }
        };
        if (selectedOffid) {
            getData();
        }
    }, [selectedOffid]);

    const editoff = async (e) => {
        e.preventDefault(); // Prevent page reload
        console.log(formData); // Log the formData

        try {
            const res = await axios.put(
                `${apiBaseUrl}/api/office/edit/${selectedOffid}`,
                formData
            );

            if (res.status === 200) {
                console.log(res.data.message); // Log success message
                alert("Office edited successfully.");
                window.location.reload();
            }
        } catch (error) {
            console.error("Error adding office:", error); // Log the error response
            alert(
                "Error editing office. Please try again. Please double check the details"
            ); // Notify the user of the error
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
                                    />
                                </label>
                                {/* Office Limit */}
                                <label className="block text-white">
                                    Limit :
                                    <input
                                        name="offlimit"
                                        value={formData.offlimit}
                                        onChange={handleChange}
                                        onInput={(e) => {
                                            // Use onInput event to handle input
                                            e.target.value =
                                                e.target.value.replace(
                                                    /[^0-9]/g,
                                                    ""
                                                ); // Remove non-numeric characters
                                        }}
                                        type="text"
                                        className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75]"
                                    />
                                </label>

                                <div className="flex justify-center gap-6">
                                    <button
                                        className="btn bg-[#FFDB75] text-[#194F90] font-semibold  hover:bg-[#f3cd64] hover:text-[#194F90] rounded-md px-6 py-2"
                                        onClick={() => setShowEdit(false)}
                                    >
                                        Back
                                    </button>

                                    <button
                                        type="button"
                                        className="btn bg-[#FFDB75] text-[#194F90] font-semibold  hover:bg-[#f3cd64] hover:text-[#194F90] rounded-md px-6 py-2"
                                        onClick={editoff}
                                    >
                                        Save Edit
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
