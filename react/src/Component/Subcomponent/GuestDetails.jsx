import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Purpose from "./Purpose";

function GuestDetails({ formData, setFormData, errors }) {
    const [touched, setTouched] = useState({
        aptstudnum: false,
        aptname: false,
        aptpnumber: false,
        aptemail: false,
    });

    const fileInputRef = useRef(null); // Ref for file input

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle input blur (for validation)
    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched((prev) => ({
            ...prev,
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
        fileInputRef.current.value = ""; // Clear the file input
        toast.success(`${files.length} file(s) added.`);
    };

    // Handle file removal
    const removeFile = (index) => {
        setFormData((prev) => ({
            ...prev,
            aptattach: prev.aptattach.filter((_, i) => i !== index), // Remove file by index
        }));
        toast.info("File removed.");
    };

    // Input validation and formatting
    const formatInput = (e, type) => {
        switch (type) {
            case "id":
                e.target.value = e.target.value.replace(
                    /[^0-9a-zA-Z\s\/.]/g,
                    ""
                );
                break;
            case "name":
                e.target.value = e.target.value.replace(
                    /[^a-zA-Z\s\.\-\']+/g,
                    ""
                );
                break;
            case "phone":
                e.target.value = e.target.value
                    .replace(/[^0-9]/g, "")
                    .slice(0, 11);
                break;
            default:
                break;
        }
    };

    return (
        <div className="w-full h-auto flex justify-center">
            {/* Main container */}
            <div className="w-full md:w-3/4 lg:w-[55%] border border-gray-300 bg-[#194F90] rounded-md shadow-md p-8">
                {/* Purpose Selection */}
                <div className="mb-6">
                    <Purpose
                        formData={formData}
                        setFormData={setFormData}
                        errors={errors}
                    />

                    {/* File Upload Section */}
                    <label className="block text-white mt-4">
                        Attach Files (PDF & Image):
                        <div className="mt-4">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current.click()}
                                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                                aria-label="Choose files"
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
                                aria-label="File input"
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
                                        <span
                                            className="text-gray-800 truncate w-44"
                                            title={file.name}
                                        >
                                            {file.name}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => removeFile(index)}
                                            className="text-red-600 hover:text-red-800 transition"
                                            aria-label="Remove file"
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
                    <h2 className="text-white text-xl font-semibold text-center mt-4">
                        Personal Details
                    </h2>

                    {/* Input Fields */}
                    {[
                        {
                            label: "ID Number / Type",
                            name: "aptstudnum",
                            type: "text",
                            placeholder: "e.g. 12345 / Phil. ID",
                            format: "id",
                        },
                        {
                            label: "Full Name",
                            name: "aptname",
                            type: "text",
                            placeholder: "e.g. Juan A. Dela Cruz",
                            format: "name",
                        },
                        {
                            label: "Contact Number",
                            name: "aptpnumber",
                            type: "tel",
                            placeholder: "09#########",
                            format: "phone",
                        },
                        {
                            label: "Email Address",
                            name: "aptemail",
                            type: "email",
                            placeholder: "e.g. email@gmail.com",
                            format: null,
                        },
                    ].map((field) => (
                        <div key={field.name}>
                            <label className="block text-white mb-2">
                                {field.label}:
                                <input
                                    className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75]"
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    onInput={(e) =>
                                        formatInput(e, field.format)
                                    }
                                    required={field.name === "aptstudnum"}
                                    aria-label={field.label}
                                />
                            </label>
                            {touched[field.name] && errors[field.name] && (
                                <p className="text-[#FFDB75] text-sm">
                                    {errors[field.name]}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default GuestDetails;
