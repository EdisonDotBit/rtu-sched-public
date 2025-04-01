// src/Component/AppointmentsAdmin/SummaryCards.jsx
import { useMemo } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

const SummaryCards = ({ searchResults }) => {
    const counts = useMemo(() => {
        return {
            total: searchResults.length,
            ongoing: searchResults.filter((a) => a.aptstatus === "ongoing")
                .length,
            confirmed: searchResults.filter((a) => a.aptstatus === "confirmed")
                .length,
            done: searchResults.filter((a) => a.aptstatus === "done").length,
            cancelled: searchResults.filter((a) => a.aptstatus === "cancelled")
                .length,
        };
    }, [searchResults]);

    return (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 4 }}>
            <Card sx={{ minWidth: 175, flexGrow: 1 }}>
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        Total Appointments
                    </Typography>
                    <Typography variant="h5" component="div">
                        {counts.total}
                    </Typography>
                </CardContent>
            </Card>
            <Card sx={{ minWidth: 175, flexGrow: 1 }}>
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        Ongoing
                    </Typography>
                    <Typography
                        variant="h5"
                        component="div"
                        color="warning.main"
                    >
                        {counts.ongoing}
                    </Typography>
                </CardContent>
            </Card>
            <Card sx={{ minWidth: 175, flexGrow: 1 }}>
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        Confirmed
                    </Typography>
                    <Typography variant="h5" component="div" color="info.main">
                        {counts.confirmed}
                    </Typography>
                </CardContent>
            </Card>
            <Card sx={{ minWidth: 175, flexGrow: 1 }}>
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        Completed
                    </Typography>
                    <Typography
                        variant="h5"
                        component="div"
                        color="success.main"
                    >
                        {counts.done}
                    </Typography>
                </CardContent>
            </Card>
            <Card sx={{ minWidth: 175, flexGrow: 1 }}>
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        Cancelled
                    </Typography>
                    <Typography variant="h5" component="div" color="error.main">
                        {counts.cancelled}
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default SummaryCards;
