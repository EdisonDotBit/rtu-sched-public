import React from "react";

function DetailsInfo({ aptData }) {
    return (
        <>
            <div>
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
                                {aptstudnum ? aptstudnum : "N/A"}
                            </dd>
                        </div>
                        <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-3 sm:gap-4">
                            <dt className="font-semibold text-[#3B3838] ml-10">
                                Full Name
                            </dt>
                            <dd className="text-gray-700 sm:col-span-2 justify-self-center">
                                Edison Lati Jr.
                            </dd>
                        </div>
                        <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-3 sm:gap-4">
                            <dt className="font-semibold text-[#3B3838] ml-10">
                                Contact Number
                            </dt>
                            <dd className="text-gray-700 sm:col-span-2 justify-self-center">
                                09950679098
                            </dd>
                        </div>
                        <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-3 sm:gap-4">
                            <dt className="font-semibold text-[#3B3838] ml-10">
                                Email Address
                            </dt>
                            <dd className="text-gray-700 sm:col-span-2 justify-self-center">
                                2021-101864@rtu.edu.ph
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
                            <dd className="text-gray-700 sm:col-span-2 justify-self-center text-center"></dd>
                        </div>
                        <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-3 sm:gap-4">
                            <dt className="font-semibold text-[#3B3838] ml-10">
                                Office Name
                            </dt>
                            <dd className="text-gray-700 sm:col-span-2 justify-self-center text-center">
                                Management Information Center (MIC)
                            </dd>
                        </div>
                        <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-3 sm:gap-4">
                            <dt className="font-semibold text-[#3B3838] ml-10">
                                Purpose
                            </dt>
                            <dd className="text-gray-700 sm:col-span-2 justify-self-center text-center">
                                Request for Gradeslip and Registration form
                            </dd>
                        </div>
                        <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-3 sm:gap-4">
                            <dt className="font-semibold text-[#3B3838] ml-10">
                                Date
                            </dt>
                            <dd className="text-gray-700 sm:col-span-2 justify-self-center text-center">
                                Friday, March 15, 2024
                            </dd>
                        </div>
                        <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-3 sm:gap-4">
                            <dt className="font-semibold text-[#3B3838] ml-10">
                                Time
                            </dt>
                            <dd className="text-gray-700 sm:col-span-2 justify-self-center text-center">
                                8:00 AM - 8:30 AM
                            </dd>
                        </div>
                        <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-3 sm:gap-4">
                            <dt className="font-semibold text-[#3B3838] ml-10">
                                Transaction Number
                            </dt>
                            <dd className="text-gray-700 sm:col-span-2 justify-self-center text-center">
                                5145656
                            </dd>
                        </div>
                    </dl>
                </div>

                <div className="flex justify-evenly">
                    <button className=" w-[200px] border-solid border-[1px] border-black p-[10px] text-black bg-[#FF0000]">
                        Delete
                    </button>
                    <button className=" w-[200px] border-solid border-[1px] border-black p-[10px] text-black">
                        Resend Appointment
                    </button>
                    <button className=" w-[200px] border-solid border-[1px] border-black p-[10px] text-black bg-[#0038FF]">
                        Reschedule
                    </button>
                </div>
            </div>
        </>
    );
}

export default DetailsInfo;
