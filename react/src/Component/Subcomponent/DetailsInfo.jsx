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
        }
    };

    // Handle delete
    const handleDelete = async (e, id) => {
        e.preventDefault();
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
            <dialog ref={modalRef1} className="modal">
                <div className="p-4 fixed rounded-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-3xl h-[80vh] sm:h-auto min-h-[50vh] sm:min-h-[60vh] lg:min-h-[70vh] overflow-y-auto flex flex-col justify-start items-center bg-gray-100">
                    <h1 className="font-bold text-xl sm:text-2xl lg:text-3xl text-black mb-4 sm:mb-6">
                        Reschedule Appointment
                    </h1>
                    <div className="w-full flex flex-col lg:flex-row justify-center items-center gap-4">
                        <div className="w-full lg:w-1/2">
                            <Calendar
                                formData={formData}
                                setFormData={setFormData}
                                limit={limit}
                                appointments={appointments}
                                userRole={userRole}
                                setIsTimeSelected={setIsTimeSelected}
                            />
                        </div>
                        <div className="w-full lg:w-1/2">
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
                    <div className="modal-action flex flex-row justify-center gap-4 mt-4 sm:mt-6 w-full">
                        <button
                            className={`px-4 sm:px-6 py-2 text-sm sm:text-base font-semibold border-none rounded-md ${
                                isTimeSelected
                                    ? "bg-[#194F90] hover:bg-[#123A69]"
                                    : "bg-gray-400 cursor-not-allowed"
                            } text-white min-w-[100px]`}
                            type="button"
                            onClick={(e) => handleReSched(e, aptData.aptid)}
                            disabled={!isTimeSelected}
                        >
                            Confirm
                        </button>
                        <button
                            type="button"
                            className="px-4 sm:px-6 py-2 text-sm sm:text-base font-semibold border-none rounded-md bg-[#194F90] hover:bg-[#123A69] text-white min-w-[100px]"
                            onClick={() => modalRef1.current.close()}
                        >
                            Close
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
                        <div className="modal-action flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                            <button
                                type="button"
                                className="w-full sm:w-auto mt-2 sm:mt-6 px-4 sm:px-6 py-2 border border-white text-white rounded-lg transition duration-100 ease-in-out hover:bg-white hover:text-[#194F90] text-sm sm:text-base"
                                onClick={(e) => handleDelete(e, aptData.aptid)}
                            >
                                Confirm
                            </button>
                            <button
                                type="button"
                                className="w-full sm:w-auto mt-2 sm:mt-6 px-4 sm:px-6 py-2 border border-white text-white rounded-lg transition duration-100 ease-in-out hover:bg-white hover:text-[#194F90] text-sm sm:text-base"
                                onClick={() => modalRef2.current.close()}
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
