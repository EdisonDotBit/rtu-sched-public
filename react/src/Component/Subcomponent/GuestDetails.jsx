import React, { useState } from "react";
import Purpose from "./Purpose";

function GuestDetails({ formData, setFormData, errors }) {
    const [touched, setTouched] = useState({
        aptstudnum: false,
        aptname: false,
        aptpnumber: false,
        aptemail: false,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched((prevState) => ({
            ...prevState,
            [name]: true,
        }));
    };

    return (
        <>
            <div className="w-full h-auto flex justify-center">
                {/* Main container */}
                <div className="w-full md:w-3/4 lg:w-[55%] border border-gray-300 bg-[#194F90] rounded-md shadow-md p-8">
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
                                onBlur={handleBlur} // Track blur
                                type="text"
                                placeholder="e.g. 12345 / Phil. ID"
                                onInput={(e) => {
                                    e.target.value = e.target.value.replace(
                                        /[^0-9a-zA-Z\s\/.]/g,
                                        ""
                                    );
                                }}
                                required
                            />
                        </label>
                        {touched.aptstudnum && errors.aptstudnum && (
                            <p className="text-[#FFDB75] text-sm !mt-2">
                                {errors.aptstudnum}
                            </p>
                        )}

                        {/* Full Name */}
                        <label className="block text-white">
                            Full Name:
                            <input
                                className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75]"
                                name="aptname"
                                value={formData.aptname}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                type="text"
                                placeholder="e.g. Juan A. Dela Cruz"
                                onInput={(e) => {
                                    e.target.value = e.target.value.replace(
                                        /[^a-zA-Z\s\.\-\']+/g,
                                        ""
                                    );
                                }}
                            />
                        </label>
                        {touched.aptname && errors.aptname && (
                            <p className="text-[#FFDB75] text-sm !mt-2">
                                {errors.aptname}
                            </p>
                        )}

                        {/* Contact Number */}
                        <label className="block text-white">
                            Contact Number:
                            <input
                                className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75]"
                                name="aptpnumber"
                                value={formData.aptpnumber}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                type="tel"
                                placeholder="09#########"
                                onInput={(e) => {
                                    e.target.value = e.target.value
                                        .replace(/[^0-9]/g, "")
                                        .slice(0, 11);
                                }}
                            />
                        </label>
                        {touched.aptpnumber && errors.aptpnumber && (
                            <p className="text-[#FFDB75] text-sm !mt-2">
                                {errors.aptpnumber}
                            </p>
                        )}

                        {/* Personal Email */}
                        <label className="block text-white">
                            Email Address
                            <input
                                className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75]"
                                name="aptemail"
                                value={formData.aptemail}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                type="email"
                                placeholder="e.g. email@gmail.com"
                            />
                        </label>
                        {touched.aptemail && errors.aptemail && (
                            <p className="text-[#FFDB75] text-sm !mt-2">
                                {errors.aptemail}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default GuestDetails;
