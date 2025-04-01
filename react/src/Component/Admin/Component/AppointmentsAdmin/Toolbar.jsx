import { Box, Typography, TextField, Button } from "@mui/material";
import { FileDownload } from "@mui/icons-material";
import { InputAdornment } from "@mui/material";
import { FaSearch } from "react-icons/fa";

const Toolbar = ({ table, handleExportRows, renderCustomFilters, role }) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                p: "1rem",
            }}
        >
            {/* Top row with title and search bar */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "1rem",
                }}
            >
                <Typography variant="h5" component="h1" fontWeight="bold">
                    Appointment Table
                </Typography>

                {/* Search bar - using the table's global filter */}
                <TextField
                    placeholder="Search appointments..."
                    value={table.getState().globalFilter ?? ""}
                    onChange={(e) => table.setGlobalFilter(e.target.value)}
                    variant="outlined"
                    size="small"
                    sx={{ minWidth: 300 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <FaSearch />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            {/* Middle row with export buttons */}
            <Box
                sx={{
                    display: "flex",
                    gap: "0.5rem",
                    flexWrap: "wrap",
                }}
            >
                <Button
                    disabled={
                        table.getPrePaginationRowModel().rows.length === 0
                    }
                    onClick={() =>
                        handleExportRows(table.getPrePaginationRowModel().rows)
                    }
                    startIcon={<FileDownload />}
                    variant="outlined"
                    size="small"
                >
                    Export All as PDF
                </Button>
                <Button
                    disabled={table.getRowModel().rows.length === 0}
                    onClick={() => handleExportRows(table.getRowModel().rows)}
                    startIcon={<FileDownload />}
                    variant="outlined"
                    size="small"
                >
                    Export Page as PDF
                </Button>
                {role !== "superadmin" && (
                    <Button
                        disabled={
                            !table.getIsSomeRowsSelected() &&
                            !table.getIsAllRowsSelected()
                        }
                        onClick={() =>
                            handleExportRows(table.getSelectedRowModel().rows)
                        }
                        startIcon={<FileDownload />}
                        variant="outlined"
                        size="small"
                    >
                        Export Selected as PDF
                    </Button>
                )}
            </Box>

            {/* Bottom row with filters */}
            {renderCustomFilters()}
        </Box>
    );
};

export default Toolbar;
