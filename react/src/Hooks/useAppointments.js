// src/Hooks/useAppointments.js
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
        } catch (error) {
            toast.error(
                "Failed to fetch appointment data. Please try again later."
            );
        }
    };

    // Single appointment actions
    const confirmAppointment = async (id) => {
        try {
            setIsProcessing(true);
            const response = await axios.post(
                `${apiBaseUrl}/api/appointments/confirm/${id}`,
                {}
            );
            if (response.status === 200) {
                toast.success("Appointment confirmed.");
                await getData();
            }
        } catch (error) {
            toast.error("Error confirming appointment.");
        } finally {
            setIsProcessing(false);
        }
    };

    const markAppointmentDone = async (id) => {
        try {
            setIsProcessing(true);
            const response = await axios.post(
                `${apiBaseUrl}/api/appointments/done/${id}`,
                {}
            );
            if (response.status === 200) {
                toast.success("Appointment marked as done.");
                await getData();
            }
        } catch (error) {
            toast.error("Error marking appointment as done.");
        } finally {
            setIsProcessing(false);
        }
    };

    const cancelAppointment = async (id) => {
        try {
            setIsProcessing(true);
            const response = await axios.post(
                `${apiBaseUrl}/api/appointments/cancel/${id}`,
                {}
            );
            if (response.status === 200) {
                toast.success("Appointment cancelled.");
                await getData();
            }
        } catch (error) {
            toast.error("Error cancelling appointment.");
        } finally {
            setIsProcessing(false);
        }
    };

    const deleteAppointment = async (id) => {
        try {
            setIsProcessing(true);
            const response = await axios.delete(
                `${apiBaseUrl}/api/appointments/${id}`
            );
            if (response.status === 200) {
                toast.success("Appointment deleted.");
                await getData();
            }
        } catch (error) {
            toast.error("Error deleting appointment.");
        } finally {
            setIsProcessing(false);
        }
    };

    // Bulk actions
    const bulkConfirmAppointments = async (ids) => {
        try {
            setIsProcessing(true);
            const responses = await Promise.all(
                ids.map(id => 
                    axios.post(`${apiBaseUrl}/api/appointments/confirm/${id}`, {})
                )
            );
            if (responses.every(res => res.status === 200)) {
                toast.success(`${ids.length} appointments confirmed.`);
                await getData();
            }
        } catch (error) {
            toast.error("Error confirming appointments.");
        } finally {
            setIsProcessing(false);
        }
    };

    const bulkMarkAppointmentsDone = async (ids) => {
        try {
            setIsProcessing(true);
            const responses = await Promise.all(
                ids.map(id => 
                    axios.post(`${apiBaseUrl}/api/appointments/done/${id}`, {})
                )
            );
            if (responses.every(res => res.status === 200)) {
                toast.success(`${ids.length} appointments marked as done.`);
                await getData();
            }
        } catch (error) {
            toast.error("Error marking appointments as done.");
        } finally {
            setIsProcessing(false);
        }
    };

    const bulkCancelAppointments = async (ids) => {
        try {
            setIsProcessing(true);
            const responses = await Promise.all(
                ids.map(id => 
                    axios.post(`${apiBaseUrl}/api/appointments/cancel/${id}`, {})
                )
            );
            if (responses.every(res => res.status === 200)) {
                toast.success(`${ids.length} appointments cancelled.`);
                await getData();
            }
        } catch (error) {
            toast.error("Error cancelling appointments.");
        } finally {
            setIsProcessing(false);
        }
    };

    const bulkDeleteAppointments = async (ids) => {
        try {
            setIsProcessing(true);
            const responses = await Promise.all(
                ids.map(id => 
                    axios.delete(`${apiBaseUrl}/api/appointments/${id}`)
                )
            );
            if (responses.every(res => res.status === 200)) {
                toast.success(`${ids.length} appointments deleted.`);
                await getData();
            }
        } catch (error) {
            toast.error("Error deleting appointments.");
        } finally {
            setIsProcessing(false);
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
        deleteAppointment,
        bulkConfirmAppointments,
        bulkMarkAppointmentsDone,
        bulkCancelAppointments,
        bulkDeleteAppointments
    };
};

export default useAppointments;