import { useEffect, useMemo } from "react";
import {
    MaterialReactTable,
    useMaterialReactTable,
} from "material-react-table";
import CustomFilters from "./CustomFilters";
import Toolbar from "./Toolbar";
import RowActions from "./RowActions";
import StatusBadge from "./StatusBadge";
import { Button } from "@mui/material";

const AppointmentsTable = ({
    searchResults,
    aptData,
    filterStatus,
    timeRange,
    dateFilterAnchorEl,
    setFilterStatus,
    setTimeRange,
    setDateFilterAnchorEl,
    handleReload,
    role,
    isProcessing,
    handleAction,
    handleBulkAction,
    confirmAppointment,
    markAppointmentDone,
    cancelAppointment,
    deleteAppointment,
    bulkConfirmAppointments,
    bulkMarkAppointmentsDone,
    bulkCancelAppointments,
    bulkDeleteAppointments,
    openAttachmentModal,
    openOtherPurposeModal,
    setSearchResults,
    handleExportRows,
}) => {
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

    // Define columns
    const columns = useMemo(
        () => [
            {
                accessorKey: "aptid",
                header: "Appt #",
                size: 80,
            },
            {
                accessorKey: "apttype",
                header: "Type",
                size: 100,
                Cell: ({ cell }) => (
                    <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                        {cell.getValue()}
                    </span>
                ),
            },
            {
                accessorKey: "aptname",
                header: "Full Name",
                size: 150,
            },
            {
                accessorKey: "aptbranch",
                header: "Branch",
                size: 120,
            },
            {
                accessorKey: "aptoffice",
                header: "Office",
                size: 150,
            },
            {
                accessorKey: "aptdate",
                header: "Date",
                size: 120,
                Cell: ({ cell }) => formatDate(cell.getValue()),
                filterVariant: "date-range",
            },
            {
                accessorKey: "created_at",
                header: "Created",
                size: 120,
                Cell: ({ cell }) => formatDate(cell.getValue()),
            },
            {
                accessorKey: "apttime",
                header: "Time",
                size: 100,
            },
            {
                accessorKey: "aptpurpose",
                header: "Purpose",
                size: 150,
            },
            {
                accessorKey: "aptother",
                header: "Other Purpose",
                size: 150,
                Cell: ({ cell }) =>
                    cell.getValue() ? (
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() =>
                                openOtherPurposeModal(cell.getValue())
                            }
                        >
                            View
                        </Button>
                    ) : (
                        <span className="text-gray-400 text-xs">N/A</span>
                    ),
            },
            {
                accessorKey: "aptstudnum",
                header: "ID Number",
                size: 120,
            },
            {
                accessorKey: "aptstatus",
                header: "Status",
                size: 120,
                filterVariant: "select",
                filterSelectOptions: [
                    "ongoing",
                    "confirmed",
                    "done",
                    "cancelled",
                ],
                Cell: ({ cell }) => <StatusBadge status={cell.getValue()} />,
            },
            {
                accessorKey: "aptemail",
                header: "Email",
                size: 200,
            },
            {
                accessorKey: "aptattach",
                header: "Attachments",
                size: 150,
                Cell: ({ cell }) =>
                    cell.getValue() ? (
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => openAttachmentModal(cell.getValue())}
                        >
                            View
                        </Button>
                    ) : (
                        <span className="text-gray-400 text-xs">N/A</span>
                    ),
            },
        ],
        [openAttachmentModal, openOtherPurposeModal]
    );

    // Apply filters
    useEffect(() => {
        let filteredResults = [...aptData];

        // Apply status filter
        if (filterStatus) {
            filteredResults = filteredResults.filter((apt) =>
                apt.aptstatus
                    ?.toLowerCase()
                    .includes(filterStatus.toLowerCase())
            );
        }

        // Apply time range filter
        if (timeRange !== "all") {
            const now = new Date();
            const today = new Date(now);
            today.setHours(0, 0, 0, 0);

            filteredResults = filteredResults.filter((apt) => {
                try {
                    const aptDate = new Date(apt.aptdate);
                    aptDate.setHours(0, 0, 0, 0);

                    switch (timeRange) {
                        case "today":
                            return aptDate.getTime() === today.getTime();
                        case "week":
                            const startOfWeek = new Date(today);
                            startOfWeek.setDate(
                                today.getDate() - today.getDay()
                            );
                            const endOfWeek = new Date(startOfWeek);
                            endOfWeek.setDate(startOfWeek.getDate() + 6);
                            return (
                                aptDate >= startOfWeek && aptDate <= endOfWeek
                            );
                        case "month":
                            const startOfMonth = new Date(
                                today.getFullYear(),
                                today.getMonth(),
                                1
                            );
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

        // Sort by appointment date
        filteredResults.sort((a, b) => {
            try {
                const dateA = new Date(a.created_at);
                const dateB = new Date(b.created_at);
                return dateB - dateA;
            } catch {
                return 0;
            }
        });

        setSearchResults(filteredResults);
    }, [aptData, filterStatus, timeRange, setSearchResults]);

    // Table instance
    const table = useMaterialReactTable({
        columns,
        data: searchResults,
        initialState: {
            density: "compact",
            sorting: [{ id: "created_at", desc: true }],
            showGlobalFilter: true,
        },
        // Enable features
        enableRowActions: role !== "superadmin",
        enableRowSelection: role !== "superadmin",
        positionActionsColumn: "last",
        enableColumnOrdering: true,
        enableColumnFilters: true,
        enablePagination: true,
        enableSorting: true,
        enableDensityToggle: true,
        enableFullScreenToggle: true,
        enableHiding: true,
        enableTopToolbar: true,
        enableGlobalFilter: true,

        // Search configuration
        muiSearchTextFieldProps: {
            placeholder: "Search appointments...",
            sx: {
                minWidth: "300px",
                backgroundColor: "white",
            },
            variant: "outlined",
            size: "small",
        },

        // Styling
        muiTablePaperProps: {
            elevation: 0,
            sx: {
                borderRadius: "0.5rem",
                border: "1px solid #e0e0e0",
            },
        },
        muiTableHeadCellProps: {
            sx: {
                fontWeight: "bold",
                fontSize: "0.875rem",
            },
        },
        muiTableBodyCellProps: {
            sx: {
                fontSize: "0.875rem",
            },
        },

        // Pagination display options
        muiPaginationProps: {
            shape: "rounded",
            variant: "outlined",
            showFirstButton: true,
            showLastButton: true,
        },
        paginationDisplayMode: "pages",

        // Toolbar configuration
        renderTopToolbar: ({ table }) => (
            <Toolbar
                table={table}
                handleExportRows={handleExportRows}
                renderCustomFilters={() => (
                    <CustomFilters
                        table={table}
                        filterStatus={filterStatus}
                        timeRange={timeRange}
                        dateFilterAnchorEl={dateFilterAnchorEl}
                        setFilterStatus={setFilterStatus}
                        setTimeRange={setTimeRange}
                        setDateFilterAnchorEl={setDateFilterAnchorEl}
                        handleReload={handleReload}
                        role={role}
                        isProcessing={isProcessing}
                        handleBulkAction={handleBulkAction}
                        bulkConfirmAppointments={bulkConfirmAppointments}
                        bulkMarkAppointmentsDone={bulkMarkAppointmentsDone}
                        bulkCancelAppointments={bulkCancelAppointments}
                        bulkDeleteAppointments={bulkDeleteAppointments}
                    />
                )}
                role={role}
            />
        ),

        // Row actions
        renderRowActions: RowActions({
            role,
            isProcessing,
            handleAction,
            confirmAppointment,
            markAppointmentDone,
            cancelAppointment,
            deleteAppointment,
        }),
    });

    return <MaterialReactTable table={table} />;
};

export default AppointmentsTable;
