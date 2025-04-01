import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../Hooks/useAuth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAppointments from "../../Hooks/useAppointments";
import SummaryCards from "./Component/AppointmentsAdmin/SummaryCards";
import ConfirmationModal from "./Component/AppointmentsAdmin/ConfirmationModal";
import AttachmentModal from "./Component/AppointmentsAdmin/AttachmentModal";
import OtherPurposeModal from "./Component/AppointmentsAdmin/OtherPurposeModal";
import AppointmentsTable from "./Component/AppointmentsAdmin/AppointmentsTable";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

function AppointmentsAdmin() {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const { role, branch } = useAuth();
    const modalRef = useRef(null);
    const bulkModalRef = useRef(null);

    // Initialize with default empty array to prevent undefined errors
    const {
        aptData = [],
        searchResults = [],
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
        bulkDeleteAppointments,
    } = useAppointments(role, branch, apiBaseUrl);

    // State for filters
    const [filterStatus, setFilterStatus] = useState("");
    const [timeRange, setTimeRange] = useState("all");
    const [dateFilterAnchorEl, setDateFilterAnchorEl] = useState(null);

    // Modal states
    const [selectedAppointmentNum, setSelectedAppointmentNum] = useState(null);
    const [selectedAppointmentIds, setSelectedAppointmentIds] = useState([]);
    const [confirmationMessage, setConfirmationMessage] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const [action, setAction] = useState(null);
    const [bulkAction, setBulkAction] = useState(null);
    const [selectedAttachments, setSelectedAttachments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOtherPurposeModalOpen, setOtherPurposeModalOpen] = useState(false);
    const [selectedOtherPurpose, setSelectedOtherPurpose] = useState("");

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

    // Handle bulk actions
    const handleBulkAction = (ids, title, message, actionFn) => {
        setModalTitle(title);
        setConfirmationMessage(message);
        setSelectedAppointmentIds(ids);
        setBulkAction(() => () => actionFn(ids));
        bulkModalRef.current.showModal();
    };

    // Handle PDF export
    const handleExportRows = (rows) => {
        const doc = new jsPDF({
            orientation: "landscape",
            unit: "mm",
        });

        const title = "Appointments Report";
        const date = new Date().toLocaleDateString();
        doc.setFontSize(16);
        doc.text(title, 14, 10);
        doc.setFontSize(10);
        doc.text(`Generated on: ${date}`, 14, 16);

        const tableData = rows.map((row) => [
            row.original.aptid,
            row.original.apttype,
            row.original.aptname,
            row.original.aptbranch,
            row.original.aptoffice,
            formatDate(row.original.aptdate),
            row.original.apttime,
            row.original.aptpurpose,
            truncateText(row.original.aptother || "N/A", 15),
            row.original.aptstudnum,
            row.original.aptstatus,
            row.original.aptemail,
            row.original.aptattach ? "Yes" : "No",
        ]);

        const tableHeaders = [
            "Appt #",
            "Type",
            "Full Name",
            "Branch",
            "Office",
            "Date",
            "Time",
            "Purpose",
            "Other Purpose",
            "ID Number",
            "Status",
            "Email",
            "Attachments",
        ];

        autoTable(doc, {
            head: [tableHeaders],
            body: tableData,
            startY: 20,
            styles: {
                fontSize: 8,
                cellPadding: 2,
                overflow: "linebreak",
            },
            headStyles: {
                fillColor: [25, 79, 144],
                textColor: 255,
                fontStyle: "bold",
            },
            columnStyles: {
                0: { cellWidth: 25 },
                1: { cellWidth: 15 },
                2: { cellWidth: 25 },
                3: { cellWidth: 20 },
                4: { cellWidth: 25 },
                5: { cellWidth: 15 },
                6: { cellWidth: 15 },
                7: { cellWidth: 25 },
                8: { cellWidth: 25 },
                9: { cellWidth: 20 },
                10: { cellWidth: 16 },
                11: { cellWidth: 30 },
                12: { cellWidth: 22 },
            },
            margin: { left: 10, right: 10 },
            pageBreak: "auto",
            tableWidth: "wrap",
        });

        doc.save(`appointments-${new Date().toISOString().slice(0, 10)}.pdf`);
    };

    // Helper function to truncate long text
    const truncateText = (text, maxLength) => {
        if (!text) return "N/A";
        return text.length > maxLength
            ? text.substring(0, maxLength) + "..."
            : text;
    };

    // Format date for display
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            });
        } catch {
            return dateString;
        }
    };

    // Open attachment modal
    const openAttachmentModal = (attachments) => {
        try {
            setSelectedAttachments(JSON.parse(attachments));
            setIsModalOpen(true);
        } catch (error) {
            toast.error("Error loading attachments");
        }
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
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Appointment Management
                    </h1>
                    <p className="text-gray-600">Manage appointment details</p>
                </div>

                {/* Summary Cards */}
                <SummaryCards searchResults={searchResults} />

                {/* Material React Table */}
                <AppointmentsTable
                    searchResults={searchResults}
                    aptData={aptData}
                    filterStatus={filterStatus}
                    timeRange={timeRange}
                    dateFilterAnchorEl={dateFilterAnchorEl}
                    setFilterStatus={setFilterStatus}
                    setTimeRange={setTimeRange}
                    setDateFilterAnchorEl={setDateFilterAnchorEl}
                    handleReload={handleReload}
                    role={role}
                    isProcessing={isProcessing}
                    handleAction={handleAction}
                    handleBulkAction={handleBulkAction}
                    confirmAppointment={confirmAppointment}
                    markAppointmentDone={markAppointmentDone}
                    cancelAppointment={cancelAppointment}
                    deleteAppointment={deleteAppointment}
                    bulkConfirmAppointments={bulkConfirmAppointments}
                    bulkMarkAppointmentsDone={bulkMarkAppointmentsDone}
                    bulkCancelAppointments={bulkCancelAppointments}
                    bulkDeleteAppointments={bulkDeleteAppointments}
                    openAttachmentModal={openAttachmentModal}
                    openOtherPurposeModal={openOtherPurposeModal}
                    setSearchResults={setSearchResults}
                    handleExportRows={handleExportRows}
                />

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

                {/* Bulk Action Modal */}
                <ConfirmationModal
                    modalRef={bulkModalRef}
                    modalTitle={modalTitle}
                    confirmationMessage={confirmationMessage}
                    selectedAppointmentNum={null}
                    selectedAppointmentIds={selectedAppointmentIds}
                    isProcessing={isProcessing}
                    action={bulkAction}
                    setIsProcessing={setIsProcessing}
                    isBulkAction={true}
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
        </div>
    );
}

export default AppointmentsAdmin;
