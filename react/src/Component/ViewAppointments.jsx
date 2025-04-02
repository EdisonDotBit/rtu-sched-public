import React, { useEffect, useState } from "react";
import axios from "axios";
import DetailsInfo from "./Subcomponent/DetailsInfo";
import Loading from "./Subcomponent/Loading";
import { useStudentAuth } from "../Hooks/useStudentAuth"; // Import the hook

function ViewAppointments() {
    const { user } = useStudentAuth(); // Get the authenticated user
    const userRole = user ? user.role : "Guest"; // Set userRole based on authentication

    const [aptid, setAptid] = useState("");
    const [aptData, setAptData] = useState({});
    const [error, setError] = useState(null);
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const [isLoading, setIsLoading] = useState(false);

    const [appointments, setAppointments] = useState([]);

    // Fetch all ongoing appointments
    useEffect(() => {
        const getData = async () => {
            const getRes = await fetch(
                `${apiBaseUrl}/api/allongoingandconfirmed`
            );
            const getDataResult = await getRes.json();
            setAppointments(getDataResult);
        };
        getData();
    }, []);

    // Handle search for a specific appointment
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
            setError("No Data Found. Double check Appointment Number.");
            setAptData(null);
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="h-full w-full flex flex-col items-center">
                <h1 className="text-center text-3xl font-semibold text-gray-800 mb-5 mt-5">
                    View Appointment
                </h1>
                <div className="flex flex-col justify-center items-center flex-1 gap-2">
                    <h2 className="text-center text-lg font-semibold">
                        Enter Transaction Number
                    </h2>

                    <div className="flex flex-col items-center gap-[20px]">
                        <input
                            className="text-gray-800 bg-white mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75] w-[300px] xsm:w-[200px] sm:w-[300px] text-md"
                            type="text"
                            placeholder="e.g. 12242589000014"
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
                            className="text-center font-medium py-2 px-8 rounded-md text-white hover:text-white bg-[#194F90] hover:bg-[#123A69]"
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
                            {error && (
                                <p className="text-red-500 text-center">
                                    {error}
                                </p>
                            )}
                            {aptData && Object.keys(aptData).length > 0 && (
                                <DetailsInfo
                                    aptData={aptData}
                                    appointments={appointments}
                                    userRole={userRole} // Pass userRole to DetailsInfo
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ViewAppointments;
