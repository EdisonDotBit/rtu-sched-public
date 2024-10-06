import React from "react";

function Confirmation({ formData, setFormData }) {
    return (
        <div className="flex flex-col flex-1 w-full h-auto justify-center">
            <div className="p-4 bg-white flex-1 rounded-lg ">
                <div className="p-4 w-lvh block">
                    <h4 className="text-center relative border-b text-[18px] font-bold text-[#3B3838] pb-4">
                        Appointment Summary
                    </h4>

                    <div className="flow-root rounded-lg border border-gray-100 py-3 shadow-sm mb-4">
                        <dl className="my-3 divide-y divide-gray-100 text-sm">
                            <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-1 sm:gap-4">
                                <dt className="font-bold text-[#EAB800] text-[16px] text-center md:text-left">
                                    <h1>PERSONAL INFORMATION</h1>
                                </dt>
                            </div>
                            <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-3 sm:gap-4">
                                <dt className="font-semibold text-[#3B3838] md:ml-10 text-center md:text-left">
                                    Student Number
                                </dt>
                                <dd className="text-gray-700 sm:col-span-2 justify-self-center">
                                    {formData.aptstudnum}
                                </dd>
                            </div>
                            <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-3 sm:gap-4">
                                <dt className="font-semibold text-[#3B3838] md:ml-10 text-center md:text-left">
                                    Full Name
                                </dt>
                                <dd className="text-gray-700 sm:col-span-2 justify-self-center">
                                    {formData.aptname}
                                </dd>
                            </div>
                            <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-3 sm:gap-4">
                                <dt className="font-semibold text-[#3B3838] md:ml-10 text-center md:text-left">
                                    Contact Number
                                </dt>
                                <dd className="text-gray-700 sm:col-span-2 justify-self-center">
                                    {formData.aptpnumber}
                                </dd>
                            </div>
                            <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-3 sm:gap-4">
                                <dt className="font-semibold text-[#3B3838] md:ml-10 text-center md:text-left">
                                    Email Address
                                </dt>
                                <dd className="text-gray-700 sm:col-span-2 justify-self-center">
                                    {formData.aptemail}
                                </dd>
                            </div>
                        </dl>
                    </div>
                    <div className="flow-root rounded-lg border border-gray-100 py-3 shadow-sm mb-4 ">
                        <dl className="-my-3 divide-y divide-gray-100 text-sm">
                            <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-1 sm:gap-4">
                                <dt className="font-bold text-[#EAB800] text-[16px] text-center md:text-left">
                                    <h1>APPOINTMENT INFORMATION</h1>
                                </dt>
                            </div>
                            <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-3 sm:gap-4">
                                <dt className="font-semibold text-[#3B3838] md:ml-10 text-center md:text-left">
                                    RTU Branch
                                </dt>
                                <dd className="text-gray-700 sm:col-span-2 justify-self-center text-center">
                                    {formData.aptbranch}
                                </dd>
                            </div>
                            <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-3 sm:gap-4">
                                <dt className="font-semibold text-[#3B3838] md:ml-10 text-center md:text-left">
                                    Office Name
                                </dt>
                                <dd className="text-gray-700 sm:col-span-2 justify-self-center text-center">
                                    {formData.aptoffice}
                                </dd>
                            </div>
                            <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-3 sm:gap-4">
                                <dt className="font-semibold text-[#3B3838] md:ml-10 text-center md:text-left">
                                    Purpose
                                </dt>
                                <dd className="text-gray-700 sm:col-span-2 justify-self-center text-center">
                                    {formData.aptpurpose}
                                </dd>
                            </div>
                            <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-3 sm:gap-4">
                                <dt className="font-semibold text-[#3B3838] md:ml-10 text-center md:text-left">
                                    Date
                                </dt>
                                <dd className="text-gray-700 sm:col-span-2 justify-self-center text-center">
                                    {formData.aptdate}
                                </dd>
                            </div>
                            <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-3 sm:gap-4">
                                <dt className="font-semibold text-[#3B3838] md:ml-10 text-center md:text-left">
                                    Time
                                </dt>
                                <dd className="text-gray-700 sm:col-span-2 justify-self-center text-center">
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
