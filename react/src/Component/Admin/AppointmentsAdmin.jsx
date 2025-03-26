import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../Hooks/useAuth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSync, FaSearch, FaFilter, FaCalendarAlt } from "react-icons/fa";
import useAppointments from "../../Hooks/useAppointments";
import SummaryCards from "./Component/AppointsmentsAdmin/SummaryCards";
import TableHeader from "./Component/AppointsmentsAdmin/TableHeader";
import TableRow from "./Component/AppointsmentsAdmin/TableRow";
import ConfirmationModal from "./Component/AppointsmentsAdmin/ConfirmationModal";
import AttachmentModal from "./Component/AppointsmentsAdmin/AttachmentModal";
import OtherPurposeModal from "./Component/AppointsmentsAdmin/OtherPurposeModal";

function AppointmentsAdmin() {
    const [aptemail, setAptEmail] = useState("");
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const [filterStatus, setFilterStatus] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
    const { role, branch } = useAuth();
    const [selectedAppointmentNum, setSelectedAppointmentNum] = useState(null);
    const [confirmationMessage, setConfirmationMessage] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const [action, setAction] = useState(null);
    const modalRef = useRef(null);
    const [selectedAttachments, setSelectedAttachments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOtherPurposeModalOpen, setOtherPurposeModalOpen] = useState(false);
    const [selectedOtherPurpose, setSelectedOtherPurpose] = useState("");
    const [timeRange, setTimeRange] = useState("all");
    const [showDateDropdown, setShowDateDropdown] = useState(false);

    const {
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
    } = useAppointments(role, branch, apiBaseUrl);

    // Filter and sort data
    useEffect(() => {
        let filteredResults = [...aptData];

        // Apply email filter
        if (aptemail) {
            filteredResults = filteredResults.filter((apt) =>
                apt.aptemail.toLowerCase().includes(aptemail.toLowerCase())
            );
        }

        // Apply status filter
        if (filterStatus) {
            filteredResults = filteredResults.filter((apt) =>
                apt.aptstatus.toLowerCase().includes(filterStatus.toLowerCase())
            );
        }

        // Apply time range filter based on appointment date (aptdate)
        if (timeRange !== "all") {
            const now = new Date();
            const today = new Date(now);
            today.setHours(0, 0, 0, 0); // Start of today

            filteredResults = filteredResults.filter((apt) => {
                try {
                    const aptDate = new Date(apt.aptdate);
                    aptDate.setHours(0, 0, 0, 0); // Normalize to start of day

                    switch (timeRange) {
                        case "today":
                            return aptDate.getTime() === today.getTime();
                        case "week":
                            // Get start of current week (Sunday)
                            const startOfWeek = new Date(today);
                            startOfWeek.setDate(
                                today.getDate() - today.getDay()
                            );
                            // Get end of current week (Saturday)
                            const endOfWeek = new Date(startOfWeek);
                            endOfWeek.setDate(startOfWeek.getDate() + 6);
                            return (
                                aptDate >= startOfWeek && aptDate <= endOfWeek
                            );
                        case "month":
                            // Get start of current month
                            const startOfMonth = new Date(
                                today.getFullYear(),
                                today.getMonth(),
                                1
                            );
                            // Get end of current month
                            const endOfMonth = new Date(
                                today.getFullYear(),
                                today.getMonth() + 1,
                                0
                            );
                            return (
                                aptDate >= startOfMonth && aptDate <= endOfMonth
                            );
                        default:
                            return true;
                    }
                } catch (error) {
                    console.error("Error parsing date:", apt.aptdate, error);
                    return false;
                }
            });
        }

        // Sort by appointment date (aptdate) - soonest first
        filteredResults.sort((a, b) => {
            const dateA = new Date(a.aptdate);
            const dateB = new Date(b.aptdate);
            return dateA - dateB; // For chronological order (soonest first)
        });

        setSearchResults(filteredResults);
    }, [aptemail, aptData, filterStatus, timeRange]);

    // Handle manual refresh
    const handleReload = async () => {
        toast.info("Refreshing appointment data...");
        await getData();
        toast.success("Appointment data refreshed.");
    };

    // Handle appointment actions
    const handleAction = (id, title, message, actionFn) => {
        setModalTitle(title);
        setConfirmationMessage(message);
        setSelectedAppointmentNum(id);
        setAction(() => () => actionFn(id));
        modalRef.current.showModal();
    };

    // Sort data
    const sortData = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });

        const sortedData = [...searchResults].sort((a, b) => {
            // Special handling for date sorting
            if (key === "aptdate") {
                const dateA = new Date(a[key]);
                const dateB = new Date(b[key]);
                return direction === "asc" ? dateA - dateB : dateB - dateA;
            }

            if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
            if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
            return 0;
        });
        setSearchResults(sortedData);
    };

    // Open attachment modal
    const openAttachmentModal = (attachments) => {
        setSelectedAttachments(JSON.parse(attachments));
        setIsModalOpen(true);
    };

    // Close attachment modal
    const closeAttachmentModal = () => {
        setSelectedAttachments([]);
        setIsModalOpen(false);
    };

    // Open other purpose modal
    const openOtherPurposeModal = (purpose) => {
        setSelectedOtherPurpose(purpose);
        setOtherPurposeModalOpen(true);
    };

    // Close other purpose modal
    const closeOtherPurposeModal = () => {
        setOtherPurposeModalOpen(false);
        setSelectedOtherPurpose("");
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header and Controls */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Appointment Management
                    </h1>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <input
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                type="text"
                                placeholder="Search by email..."
                                value={aptemail}
                                onChange={(e) => setAptEmail(e.target.value)}
                            />
                        </div>

                        {/* Filter and Refresh */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleReload}
                                className="p-2 bg-white rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors"
                                title="Refresh data"
                            >
                                <FaSync className="text-blue-600" />
                            </button>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaFilter className="text-gray-400" />
                                </div>
                                <select
                                    value={filterStatus}
                                    onChange={(e) =>
                                        setFilterStatus(e.target.value)
                                    }
                                    className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="ongoing">Ongoing</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="done">Done</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            {/* Date Filter Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() =>
                                        setShowDateDropdown(!showDateDropdown)
                                    }
                                    className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
                                >
                                    <FaCalendarAlt className="text-gray-600" />
                                    <span className="text-sm">
                                        {timeRange === "all"
                                            ? "All Dates"
                                            : timeRange
                                                  .charAt(0)
                                                  .toUpperCase() +
                                              timeRange.slice(1)}
                                    </span>
                                </button>

                                {showDateDropdown && (
                                    <div className="absolute right-0 mt-1 z-10 bg-white p-2 rounded-lg shadow-lg border border-gray-200 w-40">
                                        <button
                                            onClick={() => {
                                                setTimeRange("today");
                                                setShowDateDropdown(false);
                                            }}
                                            className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                                        >
                                            Today
                                        </button>
                                        <button
                                            onClick={() => {
                                                setTimeRange("week");
                                                setShowDateDropdown(false);
                                            }}
                                            className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                                        >
                                            This Week
                                        </button>
                                        <button
                                            onClick={() => {
                                                setTimeRange("month");
                                                setShowDateDropdown(false);
                                            }}
                                            className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                                        >
                                            This Month
                                        </button>
                                        <button
                                            onClick={() => {
                                                setTimeRange("all");
                                                setShowDateDropdown(false);
                                            }}
                                            className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                                        >
                                            All Time
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <SummaryCards searchResults={searchResults} />

                {/* Appointment Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {searchResults.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <TableHeader
                                    sortConfig={sortConfig}
                                    sortData={sortData}
                                    role={role}
                                />
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {searchResults.map((apt) => (
                                        <TableRow
                                            key={apt.aptid}
                                            apt={apt}
                                            role={role}
                                            openOtherPurposeModal={
                                                openOtherPurposeModal
                                            }
                                            openAttachmentModal={
                                                openAttachmentModal
                                            }
                                            handleAction={handleAction}
                                            confirmAppointment={
                                                confirmAppointment
                                            }
                                            markAppointmentDone={
                                                markAppointmentDone
                                            }
                                            cancelAppointment={
                                                cancelAppointment
                                            }
                                            deleteAppointment={
                                                deleteAppointment
                                            }
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            No appointments found matching your criteria
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <ConfirmationModal
                modalRef={modalRef}
                modalTitle={modalTitle}
                confirmationMessage={confirmationMessage}
                selectedAppointmentNum={selectedAppointmentNum}
                isProcessing={isProcessing}
                action={action}
                setIsProcessing={setIsProcessing}
            />

            <AttachmentModal
                isModalOpen={isModalOpen}
                selectedAttachments={selectedAttachments}
                closeAttachmentModal={closeAttachmentModal}
            />

            <OtherPurposeModal
                isOtherPurposeModalOpen={isOtherPurposeModalOpen}
                selectedOtherPurpose={selectedOtherPurpose}
                closeOtherPurposeModal={closeOtherPurposeModal}
            />
        </div>
    );
}

export default AppointmentsAdmin;
