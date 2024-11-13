import React from "react";

function Confirmation({ formData, setFormData }) {
    return (
        <div className="flex flex-col flex-1 w-full h-auto justify-center">
            <div className="flex-1 rounded-lg">
                <div className="w-lvh block">
                    <h4 className="text-[18px] font-bold text-[#3B3838] mt-4">
                        Appointment Summary:
                    </h4>

                    <h4 className="text-justify text-xs min-w-full  text-gray-500 mb-2 italic">
                        Warning: False or incorrect information may result in
                        the cancellation of appointment.
                    </h4>

                    {/* Personal Information Section */}
                    <div className="bg-white flow-root rounded-lg border border-gray-100 shadow-sm mb-4">
                        <dl className="divide-y divide-gray-100 text-sm">
                            {/* Personal Information Header */}
                            <div className="grid grid-cols-1 p-2 bg-[#194F90] text-white rounded-t-md">
                                <dt className="font-bold text-white text-[16px] text-center md:text-left">
                                    PERSONAL INFORMATION
                                </dt>
                            </div>

                            {/* Personal Information Rows */}
                            <div className="grid grid-cols-1 p-2 sm:grid-cols-3 sm:gap-4">
                                <dt className="font-semibold text-[#3B3838] md:ml-10 text-center md:text-left">
                                    Student Number
                                </dt>
                                <dd className="text-gray-700 sm:col-span-2 text-center sm:text-left">
                                    {formData.aptstudnum}
                                </dd>
                            </div>

                            <div className="grid grid-cols-1 p-2 sm:grid-cols-3 sm:gap-4">
                                <dt className="font-semibold text-[#3B3838] md:ml-10 text-center md:text-left">
                                    Full Name
                                </dt>
                                <dd className="text-gray-700 sm:col-span-2 text-center sm:text-left">
                                    {formData.aptname}
                                </dd>
                            </div>

                            <div className="grid grid-cols-1 p-2 sm:grid-cols-3 sm:gap-4">
                                <dt className="font-semibold text-[#3B3838] md:ml-10 text-center md:text-left">
                                    Contact Number
                                </dt>
                                <dd className="text-gray-700 sm:col-span-2 text-center sm:text-left">
                                    {formData.aptpnumber}
                                </dd>
                            </div>

                            <div className="grid grid-cols-1 p-2 sm:grid-cols-3 sm:gap-4">
                                <dt className="font-semibold text-[#3B3838] md:ml-10 text-center md:text-left">
                                    Email Address
                                </dt>
                                <dd className="text-gray-700 sm:col-span-2 text-center sm:text-left">
                                    {formData.aptemail}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    {/* Appointment Information Section */}
                    <div className="flow-root rounded-lg border border-gray-100 shadow-sm mb-4">
                        <dl className="divide-y divide-gray-100 text-sm">
                            {/* Appointment Information Header */}
                            <div className="grid grid-cols-1 p-2 bg-[#194F90] text-white rounded-t-md">
                                <dt className="font-bold text-white text-[16px] text-center md:text-left">
                                    APPOINTMENT INFORMATION
                                </dt>
                            </div>

                            {/* Appointment Information Rows */}
                            <div className="grid grid-cols-1 p-2 sm:grid-cols-3 sm:gap-4">
                                <dt className="font-semibold text-[#3B3838] md:ml-10 text-center md:text-left">
                                    RTU Branch
                                </dt>
                                <dd className="text-gray-700 sm:col-span-2 text-center sm:text-left">
                                    {formData.aptbranch}
                                </dd>
                            </div>

                            <div className="grid grid-cols-1 p-2 sm:grid-cols-3 sm:gap-4">
                                <dt className="font-semibold text-[#3B3838] md:ml-10 text-center md:text-left">
                                    Office Name
                                </dt>
                                <dd className="text-gray-700 sm:col-span-2 text-center sm:text-left">
                                    {formData.aptoffice}
                                </dd>
                            </div>

                            <div className="grid grid-cols-1 p-2 sm:grid-cols-3 sm:gap-4">
                                <dt className="font-semibold text-[#3B3838] md:ml-10 text-center md:text-left">
                                    Purpose
                                </dt>
                                <dd className="text-gray-700 sm:col-span-2 text-center sm:text-left">
                                    {formData.aptpurpose}
                                </dd>
                            </div>

                            <div className="grid grid-cols-1 p-2 sm:grid-cols-3 sm:gap-4">
                                <dt className="font-semibold text-[#3B3838] md:ml-10 text-center md:text-left">
                                    Date
                                </dt>
                                <dd className="text-gray-700 sm:col-span-2 text-center sm:text-left">
                                    {formData.aptdate}
                                </dd>
                            </div>

                            <div className="grid grid-cols-1 p-2 sm:grid-cols-3 sm:gap-4">
                                <dt className="font-semibold text-[#3B3838] md:ml-10 text-center md:text-left">
                                    Time
                                </dt>
                                <dd className="text-gray-700 sm:col-span-2 text-center sm:text-left">
                                    {formData.apttime}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Confirmation;
