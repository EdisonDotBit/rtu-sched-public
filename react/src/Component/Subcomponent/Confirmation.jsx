import React from "react";

function Confirmation({ formData, setFormData }) {
    return (
        <div className="flex flex-col flex-1 w-full h-full overflow-y-hidden">
            <div className="p-4 bg-white flex-1 rounded-lg m-4 overflow-auto">
                <div className="p-4 w-lvh block">
                    <h4 className="text-center relative border-b text-[18px] font-bold text-[#3B3838] pb-4">
                        Appointment Summary
                    </h4>

                    <div className="flow-root rounded-lg border border-gray-100 py-3 shadow-sm mb-4">
                        <dl className="-my-3 divide-y divide-gray-100 text-sm">
                            <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-1 sm:gap-4">
                                <dt className="font-bold text-[#EAB800] text-[16px]">
                                    <h1>PERSONAL INFORMATION</h1>
                                </dt>
                            </div>
                            <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-3 sm:gap-4">
                                <dt className="font-semibold text-[#3B3838] ml-10">
                                    Student Number
                                </dt>
                                <dd className="text-gray-700 sm:col-span-2 justify-self-center">
                                    {formData.studNum}
                                </dd>
                            </div>
                            <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-3 sm:gap-4">
                                <dt className="font-semibold text-[#3B3838] ml-10">
                                    Full Name
                                </dt>
                                <dd className="text-gray-700 sm:col-span-2 justify-self-center">
                                    {formData.name}
                                </dd>
                            </div>
                            <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-3 sm:gap-4">
                                <dt className="font-semibold text-[#3B3838] ml-10">
                                    Contact Number
                                </dt>
                                <dd className="text-gray-700 sm:col-span-2 justify-self-center">
                                    {formData.pnumber}
                                </dd>
                            </div>
                            <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-3 sm:gap-4">
                                <dt className="font-semibold text-[#3B3838] ml-10">
                                    Email Address
                                </dt>
                                <dd className="text-gray-700 sm:col-span-2 justify-self-center">
                                    {formData.email}
                                </dd>
                            </div>
                        </dl>
                    </div>
                    <div className="flow-root rounded-lg border border-gray-100 py-3 shadow-sm mb-4 ">
                        <dl className="-my-3 divide-y divide-gray-100 text-sm">
                            <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-1 sm:gap-4">
                                <dt className="font-bold text-[#EAB800] text-[16px]">
                                    <h1>APPOINTMENT INFORMATION</h1>
                                </dt>
                            </div>
                            <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-3 sm:gap-4">
                                <dt className="font-semibold text-[#3B3838] ml-10">
                                    RTU Branch
                                </dt>
                                <dd className="text-gray-700 sm:col-span-2 justify-self-center text-center">
                                    {formData.branch}
                                </dd>
                            </div>
                            <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-3 sm:gap-4">
                                <dt className="font-semibold text-[#3B3838] ml-10">
                                    Office Name
                                </dt>
                                <dd className="text-gray-700 sm:col-span-2 justify-self-center text-center">
                                    {formData.office}
                                </dd>
                            </div>
                            <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-3 sm:gap-4">
                                <dt className="font-semibold text-[#3B3838] ml-10">
                                    Purpose
                                </dt>
                                <dd className="text-gray-700 sm:col-span-2 justify-self-center text-center">
                                    {formData.purpose}
                                </dd>
                            </div>
                            <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-3 sm:gap-4">
                                <dt className="font-semibold text-[#3B3838] ml-10">
                                    Date
                                </dt>
                                <dd className="text-gray-700 sm:col-span-2 justify-self-center text-center">
                                    {formData.date}
                                </dd>
                            </div>
                        </dl>
                    </div>
                    <div className="items-center w-[85%] ml-auto mr-auto text-center text-[12px]">
                        <input
                            type="checkbox"
                            tabIndex={-1}
                            className="mr-2 accent-[#123A69] hover:accent-[#123A69]"
                            style={{ verticalAlign: "middle" }}
                        />
                        <label style={{ verticalAlign: "middle" }}>
                            I confirm that the above information is
                            <b> true and correct</b>. And
                            <b> I consent Rizal Technological University </b>
                            under the standards of Data Protection and Privacy
                            to
                            <b> collect and process </b>
                            the given data.
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Confirmation;
