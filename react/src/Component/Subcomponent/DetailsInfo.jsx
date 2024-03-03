import React from "react";

function DetailsInfo({ aptData }) {
    return (
        <>
            <div>
                <div className="flow-root rounded-lg border border-gray-100 py-3 shadow-sm mb-4 w-full">
                    <dl className="-my-3 divide-y divide-gray-100 text-sm w-2/3 md:w-full">
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
                                {aptData.aptstudnum
                                    ? aptData.aptstudnum
                                    : "N/A"}
                            </dd>
                        </div>
                        <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-3 sm:gap-4">
                            <dt className="font-semibold text-[#3B3838] ml-10">
                                Full Name
                            </dt>
                            <dd className="text-gray-700 sm:col-span-2 justify-self-center">
                                {aptData.aptname ? aptData.aptname : "N/A"}
                            </dd>
                        </div>
                        <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-3 sm:gap-4">
                            <dt className="font-semibold text-[#3B3838] ml-10">
                                Contact Number
                            </dt>
                            <dd className="text-gray-700 sm:col-span-2 justify-self-center">
                                {aptData.aptpnumber
                                    ? aptData.aptpnumber
                                    : "N/A"}
                            </dd>
                        </div>
                        <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-3 sm:gap-4">
                            <dt className="font-semibold text-[#3B3838] ml-10">
                                Email Address
                            </dt>
                            <dd className="text-gray-700 sm:col-span-2 justify-self-center">
                                {aptData.aptemail ? aptData.aptemail : "N/A"}
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
                                {aptData.aptbranch ? aptData.aptbranch : "N/A"}
                            </dd>
                        </div>
                        <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-3 sm:gap-4">
                            <dt className="font-semibold text-[#3B3838] ml-10">
                                Office Name
                            </dt>
                            <dd className="text-gray-700 sm:col-span-2 justify-self-center text-center">
                                {aptData.aptoffice ? aptData.aptoffice : "N/A"}
                            </dd>
                        </div>
                        <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-3 sm:gap-4">
                            <dt className="font-semibold text-[#3B3838] ml-10">
                                Purpose
                            </dt>
                            <dd className="text-gray-700 sm:col-span-2 justify-self-center text-center">
                                {aptData.aptpurpose
                                    ? aptData.aptpurpose
                                    : "N/A"}
                            </dd>
                        </div>
                        <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-3 sm:gap-4">
                            <dt className="font-semibold text-[#3B3838] ml-10">
                                Date
                            </dt>
                            <dd className="text-gray-700 sm:col-span-2 justify-self-center text-center">
                                {aptData.aptdate ? aptData.aptdate : "N/A"}
                            </dd>
                        </div>
                        <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-3 sm:gap-4">
                            <dt className="font-semibold text-[#3B3838] ml-10">
                                Transaction Number
                            </dt>
                            <dd className="text-gray-700 sm:col-span-2 justify-self-center text-center">
                                {aptData.aptid ? aptData.aptid : "N/A"}
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
