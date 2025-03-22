import React, { useState, useRef } from "react";
import Purpose from "./Purpose";

function InputDetails({ formData, setFormData, errors }) {
    const [touched, setTouched] = useState({
        aptstudnum: false,
        aptname: false,
        aptpnumber: false,
        aptemail: false,
    });

    const fileInputRef = useRef(null); // Create a ref for the file input

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

    // Handle file selection
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files); // Convert FileList to Array
        setFormData((prev) => ({
            ...prev,
            aptattach: [...prev.aptattach, ...files], // Append selected files
        }));
        fileInputRef.current.value = ""; // Clear the file input so users can reselect
    };

    // Handle file removal
    const removeFile = (index) => {
        setFormData((prev) => ({
            ...prev,
            aptattach: prev.aptattach.filter((_, i) => i !== index), // Remove file by index
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
                            errors={errors}
                        />
                        <label className="block text-white mt-4">
                            Attach Files (PDF & Image):
                            <div className="mt-4">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current.click()}
                                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                                >
                                    Choose Files
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    multiple
                                    accept="image/*, application/pdf"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </label>
                        {/* Display selected files */}
                        <div className="mt-4 bg-white p-4 rounded-lg shadow-inner">
                            <h3 className="text-gray-800 font-medium mb-2">
                                Selected Files:
                            </h3>
                            {formData.aptattach.length > 0 ? (
                                <ul className="space-y-2">
                                    {formData.aptattach.map((file, index) => (
                                        <li
                                            key={index}
                                            className="flex items-center justify-between bg-gray-100 p-2 rounded-lg shadow-sm overflow-hidden"
                                        >
                                            {/* Show file name with truncation */}
                                            <span className="text-gray-800 truncate w-44">
                                                {file.name}
                                            </span>
                                            {/* Remove file button */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeFile(index)
                                                }
                                                className="text-red-600 hover:text-red-800 transition"
                                            >
                                                ✕
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 text-sm">
                                    No files selected yet.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Personal Details Section */}
                    <div className="flex flex-col space-y-4">
                        <h2 className="text-white text-xl font-semibold text-center mt-2">
                            Personal Details
                        </h2>

                        {/* Student Number */}
                        <label className="block text-white">
                            Student Number:
                            <input
                                className="cursor-not-allowed text-gray-800 bg-gray-300 w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75]"
                                name="aptstudnum"
                                value={formData.aptstudnum}
                                onChange={handleChange}
                                onBlur={handleBlur} // Track blur
                                type="text"
                                placeholder="e.g. 2021-######"
                                disabled
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
                                className="cursor-not-allowed text-gray-800 bg-gray-300 w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75]"
                                name="aptname"
                                value={formData.aptname}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                type="text"
                                placeholder="e.g. Juan A. Dela Cruz"
                                disabled
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
                                className="cursor-not-allowed text-gray-800 bg-gray-300 w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75]"
                                name="aptpnumber"
                                value={formData.aptpnumber}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                type="tel"
                                placeholder="09#########"
                                disabled
                            />
                        </label>
                        {touched.aptpnumber && errors.aptpnumber && (
                            <p className="text-[#FFDB75] text-sm !mt-2">
                                {errors.aptpnumber}
                            </p>
                        )}

                        {/* Institute Email */}
                        <label className="block text-white">
                            Institute Email:
                            <input
                                className="cursor-not-allowed text-gray-800 bg-gray-300 w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75]"
                                name="aptemail"
                                value={formData.aptemail}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                type="email"
                                placeholder="e.g. 2021-######@rtu.edu.ph"
                                disabled
                            />
                        </label>
                    </div>
                </div>
            </div>
        </>
    );
}

export default InputDetails;
