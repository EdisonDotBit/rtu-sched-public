import { useEffect, useRef, useState } from "react";
import Calendar from "./Calendar";
import TimePicker from "./TimePicker";
import axios from "axios";
import PDFFile from "../PDFFile";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function DetailsInfo({ aptData, appointments, userRole }) {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const [formData, setFormData] = useState({
        aptoffice: aptData.aptoffice,
        aptbranch: aptData.aptbranch,
    });
    const modalRef1 = useRef(null);
    const modalRef2 = useRef(null);
    const [limit, setLimit] = useState(null);
    const [isTimeSelected, setIsTimeSelected] = useState(false);
    const [isProcessingReschedule, setIsProcessingReschedule] = useState(false);
    const [isProcessingDelete, setIsProcessingDelete] = useState(false);

    // Fetch office limit only once on component mount
    useEffect(() => {
        const fetchOfficeLimit = async () => {
            try {
                const response = await axios.get(
                    `${apiBaseUrl}/api/office/find/${aptData.aptoffice}`
                );
                if (response.status === 200) {
                    setLimit(response.data.data.offlimit);
                }
            } catch (error) {
                toast.error("Failed to fetch office limit.");
                console.error("Error fetching office limit:", error);
            }
        };

        fetchOfficeLimit();
    }, [apiBaseUrl, aptData.aptoffice]);

    // Handle reschedule
    const handleReSched = async (e, id) => {
        e.preventDefault();
        setIsProcessingReschedule(true);
        try {
            const response = await axios.put(
                `${apiBaseUrl}/api/resched/${id}`,
                formData
            );
            if (response.status === 200) {
                toast.success(
                    "Appointment rescheduled successfully. Page will reload."
                );
                setTimeout(() => window.location.reload(), 2000);
            }
        } catch (error) {
            toast.error("Failed to reschedule appointment.");
            console.error("Error rescheduling appointment:", error);
            setIsProcessingReschedule(false);
        }
    };

    // Handle delete
    const handleDelete = async (e, id) => {
        e.preventDefault();
        setIsProcessingDelete(true);
        try {
            const response = await axios.delete(
                `${apiBaseUrl}/api/delappt/${id}`
            );
            if (response.status === 200) {
                toast.success(
                    "Appointment deleted successfully. Page will reload."
                );
                setTimeout(() => window.location.reload(), 2000);
            }
        } catch (error) {
            toast.error("Failed to delete appointment.");
            console.error("Error deleting appointment:", error);
            setIsProcessingDelete(false);
        }
    };

    // Open modals
    const openModal1 = () => modalRef1.current.showModal();
    const openModal2 = () => modalRef2.current.showModal();

    // Check if appointment can be rescheduled
    const canReschedule = () => {
        const today = new Date();
        const aptDate = new Date(aptData.aptdate);
        const diffInDays = (aptDate - today) / (1000 * 60 * 60 * 24);
        const disabledStatuses = ["confirmed", "cancelled", "done"];
        return (
            !aptData.rescheduled &&
            diffInDays > 2 &&
            !disabledStatuses.includes(aptData.aptstatus?.toLowerCase())
        );
    };

    // Check if appointment can be deleted
    const canDelete = () => {
        const disabledStatuses = ["confirmed", "cancelled", "done"];
        return !disabledStatuses.includes(aptData.aptstatus?.toLowerCase());
    };

    return (
        <div className="flex flex-col flex-1 w-full h-auto justify-center">
            {/* Personal Information Section */}
            <div className="bg-white flow-root rounded-lg border border-gray-100 shadow-sm mb-4">
                <dl className="divide-y divide-gray-100 text-sm w-full lg:w-[800px]">
                    <div className="grid grid-cols-1 p-2 bg-[#194F90] text-white rounded-t-md">
                        <dt className="font-bold text-white text-[16px] text-center md:text-left">
                            PERSONAL INFORMATION
                        </dt>
                    </div>
                    {[
                        {
                            label: "Student or ID Number / Type",
                            value: aptData.aptstudnum,
                        },
                        { label: "Full Name", value: aptData.aptname },
                        { label: "Contact Number", value: aptData.aptpnumber },
                        { label: "Email Address", value: aptData.aptemail },
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-1 p-2 sm:grid-cols-3 sm:gap-4"
                        >
                            <dt className="font-semibold text-[#3B3838] md:ml-10 text-center md:text-left">
                                {item.label}
                            </dt>
                            <dd className="text-gray-700 sm:col-span-2 text-center sm:text-left">
                                {item.value || "N/A"}
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>

            {/* Appointment Information Section */}
            <div className="bg-white flow-root rounded-lg border border-gray-100 shadow-sm mb-4">
                <dl className="divide-y divide-gray-100 text-sm w-full lg:w-[800px]">
                    <div className="grid grid-cols-1 p-2 bg-[#194F90] text-white rounded-t-md">
                        <dt className="font-bold text-white text-[16px] text-center md:text-left">
                            APPOINTMENT INFORMATION
                        </dt>
                    </div>
                    {[
                        { label: "Account Type", value: aptData.apttype },
                        { label: "RTU Branch", value: aptData.aptbranch },
                        { label: "Office Name", value: aptData.aptoffice },
                        { label: "Purpose", value: aptData.aptpurpose },
                        { label: "Date", value: aptData.aptdate },
                        { label: "Time", value: aptData.apttime },
                        { label: "Appointment Number", value: aptData.aptid },
                        {
                            label: "Appointment Status",
                            value: aptData.aptstatus,
                        },
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-1 p-2 sm:grid-cols-3 sm:gap-4"
                        >
                            <dt className="font-semibold text-[#3B3838] md:ml-10 text-center md:text-left">
                                {item.label}
                            </dt>
                            <dd className="text-gray-700 sm:col-span-2 text-center sm:text-left">
                                {item.value || "N/A"}
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between mb-4 w-full max-w-[600px] mx-auto">
                {/* Delete Button */}
                <button
                    className={`flex justify-center items-center py-2 px-4 rounded-md w-[30%] min-w-[100px] ${
                        canDelete()
                            ? "bg-red-500 hover:bg-red-700 text-white"
                            : "bg-gray-400 cursor-not-allowed"
                    }`}
                    onClick={openModal2}
                    disabled={!canDelete()}
                >
                    Delete
                </button>

                {/* Print Button */}
                <div className="w-[30%] min-w-[120px] mx-2">
                    {" "}
                    {/* Increased min-width */}
                    <PDFDownloadLink
                        document={<PDFFile succData={aptData} />}
                        fileName="RTU-Appointment-Receipt.pdf"
                    >
                        {({ loading }) => (
                            <button
                                className={`flex justify-center items-center w-full py-2 px-4 rounded-md ${
                                    loading
                                        ? "bg-blue-300 text-white"
                                        : "bg-blue-500 hover:bg-blue-800 text-white"
                                }`}
                                style={{ minWidth: "120px" }}
                            >
                                {loading ? (
                                    <span className="inline-block w-full text-center">
                                        Loading...
                                    </span>
                                ) : (
                                    <span className="inline-block w-full text-center">
                                        Print
                                    </span>
                                )}
                            </button>
                        )}
                    </PDFDownloadLink>
                </div>

                {/* Reschedule Button */}
                <button
                    className={`flex justify-center items-center py-2 px-4 rounded-md w-[30%] min-w-[100px] ${
                        canReschedule()
                            ? "bg-blue-500 hover:bg-blue-800 text-white"
                            : "bg-gray-400 cursor-not-allowed"
                    }`}
                    onClick={openModal1}
                    disabled={!canReschedule()}
                >
                    Reschedule
                </button>
            </div>

            {/* Reschedule Modal */}
            <dialog
                ref={modalRef1}
                className="modal w-full max-w-7xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop:bg-gray-900/50 backdrop:backdrop-blur-sm"
                aria-labelledby="reschedule-modal-title"
            >
                <div className="modal-box w-full bg-white rounded-xl shadow-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3
                            id="reschedule-modal-title"
                            className="text-xl font-bold text-gray-900 text-center"
                        >
                            Reschedule Appointment
                        </h3>
                        <button
                            onClick={() => modalRef1.current.close()}
                            className="text-gray-400 hover:text-gray-500"
                            aria-label="Close modal"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    <div className="mb-6 p-3 bg-yellow-50 rounded-lg border border-yellow-200 flex items-start gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-yellow-500 flex-shrink-0"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <p className="text-sm text-yellow-700 text-justify">
                            <span className="font-medium">
                                Rescheduling Rules:
                            </span>{" "}
                            Users can only reschedule once, up to 2 days before
                            the appointment. Only "ongoing" appointments can be
                            rescheduled.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                        <div className="flex flex-col">
                            <Calendar
                                formData={formData}
                                setFormData={setFormData}
                                limit={limit}
                                appointments={appointments}
                                userRole={userRole}
                                setIsTimeSelected={setIsTimeSelected}
                            />
                        </div>

                        <div className="flex flex-col">
                            <TimePicker
                                formData={formData}
                                setFormData={setFormData}
                                limit={limit}
                                appointments={appointments}
                                setTimeSelected={() => setIsTimeSelected(true)}
                                userRole={userRole}
                            />
                        </div>
                    </div>

                    <div className="flex justify-center gap-4 mt-6">
                        <button
                            type="button"
                            className="px-6 py-2 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={() => modalRef1.current.close()}
                            disabled={isProcessingReschedule}
                        >
                            Cancel
                        </button>
                        <button
                            className={`px-6 py-2 text-base font-medium text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                isTimeSelected && !isProcessingReschedule
                                    ? "bg-blue-600 hover:bg-blue-700"
                                    : "bg-gray-400 cursor-not-allowed"
                            }`}
                            type="button"
                            onClick={(e) => handleReSched(e, aptData.aptid)}
                            disabled={!isTimeSelected || isProcessingReschedule}
                        >
                            {isProcessingReschedule ? (
                                <span className="flex items-center gap-2">
                                    <svg
                                        className="animate-spin h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                "Confirm"
                            )}
                        </button>
                    </div>
                </div>
            </dialog>

            {/* Delete Modal */}
            <dialog ref={modalRef2} className="modal">
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] sm:w-[80vw] md:w-[500px] bg-[#194F90] rounded-lg shadow-lg p-4 backdrop:bg-black/50">
                    <div className="modal-box text-white bg-[#194F90]">
                        <h3 className="font-bold text-lg sm:text-xl text-center md:text-left">
                            Do you want to delete this appointment?
                        </h3>
                        <p className="py-4 text-center sm:text-left">
                            Appointment Number: {aptData.aptid}
                        </p>

                        <div className="mb-6 p-3 bg-red-50 rounded-lg border border-red-200 flex items-start gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-red-500 flex-shrink-0"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <p className="text-sm text-red-700">
                                <span className="font-medium">Warning:</span>{" "}
                                Only appointments with "ongoing" status can be
                                deleted.
                            </p>
                        </div>

                        <div className="modal-action flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                            <button
                                type="button"
                                className="w-full sm:w-auto mt-2 sm:mt-6 px-4 sm:px-6 py-2 border border-white text-white rounded-lg transition duration-100 ease-in-out hover:bg-white hover:text-[#194F90] text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={(e) => handleDelete(e, aptData.aptid)}
                                disabled={isProcessingDelete}
                            >
                                {isProcessingDelete ? (
                                    <span className="flex items-center gap-2 justify-center">
                                        <svg
                                            className="animate-spin h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : (
                                    "Confirm"
                                )}
                            </button>
                            <button
                                type="button"
                                className="w-full sm:w-auto mt-2 sm:mt-6 px-4 sm:px-6 py-2 border border-white text-white rounded-lg transition duration-100 ease-in-out hover:bg-white hover:text-[#194F90] text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => modalRef2.current.close()}
                                disabled={isProcessingDelete}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </dialog>
        </div>
    );
}

export default DetailsInfo;
