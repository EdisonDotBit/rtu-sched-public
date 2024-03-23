import React, { useEffect, useState } from "react";
import axios from "axios";
import DetailsInfo from "./Subcomponent/DetailsInfo";
import Loading from "./Subcomponent/Loading";

function ViewAppointments() {
    const [aptid, setAptid] = useState("");
    const [aptData, setAptData] = useState({});
    const [error, setError] = useState(null);
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const [isLoading, setIsLoading] = useState();
    const handleSearch = async () => {
        setIsLoading(true);
        setError(null);
        setAptData({});
        try {
            const response = await axios.get(
                `${apiBaseUrl}/api/searchappt/${aptid}`
            );
            setAptData(response.data.data);
            setIsLoading(false);
            setError(null);
        } catch (error) {
            setError("No Data Found, double check your Appointment Number");
            setAptData(null);
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-full">
            <div className="flex flex-col items-center gap-[20px]">
                <input
                    className="bg-neutral-200 border-r-teal-400 w-[300px] text-center p-[5px] xsm:w-[200px] xsm:text-xs sm:w-[300px] sm:text-lg"
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
                <div className="flex justify-center items-center">
                    {isLoading && (
                        <div>
                            <Loading />
                        </div>
                    )}
                    {error && <p>{error}</p>}
                    {aptData && Object.keys(aptData).length > 0 && (
                        <DetailsInfo aptData={aptData} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default ViewAppointments;
