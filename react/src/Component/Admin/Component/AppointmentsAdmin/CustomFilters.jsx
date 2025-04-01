import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Menu,
    Typography,
    IconButton,
} from "@mui/material";
import { CalendarToday, Refresh } from "@mui/icons-material";
import TooltipWrapper from "./TooltipWrapper";
import { Check, TaskAlt, Close, Delete } from "@mui/icons-material";

const CustomFilters = ({
    table,
    filterStatus,
    timeRange,
    dateFilterAnchorEl,
    setFilterStatus,
    setTimeRange,
    setDateFilterAnchorEl,
    handleReload,
    role,
    isProcessing,
    handleBulkAction,
    bulkConfirmAppointments,
    bulkMarkAppointmentsDone,
    bulkCancelAppointments,
    bulkDeleteAppointments,
}) => {
    // Check if selected rows are valid for bulk confirm
    const isValidForBulkConfirm = (selectedRows) => {
        return selectedRows.every(
            (row) => row.original.aptstatus === "ongoing"
        );
    };

    // Check if selected rows are valid for bulk mark done
    const isValidForBulkMarkDone = (selectedRows) => {
        return selectedRows.every(
            (row) => row.original.aptstatus === "confirmed"
        );
    };

    // Check if selected rows are valid for bulk cancel
    const isValidForBulkCancel = (selectedRows) => {
        return selectedRows.every(
            (row) =>
                row.original.aptstatus !== "done" &&
                row.original.aptstatus !== "cancelled"
        );
    };

    // Check if selected rows are valid for bulk delete
    const isValidForBulkDelete = (selectedRows) => {
        return selectedRows.every(
            (row) =>
                row.original.aptstatus === "done" ||
                row.original.aptstatus === "cancelled"
        );
    };

    // Hide bulk actions for superadmin
    if (role === "superadmin") {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        gap: "1rem",
                        alignItems: "center",
                    }}
                >
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            label="Status"
                        >
                            <MenuItem value="">All Statuses</MenuItem>
                            <MenuItem value="ongoing">Ongoing</MenuItem>
                            <MenuItem value="confirmed">Confirmed</MenuItem>
                            <MenuItem value="done">Done</MenuItem>
                            <MenuItem value="cancelled">Cancelled</MenuItem>
                        </Select>
                    </FormControl>

                    <Button
                        startIcon={<CalendarToday />}
                        onClick={(e) => setDateFilterAnchorEl(e.currentTarget)}
                    >
                        {timeRange === "all"
                            ? "All Dates"
                            : timeRange.charAt(0).toUpperCase() +
                              timeRange.slice(1)}
                    </Button>

                    <Menu
                        anchorEl={dateFilterAnchorEl}
                        open={Boolean(dateFilterAnchorEl)}
                        onClose={() => setDateFilterAnchorEl(null)}
                    >
                        <MenuItem
                            onClick={() => {
                                setTimeRange("today");
                                setDateFilterAnchorEl(null);
                            }}
                        >
                            Today
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setTimeRange("week");
                                setDateFilterAnchorEl(null);
                            }}
                        >
                            This Week
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setTimeRange("month");
                                setDateFilterAnchorEl(null);
                            }}
                        >
                            This Month
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setTimeRange("all");
                                setDateFilterAnchorEl(null);
                            }}
                        >
                            All Time
                        </MenuItem>
                    </Menu>

                    <TooltipWrapper title="Refresh Data">
                        <IconButton onClick={handleReload}>
                            <Refresh />
                        </IconButton>
                    </TooltipWrapper>
                </Box>
            </Box>
        );
    }

    // Show bulk actions for non-superadmin roles
    const selectedRows = table.getSelectedRowModel().rows;
    const selectedCount = selectedRows.length;

    const isBulkConfirmDisabled =
        isProcessing ||
        selectedCount === 0 ||
        !isValidForBulkConfirm(selectedRows);
    const isBulkMarkDoneDisabled =
        isProcessing ||
        selectedCount === 0 ||
        !isValidForBulkMarkDone(selectedRows);
    const isBulkCancelDisabled =
        isProcessing ||
        selectedCount === 0 ||
        !isValidForBulkCancel(selectedRows);
    const isBulkDeleteDisabled =
        isProcessing ||
        selectedCount === 0 ||
        !isValidForBulkDelete(selectedRows);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                }}
            >
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        label="Status"
                    >
                        <MenuItem value="">All Statuses</MenuItem>
                        <MenuItem value="ongoing">Ongoing</MenuItem>
                        <MenuItem value="confirmed">Confirmed</MenuItem>
                        <MenuItem value="done">Done</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                </FormControl>

                <Button
                    startIcon={<CalendarToday />}
                    onClick={(e) => setDateFilterAnchorEl(e.currentTarget)}
                >
                    {timeRange === "all"
                        ? "All Dates"
                        : timeRange.charAt(0).toUpperCase() +
                          timeRange.slice(1)}
                </Button>

                <Menu
                    anchorEl={dateFilterAnchorEl}
                    open={Boolean(dateFilterAnchorEl)}
                    onClose={() => setDateFilterAnchorEl(null)}
                >
                    <MenuItem
                        onClick={() => {
                            setTimeRange("today");
                            setDateFilterAnchorEl(null);
                        }}
                    >
                        Today
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            setTimeRange("week");
                            setDateFilterAnchorEl(null);
                        }}
                    >
                        This Week
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            setTimeRange("month");
                            setDateFilterAnchorEl(null);
                        }}
                    >
                        This Month
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            setTimeRange("all");
                            setDateFilterAnchorEl(null);
                        }}
                    >
                        All Time
                    </MenuItem>
                </Menu>

                <TooltipWrapper title="Refresh Data">
                    <IconButton onClick={handleReload}>
                        <Refresh />
                    </IconButton>
                </TooltipWrapper>
            </Box>

            {/* Bulk Actions Row */}
            <Box
                sx={{
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "center",
                    p: "0.5rem",
                    backgroundColor: (theme) =>
                        theme.palette.mode === "dark"
                            ? theme.palette.grey[800]
                            : theme.palette.grey[100],
                    borderRadius: "4px",
                }}
            >
                <Typography variant="subtitle2" sx={{ mr: 1 }}>
                    Bulk Actions:
                </Typography>

                <TooltipWrapper
                    title={
                        selectedCount > 0
                            ? "Confirm Selected"
                            : "Select rows to enable"
                    }
                    disabled={isBulkConfirmDisabled}
                >
                    <IconButton
                        color="success"
                        disabled={isBulkConfirmDisabled}
                        onClick={() => {
                            const ids = selectedRows.map(
                                (row) => row.original.aptid
                            );
                            handleBulkAction(
                                ids,
                                "Confirm Selected Appointments",
                                `Are you sure you want to confirm ${ids.length} selected appointments?`,
                                bulkConfirmAppointments
                            );
                        }}
                    >
                        <Check />
                    </IconButton>
                </TooltipWrapper>

                <TooltipWrapper
                    title={
                        selectedCount > 0
                            ? "Mark Done Selected"
                            : "Select rows to enable"
                    }
                    disabled={isBulkMarkDoneDisabled}
                >
                    <IconButton
                        color="info"
                        disabled={isBulkMarkDoneDisabled}
                        onClick={() => {
                            const ids = selectedRows.map(
                                (row) => row.original.aptid
                            );
                            handleBulkAction(
                                ids,
                                "Mark Selected Appointments as Done",
                                `Are you sure you want to mark ${ids.length} selected appointments as done?`,
                                bulkMarkAppointmentsDone
                            );
                        }}
                    >
                        <TaskAlt />
                    </IconButton>
                </TooltipWrapper>

                <TooltipWrapper
                    title={
                        selectedCount > 0
                            ? "Cancel Selected"
                            : "Select rows to enable"
                    }
                    disabled={isBulkCancelDisabled}
                >
                    <IconButton
                        color="warning"
                        disabled={isBulkCancelDisabled}
                        onClick={() => {
                            const ids = selectedRows.map(
                                (row) => row.original.aptid
                            );
                            handleBulkAction(
                                ids,
                                "Cancel Selected Appointments",
                                `Are you sure you want to cancel ${ids.length} selected appointments?`,
                                bulkCancelAppointments
                            );
                        }}
                    >
                        <Close />
                    </IconButton>
                </TooltipWrapper>

                <TooltipWrapper
                    title={
                        selectedCount > 0
                            ? "Delete Selected"
                            : "Select rows to enable"
                    }
                    disabled={isBulkDeleteDisabled}
                >
                    <IconButton
                        color="error"
                        disabled={isBulkDeleteDisabled}
                        onClick={() => {
                            const ids = selectedRows.map(
                                (row) => row.original.aptid
                            );
                            handleBulkAction(
                                ids,
                                "Delete Selected Appointments",
                                `Are you sure you want to delete ${ids.length} selected appointments?`,
                                bulkDeleteAppointments
                            );
                        }}
                    >
                        <Delete />
                    </IconButton>
                </TooltipWrapper>

                {selectedCount > 0 && (
                    <Typography variant="body2" sx={{ ml: 1 }}>
                        ({selectedCount} selected)
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default CustomFilters;
