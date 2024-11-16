import React, { useEffect, useState } from "react";
import axios from "axios";

function ManageAcc({}) {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const [formData, setFormData] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    useEffect(
        () => async (e) => {
            const items = JSON.parse(localStorage.getItem("user"));
            if (items) {
                try {
                    console.log(items);
                    const getRes = await axios.get(
                        `${apiBaseUrl}/api/admin/informa/${items}`
                    );
                    const responseData = getRes.data.data; // Corrected response data access
                    setFormData({
                        admuser: responseData.admuser,
                        admpass: responseData.admpass,
                        admname: responseData.admname,
                        // admempnum: responseData.admempnum,
                        admid: responseData.admid,
                    });
                    console.log(responseData);
                } catch (error) {
                    console.error("Error fetching office data:", error); // Log the error if there's an issue with the request
                    // Handle the error gracefully, such as showing an error message to the user
                }
            }
        },
        []
    );
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    const editAcc = async (e) => {
        e.preventDefault(); // Prevent page reload
        console.log(formData); // Log the formData

        try {
            const res = await axios.put(
                `${apiBaseUrl}/api/admin/edit/${formData.admid}`,
                formData
            );

            if (res.status === 200) {
                console.log(res.data.message); // Log success message
                alert("Your account edited successfully.");
            }
        } catch (error) {
            alert(
                "Error editing account. Please try again. Please double check the details"
            ); // Notify the user of the error
        }
    };

    return (
        <>
            <div className="w-full h-auto flex justify-center">
                <div className="w-full md:w-3/4 lg:w-[50%] border border-gray-300 bg-[#194F90] rounded-md shadow-md p-8">
                    <div className="flex flex-col space-y-4">
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
                                />
                            </label>
                            {/* Employee Number */}
                            {/* <label className="block text-white">
                                Employee Number
                                <input
                                    className="text-gray-500 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75]"
                                    name="admname"
                                    value={formData.admempnum}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="e.g. SA-D-B0-1"
                                    disabled
                                />
                            </label> */}
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
                                    disabled
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
                                            } // Toggle between text and password type
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

                            <div className="flex justify-center">
                                <button
                                    type="button"
                                    className="btn btn-outline px-10 text-[#194F90] bg-[#FFDB75] hover:bg-[#f3cd64] hover:text-[#194F90] mt-6"
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

export default ManageAcc;
