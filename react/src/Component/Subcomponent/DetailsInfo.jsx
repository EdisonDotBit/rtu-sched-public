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

    // Disable reschedule button if appointment is rescheduled or within 2 days
    const isRescheduleDisabled = () => {
        const today = new Date();
        const aptDate = new Date(aptData.aptdate);
        const diffInDays = (aptDate - today) / (1000 * 60 * 60 * 24);
        return aptData.rescheduled || diffInDays <= 2;
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
            <div className="flow-root rounded-lg border border-gray-100 shadow-sm mb-4">
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
            <div className="flex justify-evenly mb-4">
                <button
                    className={`flex justify-center items-center py-2 px-4 rounded-md w-1/3 mr-2 ${
                        ["confirmed", "cancelled", "done"].includes(
                            aptData.aptstatus?.toLowerCase()
                        )
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-red-500 hover:bg-red-700 text-white"
                    }`}
                    onClick={openModal2}
                    disabled={["confirmed"].includes(
                        aptData.aptstatus?.toLowerCase()
                    )}
                >
                    Delete
                </button>

                <PDFDownloadLink
                    document={<PDFFile succData={aptData} />}
                    fileName="RTU-Appointment-Receipt.pdf"
                >
                    {({ loading }) =>
                        loading ? (
                            <button className="flex justify-center items-center bg-blue-500 text-white py-2 px-4 rounded-md w-full ml-2">
                                Loading Download...
                            </button>
                        ) : (
                            <button className="flex justify-center items-center bg-blue-500 hover:bg-blue-800 text-white py-2 px-8 rounded-md w-full">
                                Print
                            </button>
                        )
                    }
                </PDFDownloadLink>

                <button
                    className={`flex justify-center items-center py-2 px-4 rounded-md w-1/3 ml-2 ${
                        isRescheduleDisabled()
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-800 text-white"
                    }`}
                    onClick={openModal1}
                    disabled={isRescheduleDisabled()}
                >
                    Reschedule
                </button>
            </div>

            {/* Reschedule Modal */}
            <dialog ref={modalRef1} className="modal">
                <div className="p-4 fixed rounded-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl min-h-[50vh] sm:min-h-[60vh] lg:min-h-[70vh] overflow-y-auto flex flex-col justify-start items-center text-white bg-gray-100">
                    <h1 className="font-bold text-3xl text-black mb-6">
                        Reschedule Appointment
                    </h1>
                    <div className="w-full flex flex-col sm:flex-row justify-center items-center">
                        <Calendar
                            formData={formData}
                            setFormData={setFormData}
                            limit={limit}
                            appointments={appointments}
                            userRole={userRole}
                            setIsTimeSelected={setIsTimeSelected}
                        />
                        <TimePicker
                            formData={formData}
                            setFormData={setFormData}
                            limit={limit}
                            appointments={appointments}
                            setTimeSelected={() => setIsTimeSelected(true)}
                            userRole={userRole}
                        />
                    </div>
                    <div className="modal-action flex justify-center gap-4">
                        <button
                            className={`px-6 py-2 text-sm font-semibold border-none rounded-md ${
                                isTimeSelected
                                    ? "bg-[#194F90] hover:bg-[#123A69]"
                                    : "bg-gray-400 cursor-not-allowed"
                            } font-medium`}
                            type="button"
                            onClick={(e) => handleReSched(e, aptData.aptid)}
                            disabled={!isTimeSelected}
                        >
                            Confirm
                        </button>
                        <button
                            type="button"
                            className="px-6 py-2 text-sm font-semibold border-none rounded-md bg-[#194F90] hover:bg-[#123A69]"
                            onClick={() => modalRef1.current.close()}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </dialog>

            {/* Delete Modal */}
            <dialog ref={modalRef2} className="modal">
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] bg-[#194F90] rounded-lg shadow-lg p-4 backdrop:bg-black/50">
                    <div className="modal-box text-white bg-[#194F90]">
                        <h3 className="font-bold text-lg">
                            Do you want to delete this appointment?
                        </h3>
                        <p className="py-4">
                            Appointment Number: {aptData.aptid}
                        </p>
                        <div className="modal-action flex justify-center gap-4">
                            <button
                                type="button"
                                className="mt-6 px-6 py-2 border border-white text-white rounded-lg transition duration-100 ease-in-out hover:bg-white hover:text-[#194F90]"
                                onClick={(e) => handleDelete(e, aptData.aptid)}
                            >
                                Confirm
                            </button>
                            <button
                                type="button"
                                className="mt-6 px-6 py-2 border border-white text-white rounded-lg transition duration-100 ease-in-out hover:bg-white hover:text-[#194F90]"
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
