import React from "react";
import Purpose from "./Purpose";

function GuestDetails({ formData, setFormData }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    return (
        <>
            <div className="w-full h-auto flex justify-center">
                {/* Main container */}
                <div className="w-full md:w-3/4 lg:w-[55%] border border-gray-300 bg-[#194F90] rounded-md shadow-md p-8">
                    {/* Student Details Header */}
                    {/* <h1 className="text-2xl font-bold text-center mb-6 underline">
                        Student Details
                    </h1> */}

                    {/* Purpose Selection (Dropdown) */}
                    <div className="mb-6">
                        <Purpose
                            formData={formData}
                            setFormData={setFormData}
                        />
                    </div>

                    {/* Personal Details Section */}
                    <div className="flex flex-col space-y-4">
                        <h2 className="text-white text-xl font-semibold text-center mt-4">
                            Personal Details
                        </h2>

                        {/* ID Number / Type */}
                        <label className="block text-white">
                           ID Number / Type:
                            <input
                                className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75]"
                                name="aptstudnum"
                                value={formData.aptstudnum}
                                onChange={handleChange}
                                type="text"
                                placeholder="eg. 12345 / Phil. ID"
                                onInput={(e) => {
                                    e.target.value = e.target.value.replace(
                                        /[^0-9\/]/g,
                                        ""
                                    );
                                }}
                            />
                        </label>

                        {/* Full Name */}
                        <label className="block text-white">
                            Full Name:
                            <input
                                className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75]"
                                name="aptname"
                                value={formData.aptname}
                                onChange={handleChange}
                                type="text"
                                placeholder="e.g. Juan A. Dela Cruz"
                            />
                        </label>

                        {/* Contact Number */}
                        <label className="block text-white">
                            Contact Number:
                            <input
                                className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75]"
                                name="aptpnumber"
                                value={formData.aptpnumber}
                                onChange={handleChange}
                                type="tel"
                                placeholder="09#########"
                                onInput={(e) => {
                                    e.target.value = e.target.value.replace(
                                        /[^0-9/+]/g,
                                        ""
                                    );
                                }}
                            />
                        </label>

                        {/* Email */}
                        <label className="block text-white">
                            Email Address
                            <input
                                className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75]"
                                name="aptemail"
                                value={formData.aptemail}
                                onChange={handleChange}
                                type="email"
                                placeholder="email@gmail.com"
                            />
                        </label>
                    </div>
                </div>
            </div>
        </>
    );
}

export default GuestDetails;
