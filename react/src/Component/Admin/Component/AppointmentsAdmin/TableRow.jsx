import { format } from "date-fns";
import StatusBadge from "./StatusBadge";
import ActionButton from "./ActionButton";

const TableRow = ({
    apt,
    role,
    openOtherPurposeModal,
    openAttachmentModal,
    handleAction,
    confirmAppointment,
    markAppointmentDone,
    cancelAppointment,
    deleteAppointment,
}) => {
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return format(date, "MMM dd, yyyy");
        } catch {
            return dateString;
        }
    };

    return (
        <tr key={apt.aptid} className="hover:bg-gray-50 transition-colors">
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                {apt.aptid}
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                    {apt.apttype}
                </span>
            </td>
            <td
                className="px-4 py-3 text-sm text-gray-900 truncate"
                title={apt.aptname}
            >
                {apt.aptname}
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                {apt.aptbranch}
            </td>
            <td
                className="px-4 py-3 text-sm text-gray-900 max-w-[120px] truncate"
                title={apt.aptoffice}
            >
                {apt.aptoffice}
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                {formatDate(apt.aptdate)}
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                {apt.apttime}
            </td>
            <td
                className="px-4 py-3 text-sm text-gray-900 truncate"
                title={apt.aptpurpose}
            >
                {apt.aptpurpose}
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                {apt.aptother ? (
                    <ActionButton
                        onClick={() => openOtherPurposeModal(apt.aptother)}
                        label="View"
                        color="blue"
                    />
                ) : (
                    <span className="text-gray-400 text-xs">N/A</span>
                )}
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                {apt.aptstudnum}
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm">
                <StatusBadge status={apt.aptstatus} />
            </td>
            <td
                className="px-4 py-3 text-sm text-gray-900  truncate"
                title={apt.aptemail}
            >
                {apt.aptemail}
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                {apt.aptattach ? (
                    <ActionButton
                        onClick={() => openAttachmentModal(apt.aptattach)}
                        label="View"
                        color="blue"
                    />
                ) : (
                    <span className="text-gray-400 text-xs">N/A</span>
                )}
            </td>
            {role !== "superadmin" && (
                <td className="px-4 py-3 whitespace-nowrap text-sm text-center space-x-1">
                    <div className="flex flex-col sm:flex-row gap-1">
                        <ActionButton
                            onClick={() =>
                                handleAction(
                                    apt.aptid,
                                    "Confirm Appointment",
                                    "Are you sure you want to confirm this appointment?",
                                    confirmAppointment
                                )
                            }
                            disabled={apt.aptstatus !== "ongoing"}
                            label="Confirm"
                            color="green"
                        />
                        <ActionButton
                            onClick={() =>
                                handleAction(
                                    apt.aptid,
                                    "Mark as Done",
                                    "Are you sure you want to mark this appointment as done?",
                                    markAppointmentDone
                                )
                            }
                            disabled={apt.aptstatus !== "confirmed"}
                            label="Done"
                            color="blue"
                        />
                        <ActionButton
                            onClick={() =>
                                handleAction(
                                    apt.aptid,
                                    "Cancel Appointment",
                                    "Are you sure you want to cancel this appointment?",
                                    cancelAppointment
                                )
                            }
                            disabled={
                                apt.aptstatus === "done" ||
                                apt.aptstatus === "cancelled"
                            }
                            label="Cancel"
                            color="yellow"
                        />
                        <ActionButton
                            onClick={() =>
                                handleAction(
                                    apt.aptid,
                                    "Delete Appointment",
                                    "Are you sure you want to delete this appointment?",
                                    deleteAppointment
                                )
                            }
                            disabled={
                                apt.aptstatus !== "done" &&
                                apt.aptstatus !== "cancelled"
                            }
                            label="Delete"
                            color="red"
                        />
                    </div>
                </td>
            )}
        </tr>
    );
};

export default TableRow;
