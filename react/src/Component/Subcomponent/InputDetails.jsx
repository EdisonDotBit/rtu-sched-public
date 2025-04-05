import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Purpose from "./Purpose";

function InputDetails({ formData, setFormData, errors }) {
    const [touched, setTouched] = useState({
        aptstudnum: false,
        aptname: false,
        aptpnumber: false,
        aptemail: false,
    });

    const fileInputRef = useRef(null);
    const MAX_TOTAL_SIZE = 5 * 1024 * 1024; // Changed to 5MB in bytes

    // Helper to format file sizes
    const formatFileSize = (bytes) => {
        if (bytes < 1024) return `${bytes} bytes`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // Calculate total size
        const currentTotal = formData.aptattach.reduce(
            (sum, file) => sum + file.size,
            0
        );
        const newFilesSize = files.reduce((sum, file) => sum + file.size, 0);
        const totalSize = currentTotal + newFilesSize;

        // Validate total size
        if (totalSize > MAX_TOTAL_SIZE) {
            toast.error(
                `Total size exceeds 5MB limit (${formatFileSize(totalSize)})`
            );
            return;
        }

        // Update state
        setFormData((prev) => ({
            ...prev,
            aptattach: [...prev.aptattach, ...files],
        }));

        fileInputRef.current.value = "";
        toast.success(
            `Added ${files.length} file(s). Total: ${formatFileSize(totalSize)}`
        );
    };

    const removeFile = (index) => {
        setFormData((prev) => ({
            ...prev,
            aptattach: prev.aptattach.filter((_, i) => i !== index),
        }));
        toast.info("File removed.");
    };

    // Calculate current total size for display
    const currentTotalSize = formData.aptattach.reduce(
        (sum, file) => sum + file.size,
        0
    );

    return (
        <div className="flex justify-center">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-[#194F90] p-6">
                    <h2 className="text-2xl font-bold text-white">
                        Appointment Details
                    </h2>
                    <p className="text-blue-100">
                        Please provide your information
                    </p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Purpose Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Purpose
                        </h3>
                        <span className="text-sm text-gray-500">
                            To view requirements, click the information icon
                            next to selected purpose.
                        </span>
                        <Purpose
                            formData={formData}
                            setFormData={setFormData}
                            errors={errors}
                        />
                    </div>

                    {/* File Upload Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Attachments
                        </h3>
                        <span className="text-sm text-gray-500">
                            Please check requirements first for any needed
                            attachments.
                        </span>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 mt-1">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current.click()}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Insert
                                </button>
                                <span className="text-sm text-gray-500">
                                    PDF, JPG, PNG (max 5MB total)
                                </span>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    multiple
                                    accept="image/*, application/pdf"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </div>

                            {/* Size indicator with fixed width */}
                            <div className="w-full md:w-64">
                                <p className="text-xs text-gray-600">
                                    Current total:{" "}
                                    {formatFileSize(currentTotalSize)} / 5MB
                                </p>
                            </div>

                            {/* File List */}
                            {formData.aptattach.length > 0 ? (
                                <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                                    {formData.aptattach.map((file, index) => (
                                        <div
                                            key={index}
                                            className="p-3 flex items-center justify-between hover:bg-gray-50"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-medium text-gray-700">
                                                        {file.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {formatFileSize(
                                                            file.size
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeFile(index)
                                                }
                                                className="p-1 text-gray-400 hover:text-red-500 rounded-full transition-colors"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 text-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                                    <p className="text-gray-500">
                                        No files selected
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Personal Information Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                {
                                    label: "Student Number",
                                    name: "aptstudnum",
                                    type: "text",
                                    placeholder: "2021-######",
                                    icon: (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-gray-400"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                                        </svg>
                                    ),
                                },
                                {
                                    label: "Full Name",
                                    name: "aptname",
                                    type: "text",
                                    placeholder: "Juan A. Dela Cruz",
                                    icon: (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-gray-400"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    ),
                                },
                                {
                                    label: "Contact Number",
                                    name: "aptpnumber",
                                    type: "tel",
                                    placeholder: "09#########",
                                    icon: (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-gray-400"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                        </svg>
                                    ),
                                },
                                {
                                    label: "Institute Email",
                                    name: "aptemail",
                                    type: "email",
                                    placeholder: "2021-######@rtu.edu.ph",
                                    icon: (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-gray-400"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                    ),
                                },
                            ].map((field) => (
                                <div key={field.name} className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">
                                        {field.label}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            {field.icon}
                                        </div>
                                        <input
                                            className={`w-full pl-10 pr-3 py-2 border ${
                                                errors[field.name] &&
                                                touched[field.name]
                                                    ? "border-red-300"
                                                    : "border-gray-300"
                                            } rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                            name={field.name}
                                            value={formData[field.name]}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            type={field.type}
                                            placeholder={field.placeholder}
                                            disabled
                                        />
                                    </div>
                                    {touched[field.name] &&
                                        errors[field.name] && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors[field.name]}
                                            </p>
                                        )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InputDetails;
