import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const useAppointments = (role, branch, apiBaseUrl) => {
    const [aptData, setAptData] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const getData = async () => {
        try {
            let endpoint;

            if (role === "superadmin") {
                endpoint = `${apiBaseUrl}/api/branchapt/${branch}`;
            } else {
                endpoint = `${apiBaseUrl}/api/filteredapt/${role}/${branch}`;
            }

            const getRes = await fetch(endpoint);
            const getDataResult = await getRes.json();
            setAptData(getDataResult);
            setSearchResults(getDataResult);
        } catch (error) {
            toast.error(
                "Failed to fetch appointment data. Please try again later."
            );
        }
    };

    // Appointment action functions
    const confirmAppointment = async (id) => {
        try {
            const response = await axios.post(
                `${apiBaseUrl}/api/appointments/confirm/${id}`,
                {}
            );
            if (response.status === 200) {
                toast.success("Appointment confirmed.");
                getData();
            }
        } catch (error) {
            toast.error("Error confirming appointment.");
        }
    };

    const markAppointmentDone = async (id) => {
        try {
            const response = await axios.post(
                `${apiBaseUrl}/api/appointments/done/${id}`,
                {}
            );
            if (response.status === 200) {
                toast.success("Appointment marked as done.");
                getData();
            }
        } catch (error) {
            toast.error("Error marking appointment as done.");
        }
    };

    const cancelAppointment = async (id) => {
        try {
            const response = await axios.post(
                `${apiBaseUrl}/api/appointments/cancel/${id}`,
                {}
            );
            if (response.status === 200) {
                toast.success("Appointment cancelled.");
                getData();
            }
        } catch (error) {
            toast.error("Error cancelling appointment.");
        }
    };

    const deleteAppointment = async (id) => {
        try {
            const response = await axios.delete(
                `${apiBaseUrl}/api/appointments/${id}`
            );
            if (response.status === 200) {
                toast.success("Appointment deleted.");
                getData();
            }
        } catch (error) {
            toast.error("Error deleting appointment.");
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            getData();
        }, 60000);

        getData();

        return () => clearInterval(interval);
    }, [role, branch, apiBaseUrl]);

    return {
        aptData,
        searchResults,
        setSearchResults,
        isProcessing,
        setIsProcessing,
        getData,
        confirmAppointment,
        markAppointmentDone,
        cancelAppointment,
        deleteAppointment
    };
};

export default useAppointments;