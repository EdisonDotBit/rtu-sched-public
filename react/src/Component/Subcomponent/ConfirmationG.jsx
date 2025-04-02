import React from "react";

function ConfirmtionG({ formData, setFormData }) {
    return (
        <div className="flex flex-col w-full">
            <div className="w-full">
                <h4 className="text-justify text-xs text-gray-500 mb-2 md:mb-4 italic">
                    Warning: Incorrect information may result in the
                    cancellation of appointment.
                </h4>

                {/* Personal Information Section */}
                <div className="bg-white rounded-lg border border-gray-100 shadow-sm mb-4 md:mb-6 overflow-hidden">
                    <dl className="divide-y divide-gray-100 text-sm">
                        {/* Personal Information Header */}
                        <div className="grid grid-cols-1 p-3 bg-[#194F90] text-white">
                            <dt className="font-bold text-white text-base sm:text-lg text-center md:text-left">
                                PERSONAL INFORMATION
                            </dt>
                        </div>

                        {/* Personal Information Rows */}
                        <div className="grid grid-cols-1 p-3 sm:grid-cols-3 sm:gap-4">
                            <dt className="font-semibold text-[#3B3838] md:ml-4 lg:ml-10 text-center md:text-left">
                                ID Number / Type
                            </dt>
                            <dd className="text-gray-700 sm:col-span-2 text-center sm:text-left break-words">
                                {formData.aptstudnum}
                            </dd>
                        </div>

                        <div className="grid grid-cols-1 p-3 sm:grid-cols-3 sm:gap-4">
                            <dt className="font-semibold text-[#3B3838] md:ml-4 lg:ml-10 text-center md:text-left">
                                Full Name
                            </dt>
                            <dd className="text-gray-700 sm:col-span-2 text-center sm:text-left break-words">
                                {formData.aptname}
                            </dd>
                        </div>

                        <div className="grid grid-cols-1 p-3 sm:grid-cols-3 sm:gap-4">
                            <dt className="font-semibold text-[#3B3838] md:ml-4 lg:ml-10 text-center md:text-left">
                                Contact Number
                            </dt>
                            <dd className="text-gray-700 sm:col-span-2 text-center sm:text-left break-words">
                                {formData.aptpnumber}
                            </dd>
                        </div>

                        <div className="grid grid-cols-1 p-3 sm:grid-cols-3 sm:gap-4">
                            <dt className="font-semibold text-[#3B3838] md:ml-4 lg:ml-10 text-center md:text-left">
                                Email Address
                            </dt>
                            <dd className="text-gray-700 sm:col-span-2 text-center sm:text-left break-words">
                                {formData.aptemail}
                            </dd>
                        </div>
                    </dl>
                </div>

                {/* Appointment Information Section */}
                <div className="bg-white rounded-lg border border-gray-100 shadow-sm mb-4 md:mb-6 overflow-hidden">
                    <dl className="divide-y divide-gray-100 text-sm">
                        {/* Appointment Information Header */}
                        <div className="grid grid-cols-1 p-3 bg-[#194F90] text-white">
                            <dt className="font-bold text-white text-base sm:text-lg text-center md:text-left">
                                APPOINTMENT INFORMATION
                            </dt>
                        </div>

                        {/* Appointment Information Rows */}
                        <div className="grid grid-cols-1 p-3 sm:grid-cols-3 sm:gap-4">
                            <dt className="font-semibold text-[#3B3838] md:ml-4 lg:ml-10 text-center md:text-left">
                                Account Type
                            </dt>
                            <dd className="text-gray-700 sm:col-span-2 text-center sm:text-left break-words">
                                {formData.apttype}
                            </dd>
                        </div>

                        <div className="grid grid-cols-1 p-3 sm:grid-cols-3 sm:gap-4">
                            <dt className="font-semibold text-[#3B3838] md:ml-4 lg:ml-10 text-center md:text-left">
                                RTU Branch
                            </dt>
                            <dd className="text-gray-700 sm:col-span-2 text-center sm:text-left break-words">
                                {formData.aptbranch}
                            </dd>
                        </div>

                        <div className="grid grid-cols-1 p-3 sm:grid-cols-3 sm:gap-4">
                            <dt className="font-semibold text-[#3B3838] md:ml-4 lg:ml-10 text-center md:text-left">
                                Office Name
                            </dt>
                            <dd className="text-gray-700 sm:col-span-2 text-center sm:text-left break-words">
                                {formData.aptoffice}
                            </dd>
                        </div>

                        <div className="grid grid-cols-1 p-3 sm:grid-cols-3 sm:gap-4">
                            <dt className="font-semibold text-[#3B3838] md:ml-4 lg:ml-10 text-center md:text-left">
                                Purpose
                            </dt>
                            <dd className="text-gray-700 sm:col-span-2 text-center sm:text-left break-words">
                                {formData.aptpurpose}
                            </dd>
                        </div>

                        <div className="grid grid-cols-1 p-3 sm:grid-cols-3 sm:gap-4">
                            <dt className="font-semibold text-[#3B3838] md:ml-4 lg:ml-10 text-center md:text-left">
                                Date
                            </dt>
                            <dd className="text-gray-700 sm:col-span-2 text-center sm:text-left break-words">
                                {formData.aptdate}
                            </dd>
                        </div>

                        <div className="grid grid-cols-1 p-3 sm:grid-cols-3 sm:gap-4">
                            <dt className="font-semibold text-[#3B3838] md:ml-4 lg:ml-10 text-center md:text-left">
                                Time
                            </dt>
                            <dd className="text-gray-700 sm:col-span-2 text-center sm:text-left break-words">
                                {formData.apttime}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
}

export default ConfirmtionG;
