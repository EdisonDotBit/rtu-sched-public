import React, { useEffect, useState } from "react";
import axios from "axios";
import DetailsInfo from "./Subcomponent/DetailsInfo";

function ViewAppointments() {
    const [aptid, setAptid] = useState("");
    const [aptData, setAptData] = useState({});
    const [error, setError] = useState(null);
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    const handleSearch = async () => {
        try {
            const response = await axios.get(
                `${apiBaseUrl}/api/searchappt/${aptid}`
            );
            const responseData = response.data.data; // Access the nested 'data' property
            setAptData({
                aptid: responseData.aptid,
                aptname: responseData.aptname,
                aptpnumber: responseData.aptpnumber,
                aptemail: responseData.aptemail,
                aptoffice: responseData.aptoffice,
                aptpurpose: responseData.aptpurpose,
                aptstudnum: responseData.aptstudnum,
                aptdate: responseData.aptdate,
                aptbranch: responseData.aptbranch,
            });
            setError(null);
        } catch (error) {
            console.error("Error fetching specific row:", error);
            setError("Error fetching data. Please try again.");
            setAptData(null);
        }
    };
    useEffect(() => {
        console.log(aptData);
    }, [aptData]);

    return (
        <>
            <div className="flex justify-center items-center h-full">
                <div className="flex flex-col items-center gap-[20px]">
                    <input
                        className="flex justify-center items-center text-center w-[300px] p-[5px]"
                        type="number"
                        placeholder="Enter your transaction number"
                        value={aptid}
                        onChange={(e) => setAptid(e.target.value)}
                    />
                    <button
                        className="w-[100px] border-solid border-[1px] border-black rounded-lg text-[#ffffff] bg-[#194F90] hover:bg-[#123A69]"
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                    {error && <p>{error}</p>}
                    {aptData && Object.keys(aptData).length > 0 && (
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
                                            {aptData.aptname
                                                ? aptData.aptname
                                                : "N/A"}
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
                                            {aptData.aptemail
                                                ? aptData.aptemail
                                                : "N/A"}
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
                                            {aptData.aptbranch
                                                ? aptData.aptbranch
                                                : "N/A"}
                                        </dd>
                                    </div>
                                    <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-3 sm:gap-4">
                                        <dt className="font-semibold text-[#3B3838] ml-10">
                                            Office Name
                                        </dt>
                                        <dd className="text-gray-700 sm:col-span-2 justify-self-center text-center">
                                            {aptData.aptoffice
                                                ? aptData.aptoffice
                                                : "N/A"}
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
                                            {aptData.aptdate
                                                ? aptData.aptdate
                                                : "N/A"}
                                        </dd>
                                    </div>
                                    <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-3 sm:gap-4">
                                        <dt className="font-semibold text-[#3B3838] ml-10">
                                            Transaction Number
                                        </dt>
                                        <dd className="text-gray-700 sm:col-span-2 justify-self-center text-center">
                                            {aptData.aptid
                                                ? aptData.aptid
                                                : "N/A"}
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
                    )}
                </div>
            </div>
        </>
    );
}

export default ViewAppointments;
