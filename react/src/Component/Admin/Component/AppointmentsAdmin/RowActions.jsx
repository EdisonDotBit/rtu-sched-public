import { Box, IconButton } from "@mui/material";
import { Check, TaskAlt, Close, Delete } from "@mui/icons-material";
import TooltipWrapper from "./TooltipWrapper";

const RowActions = ({
    role,
    isProcessing,
    handleAction,
    confirmAppointment,
    markAppointmentDone,
    cancelAppointment,
    deleteAppointment,
}) => {
    return ({ row, table }) => {
        // Hide all actions for superadmin
        if (role === "superadmin") return null;

        const isConfirmDisabled =
            row.original.aptstatus !== "ongoing" || isProcessing;
        const isMarkDoneDisabled =
            row.original.aptstatus !== "confirmed" || isProcessing;
        const isCancelDisabled =
            row.original.aptstatus === "done" ||
            row.original.aptstatus === "cancelled" ||
            isProcessing;
        const isDeleteDisabled =
            (row.original.aptstatus !== "done" &&
                row.original.aptstatus !== "cancelled") ||
            isProcessing;

        return (
            <Box sx={{ display: "flex", gap: "0.5rem" }}>
                <TooltipWrapper title="Confirm" disabled={isConfirmDisabled}>
                    <IconButton
                        color="success"
                        onClick={() =>
                            handleAction(
                                row.original.aptid,
                                "Confirm Appointment",
                                "Are you sure you want to confirm this appointment?",
                                confirmAppointment
                            )
                        }
                        disabled={isConfirmDisabled}
                    >
                        <Check />
                    </IconButton>
                </TooltipWrapper>

                <TooltipWrapper title="Mark Done" disabled={isMarkDoneDisabled}>
                    <IconButton
                        color="info"
                        onClick={() =>
                            handleAction(
                                row.original.aptid,
                                "Mark as Done",
                                "Are you sure you want to mark this appointment as done?",
                                markAppointmentDone
                            )
                        }
                        disabled={isMarkDoneDisabled}
                    >
                        <TaskAlt />
                    </IconButton>
                </TooltipWrapper>

                <TooltipWrapper title="Cancel" disabled={isCancelDisabled}>
                    <IconButton
                        color="warning"
                        onClick={() =>
                            handleAction(
                                row.original.aptid,
                                "Cancel Appointment",
                                "Are you sure you want to cancel this appointment?",
                                cancelAppointment
                            )
                        }
                        disabled={isCancelDisabled}
                    >
                        <Close />
                    </IconButton>
                </TooltipWrapper>

                <TooltipWrapper title="Delete" disabled={isDeleteDisabled}>
                    <IconButton
                        color="error"
                        onClick={() =>
                            handleAction(
                                row.original.aptid,
                                "Delete Appointment",
                                "Are you sure you want to delete this appointment?",
                                deleteAppointment
                            )
                        }
                        disabled={isDeleteDisabled}
                    >
                        <Delete />
                    </IconButton>
                </TooltipWrapper>
            </Box>
        );
    };
};

export default RowActions;
