import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../Hooks/useAuth";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSync } from "react-icons/fa";

function AppointmentsAdmin() {
    const [aptemail, setAptEmail] = useState("");
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const [aptData, setAptData] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [filterStatus, setFilterStatus] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
    const { role, branch } = useAuth();
    const [selectedAppointmentNum, setSelectedAppointmentNum] = useState(null);
    const [confirmationMessage, setConfirmationMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [action, setAction] = useState(null);
    const modalRef = useRef(null);
    const [selectedAttachments, setSelectedAttachments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOtherPurposeModalOpen, setOtherPurposeModalOpen] = useState(false);
    const [selectedOtherPurpose, setSelectedOtherPurpose] = useState("");

    const getData = async () => {
        setLoading(true);
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
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            getData(); // Fetch data every 60 seconds
        }, 60000); // 60 seconds interval

        getData(); // Fetch data immediately on component mount

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [role, branch, apiBaseUrl]);

    const handleReload = async () => {
        setLoading(true);
        await getData();
        setLoading(false);
    };

    useEffect(() => {
        let filteredResults = aptData.filter((apt) => {
            return apt.aptemail.toLowerCase().includes(aptemail.toLowerCase());
        });

        if (filterStatus) {
            filteredResults = filteredResults.filter((apt) =>
                apt.aptstatus.toLowerCase().includes(filterStatus.toLowerCase())
            );
        }

        setSearchResults(filteredResults);
    }, [aptemail, aptData, filterStatus]);

    const handleConfirm = async (id) => {
        setModalTitle("Confirm Appointment");
        setConfirmationMessage(
            "Are you sure you want to confirm this appointment?"
        );
        setSelectedAppointmentNum(id);
        setAction(() => () => confirmAppointment(id)); // Set action
        modalRef.current.showModal();
    };

    const handleDone = async (id) => {
        setModalTitle("Mark Appointment as Done");
        setConfirmationMessage(
            "Are you sure you want to mark this appointment as done?"
        );
        setSelectedAppointmentNum(id);
        setAction(() => () => markAppointmentDone(id)); // Set action
        modalRef.current.showModal();
    };

    const handleCancel = async (id) => {
        setModalTitle("Cancel Appointment");
        setConfirmationMessage(
            "Are you sure you want to cancel this appointment?"
        );
        setSelectedAppointmentNum(id);
        setAction(() => () => cancelAppointment(id)); // Set action
        modalRef.current.showModal();
    };

    const handleDelete = async (id) => {
        setModalTitle("Delete Appointment");
        setConfirmationMessage(
            "Are you sure you want to delete this appointment?"
        );
        setSelectedAppointmentNum(id);
        setAction(() => () => deleteAppointment(id)); // Set action
        modalRef.current.showModal();
    };

    // Define the appointment action functions...
    const confirmAppointment = async (id) => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${apiBaseUrl}/api/appointments/confirm/${id}`,
                {}
            );
            if (response.status === 200) {
                toast.success("Appointment confirmed.");
                getData(); // Refetch data
            }
        } catch (error) {
            toast.error("Error confirming appointment.");
        } finally {
            setLoading(false);
        }
    };

    const markAppointmentDone = async (id) => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${apiBaseUrl}/api/appointments/done/${id}`,
                {}
            );
            if (response.status === 200) {
                toast.success("Appointment marked as done.");
                getData(); // Refetch data
            }
        } catch (error) {
            toast.error("Error marking appointment as done.");
        } finally {
            setLoading(false);
        }
    };

    const cancelAppointment = async (id) => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${apiBaseUrl}/api/appointments/cancel/${id}`,
                {}
            );
            if (response.status === 200) {
                toast.success("Appointment cancelled.");
                getData(); // Refetch data
            }
        } catch (error) {
            toast.error("Error cancelling appointment.");
        } finally {
            setLoading(false);
        }
    };

    const deleteAppointment = async (id) => {
        setLoading(true);
        try {
            const response = await axios.delete(
                `${apiBaseUrl}/api/appointments/${id}`
            );
            if (response.status === 200) {
                toast.success("Appointment deleted.");
                getData(); // Refetch data
            }
        } catch (error) {
            toast.error("Error deleting appointment.");
        } finally {
            setLoading(false);
        }
    };

    const sortData = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });

        const sortedData = [...searchResults].sort((a, b) => {
            if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
            if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
            return 0;
        });
        setSearchResults(sortedData);
    };

    const SortArrow = ({ direction }) => {
        if (direction === "asc") {
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    className="mb-1"
                >
                    <path d="M3 9l4 4 4-4H3z" />
                </svg>
            );
        }
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
                className="mt-2"
            >
                <path d="M3 5l4-4 4 4H3z" />
            </svg>
        );
    };

    const openAttachmentModal = (attachments) => {
        setSelectedAttachments(JSON.parse(attachments)); // Convert JSON string back to array
        setIsModalOpen(true);
    };

    const closeAttachmentModal = () => {
        setSelectedAttachments([]);
        setIsModalOpen(false);
    };

    const openOtherPurposeModal = (purpose) => {
        setSelectedOtherPurpose(purpose);
        setOtherPurposeModalOpen(true);
    };

    const closeOtherPurposeModal = () => {
        setOtherPurposeModalOpen(false);
        setSelectedOtherPurpose("");
    };

    return (
        <div className="flex justify-center h-full">
            {loading && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-100/70">
                    <FaSync className="animate-spin text-[#194F90] text-8xl" />{" "}
                    {/* Spinner */}
                </div>
            )}
            <div className="flex flex-col items-center gap-[20px] flex-1 w-full">
                <input
                    className="text-gray-800 bg-white mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75] w-[300px] xsm:w-[200px] sm:w-[300px] text-md"
                    type="text"
                    placeholder="Search Appointment by Email"
                    value={aptemail}
                    onChange={(e) => setAptEmail(e.target.value)}
                />

                <div className="self-baseline flex items-center gap-2 mb-4">
                    <button
                        onClick={handleReload}
                        className="text-blue-500 hover:text-blue-700 mr-6"
                        disabled={loading}
                    >
                        <FaSync
                            className={`inline-block ${
                                loading ? "animate-spin" : ""
                            }`}
                        />
                    </button>

                    <p className="text-sm">Sort Status by:</p>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="text-gray-800 bg-white py-1 px-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75]"
                    >
                        <option value="">All</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="done">Done</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                {searchResults.length !== 0 && (
                    <div className="overflow-x-auto overflow-y-auto mb-4">
                        <table className="table-auto shadow-md rounded border border-gray-200 w-full divide-y-2 divide-gray-200 bg-white text-[10px]">
                            <thead className="ltr:text-center rtl:text-center">
                                <tr>
                                    <th
                                        className="whitespace-nowrap p-2 font-semibold text-gray-900 cursor-pointer"
                                        onClick={() => sortData("aptid")}
                                    >
                                        <div className="flex items-center justify-center">
                                            Appointment <br />
                                            Number
                                            <span className="text-gray-500">
                                                <SortArrow
                                                    direction={
                                                        sortConfig.key ===
                                                        "aptid"
                                                            ? sortConfig.direction
                                                            : null
                                                    }
                                                />
                                            </span>
                                        </div>
                                    </th>
                                    <th
                                        className="whitespace-nowrap p-2  font-semibold text-gray-900 cursor-pointer"
                                        onClick={() => sortData("apttype")}
                                    >
                                        <div className="flex items-center justify-center">
                                            Type
                                            <span className="text-gray-500">
                                                <SortArrow
                                                    direction={
                                                        sortConfig.key ===
                                                        "apttype"
                                                            ? sortConfig.direction
                                                            : null
                                                    }
                                                />
                                            </span>
                                        </div>
                                    </th>
                                    <th
                                        className="whitespace-nowrap p-2  font-semibold text-gray-900 cursor-pointer"
                                        onClick={() => sortData("aptname")}
                                    >
                                        <div className="flex items-center justify-center">
                                            Full Name
                                            <span className="text-gray-500">
                                                <SortArrow
                                                    direction={
                                                        sortConfig.key ===
                                                        "aptname"
                                                            ? sortConfig.direction
                                                            : null
                                                    }
                                                />
                                            </span>
                                        </div>
                                    </th>
                                    <th
                                        className="whitespace-nowrap p-2  font-semibold text-gray-900 cursor-pointer"
                                        onClick={() => sortData("aptbranch")}
                                    >
                                        <div className="flex items-center justify-center">
                                            Branch
                                            <span className="text-gray-500">
                                                <SortArrow
                                                    direction={
                                                        sortConfig.key ===
                                                        "aptbranch"
                                                            ? sortConfig.direction
                                                            : null
                                                    }
                                                />
                                            </span>
                                        </div>
                                    </th>
                                    <th
                                        className="whitespace-nowrap p-2  font-semibold text-gray-900"
                                        onClick={() => sortData("aptoffice")}
                                    >
                                        <div className="flex items-center justify-center">
                                            Office
                                            <span className="text-gray-500">
                                                <SortArrow
                                                    direction={
                                                        sortConfig.key ===
                                                        "aptoffice"
                                                            ? sortConfig.direction
                                                            : null
                                                    }
                                                />
                                            </span>
                                        </div>
                                    </th>
                                    <th
                                        className="whitespace-nowrap p-2  font-semibold text-gray-900"
                                        onClick={() => sortData("aptdate")}
                                    >
                                        <div className="flex items-center justify-center">
                                            Date
                                            <span className="text-gray-500">
                                                <SortArrow
                                                    direction={
                                                        sortConfig.key ===
                                                        "aptdate"
                                                            ? sortConfig.direction
                                                            : null
                                                    }
                                                />
                                            </span>
                                        </div>
                                    </th>
                                    <th
                                        className="whitespace-nowrap p-2 font-semibold text-gray-900"
                                        onClick={() => sortData("apttime")}
                                    >
                                        <div className="flex items-center justify-center">
                                            Time
                                            <span className="text-gray-500">
                                                <SortArrow
                                                    direction={
                                                        sortConfig.key ===
                                                        "apttime"
                                                            ? sortConfig.direction
                                                            : null
                                                    }
                                                />
                                            </span>
                                        </div>
                                    </th>
                                    <th
                                        className="whitespace-nowrap p-2 font-semibold text-gray-900"
                                        onClick={() => sortData("aptpurpose")}
                                    >
                                        <div className="flex items-center justify-center">
                                            Purpose
                                            <span className="text-gray-500">
                                                <SortArrow
                                                    direction={
                                                        sortConfig.key ===
                                                        "aptpurpose"
                                                            ? sortConfig.direction
                                                            : null
                                                    }
                                                />
                                            </span>
                                        </div>
                                    </th>

                                    <th className="whitespace-nowrap px-4 py-2 font-semibold text-gray-900">
                                        Specified <br />
                                        Others
                                    </th>

                                    <th
                                        className="whitespace-nowrap p-2  font-semibold text-gray-900"
                                        onClick={() => sortData("aptstudnum")}
                                    >
                                        <div className="flex items-center justify-center">
                                            Student / ID <br />
                                            Number
                                            <span className="text-gray-500">
                                                <SortArrow
                                                    direction={
                                                        sortConfig.key ===
                                                        "aptstudnum"
                                                            ? sortConfig.direction
                                                            : null
                                                    }
                                                />
                                            </span>
                                        </div>
                                    </th>
                                    <th
                                        className="whitespace-nowrap p-2  font-semibold text-gray-900"
                                        onClick={() => sortData("aptstatus")}
                                    >
                                        <div className="flex items-center justify-center">
                                            Status
                                            <span className="text-gray-500">
                                                <SortArrow
                                                    direction={
                                                        sortConfig.key ===
                                                        "aptstatus"
                                                            ? sortConfig.direction
                                                            : null
                                                    }
                                                />
                                            </span>
                                        </div>
                                    </th>
                                    <th
                                        className="whitespace-nowrap p-2  font-semibold text-gray-900"
                                        onClick={() => sortData("aptemail")}
                                    >
                                        <div className="flex items-center justify-center">
                                            Email
                                            <span className="text-gray-500">
                                                <SortArrow
                                                    direction={
                                                        sortConfig.key ===
                                                        "aptemail"
                                                            ? sortConfig.direction
                                                            : null
                                                    }
                                                />
                                            </span>
                                        </div>
                                    </th>

                                    <th className="whitespace-nowrap p-2 font-semibold text-gray-900">
                                        Attachments
                                    </th>

                                    {role !== "superadmin" && (
                                        <th className="whitespace-nowrap p-2  font-semibold text-gray-900">
                                            Tools
                                        </th>
                                    )}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200 text-center">
                                {searchResults
                                    .slice(0, 20)
                                    .map((apt, index) => (
                                        <tr key={index}>
                                            <td className="whitespace-nowrap p-2 text-gray-900">
                                                {apt.aptid}
                                            </td>
                                            <td className="whitespace-nowrap p-2 text-gray-900">
                                                {apt.apttype}
                                            </td>
                                            <td className="whitespace-nowrap p-2 text-gray-700">
                                                {apt.aptname}
                                            </td>
                                            <td className="whitespace-nowrap p-2 text-gray-700">
                                                {apt.aptbranch}
                                            </td>
                                            <td className="whitespace-nowrap p-2 text-gray-700">
                                                {apt.aptoffice}
                                            </td>
                                            <td className="whitespace-nowrap p-2 text-gray-700">
                                                {apt.aptdate}
                                            </td>
                                            <td className="whitespace-nowrap p-2 text-gray-700">
                                                {apt.apttime}
                                            </td>
                                            <td className="whitespace-nowrap p-2 text-gray-700">
                                                {apt.aptpurpose}
                                            </td>
                                            <td className="whitespace-nowrap p-2 text-gray-700 text-center">
                                                {apt.aptother ? (
                                                    <button
                                                        onClick={() =>
                                                            openOtherPurposeModal(
                                                                apt.aptother
                                                            )
                                                        }
                                                        className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                                    >
                                                        View
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-400">
                                                        N/A
                                                    </span>
                                                )}
                                            </td>

                                            <td className="whitespace-nowrap p-2 text-gray-700">
                                                {apt.aptstudnum}
                                            </td>
                                            <td className="whitespace-nowrap p-2 text-gray-700">
                                                {apt.aptstatus}
                                            </td>
                                            <td className="whitespace-nowrap p-2 text-gray-700">
                                                {apt.aptemail}
                                            </td>

                                            <td className="whitespace-nowrap p-2 text-gray-700">
                                                {apt.aptattach ? (
                                                    <button
                                                        onClick={() =>
                                                            openAttachmentModal(
                                                                apt.aptattach
                                                            )
                                                        }
                                                        className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                                    >
                                                        View
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-400">
                                                        N/A
                                                    </span>
                                                )}
                                            </td>

                                            {role !== "superadmin" && (
                                                <td className="whitespace-nowrap p-2 text-gray-700">
                                                    <button
                                                        className=" group relative inline-block overflow-hidden border border-green-600 px-2 py-1 focus:outline-none focus:ring disabled:opacity-50 disabled:cursor-not-allowed"
                                                        onClick={() =>
                                                            handleConfirm(
                                                                apt.aptid
                                                            )
                                                        }
                                                        disabled={
                                                            apt.aptstatus !==
                                                            "ongoing"
                                                        }
                                                    >
                                                        <span className="absolute inset-x-0 bottom-0 h-[2px] bg-green-600 transition-all group-hover:h-full group-active:bg-green-500"></span>
                                                        <span className="relative font-medium text-green-600 transition-colors group-hover:text-white">
                                                            Confirm
                                                        </span>
                                                    </button>
                                                    <button
                                                        className="ml-2  group relative inline-block overflow-hidden border border-yellow-600 px-2 py-1 focus:outline-none focus:ring disabled:opacity-50 disabled:cursor-not-allowed"
                                                        onClick={() =>
                                                            handleDone(
                                                                apt.aptid
                                                            )
                                                        }
                                                        disabled={
                                                            apt.aptstatus !==
                                                            "confirmed"
                                                        }
                                                    >
                                                        <span className="absolute inset-x-0 bottom-0 h-[2px] bg-yellow-600 transition-all group-hover:h-full group-active:bg-yellow-500"></span>
                                                        <span className="relative font-medium text-yellow-600 transition-colors group-hover:text-white">
                                                            Done
                                                        </span>
                                                    </button>
                                                    <button
                                                        className="ml-2 group relative inline-block overflow-hidden border border-blue-600 px-2 py-1 focus:outline-none focus:ring disabled:opacity-50 disabled:cursor-not-allowed"
                                                        onClick={() =>
                                                            handleCancel(
                                                                apt.aptid
                                                            )
                                                        }
                                                        disabled={
                                                            apt.aptstatus ===
                                                                "done" ||
                                                            apt.aptstatus ===
                                                                "cancelled"
                                                        }
                                                    >
                                                        <span className="absolute inset-x-0 bottom-0 h-[2px] bg-blue-600 transition-all group-hover:h-full group-active:bg-blue-500"></span>
                                                        <span className="relative font-medium text-blue-600 transition-colors group-hover:text-white">
                                                            Cancel
                                                        </span>
                                                    </button>
                                                    <button
                                                        className="ml-2 group relative inline-block overflow-hidden border border-red-600 px-2 py-1 focus:outline-none focus:ring disabled:opacity-50 disabled:cursor-not-allowed"
                                                        onClick={() =>
                                                            handleDelete(
                                                                apt.aptid
                                                            )
                                                        }
                                                        disabled={
                                                            apt.aptstatus !==
                                                                "done" &&
                                                            apt.aptstatus !==
                                                                "cancelled"
                                                        }
                                                    >
                                                        <span className="absolute inset-x-0 bottom-0 h-[2px] bg-red-600 transition-all group-hover:h-full group-active:bg-red-500"></span>
                                                        <span className="relative font-medium text-red-600 transition-colors group-hover:text-white">
                                                            Delete
                                                        </span>
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {searchResults.length === 0 && (
                    <p>No appointments found for the selected criteria.</p>
                )}
            </div>

            <dialog
                ref={modalRef}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] bg-[#194F90] rounded-lg shadow-lg p-4 backdrop:bg-black/50"
            >
                <div className="modal-box text-white bg-[#194F90]">
                    <h3 className="font-bold text-lg">{modalTitle}</h3>
                    <p className="py-4">{confirmationMessage}</p>
                    <p className="py-4">
                        Appointment Number: {selectedAppointmentNum}
                    </p>
                    <div className="modal-action flex justify-center gap-4">
                        <button
                            className="mt-6 px-6 py-2 border border-white text-white rounded-lg transition duration-100 ease-in-out hover:bg-white hover:text-[#194F90]"
                            type="button"
                            onClick={() => {
                                action(); // Execute action
                                modalRef.current.close();
                            }}
                        >
                            Confirm
                        </button>
                        <button
                            className="mt-6 px-6 py-2 border border-white text-white rounded-lg transition duration-100 ease-in-out hover:bg-white hover:text-[#194F90]"
                            type="button"
                            onClick={async () => {
                                try {
                                    await action(); // Execute action
                                    modalRef.current.close();
                                } catch (error) {
                                    toast.error(
                                        "An error occurred while performing the action."
                                    );
                                }
                            }}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </dialog>

            {isModalOpen && (
                <dialog
                    open
                    className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] bg-[#194F90] rounded-lg shadow-lg p-6 backdrop:bg-black/50"
                    onKeyDown={(event) => {
                        if (event.key === "Escape") {
                            event.preventDefault();
                        }
                    }}
                >
                    <div className="relative flex flex-col justify-center items-center text-white bg-[#194F90] px-4 w-full">
                        {/* Modal Title */}
                        <h2 className="text-xl font-semibold mb-4">
                            View Attachments
                        </h2>

                        {/* Attachments Container */}
                        <div className="flex flex-col gap-4 w-full max-h-[500px] overflow-y-auto p-4 bg-white ">
                            {selectedAttachments.map((file, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-center p-4 border-b"
                                >
                                    {file.endsWith(".png") ||
                                    file.endsWith(".jpg") ||
                                    file.endsWith(".jpeg") ? (
                                        <img
                                            src={`${
                                                import.meta.env
                                                    .VITE_API_BASE_URL
                                            }/storage/${file}`}
                                            alt="Attachment"
                                            className="w-full h-[400px] object-contain bg-white p-2 rounded-lg"
                                        />
                                    ) : file.endsWith(".pdf") ? (
                                        <iframe
                                            src={`${
                                                import.meta.env
                                                    .VITE_API_BASE_URL
                                            }/storage/${file}`}
                                            className="w-full h-[400px] bg-white p-2 rounded-lg"
                                        ></iframe>
                                    ) : (
                                        <a
                                            href={`${
                                                import.meta.env
                                                    .VITE_API_BASE_URL
                                            }/storage/${file}`}
                                            download
                                            className="text-blue-600 underline"
                                        >
                                            Download File
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={closeAttachmentModal}
                            className="mt-4 px-6 py-2 bg-[#FFDB75] text-[#194F90] font-semibold rounded-md hover:bg-[#f3cd64] transition"
                        >
                            Close
                        </button>
                    </div>
                </dialog>
            )}

            {isOtherPurposeModalOpen && (
                <dialog
                    open
                    className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] bg-[#194F90] rounded-lg shadow-lg p-6 backdrop:bg-black/50"
                    onKeyDown={(event) => {
                        if (event.key === "Escape") {
                            event.preventDefault();
                        }
                    }}
                >
                    <div className="relative flex flex-col justify-center items-center text-white bg-[#194F90] px-4 w-full">
                        {/* Modal Title */}
                        <h2 className="text-xl font-semibold mb-4">
                            View Other Purpose
                        </h2>

                        {/* Display Other Purpose */}
                        <div className="w-full max-h-[300px] overflow-y-auto p-4 bg-white text-gray-800 rounded-lg">
                            <p className="text-md">{selectedOtherPurpose}</p>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={closeOtherPurposeModal}
                            className="mt-4 px-6 py-2 bg-[#FFDB75] text-[#194F90] font-semibold rounded-md hover:bg-[#f3cd64] transition"
                        >
                            Close
                        </button>
                    </div>
                </dialog>
            )}
        </div>
    );
}

export default AppointmentsAdmin;
