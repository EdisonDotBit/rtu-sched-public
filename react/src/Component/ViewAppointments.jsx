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
            setError("No Data Found, double check your Appointment Number");
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
                        className="flex justify-center items-center text-center w-[300px] p-[5px] text-black bg-gray-400"
                        type="text"
                        placeholder="Enter your transaction number"
                        value={aptid}
                        onChange={(e) => setAptid(e.target.value)}
                        onInput={(e) => {
                            e.target.value = e.target.value.replace(
                                /[^0-9\-]/g,
                                ""
                            );
                        }}
                    />
                    <button
                        className="w-[100px] border-solid border-[1px] border-black rounded-lg text-[#ffffff] bg-[#194F90] hover:bg-[#123A69]"
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                    {error && <p>{error}</p>}
                    {aptData && Object.keys(aptData).length > 0 && (
                        <DetailsInfo aptData={aptData} />
                    )}
                </div>
            </div>
        </>
    );
}

export default ViewAppointments;
