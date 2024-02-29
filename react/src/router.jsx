import { createBrowserRouter } from "react-router-dom";
import StudentLayout from "./Layouts/StudentLayout.jsx";
import Dashboard from "./Component/Dashboard.jsx";
import SetAppointment from "./Component/SetAppointment.jsx";
import ViewAppointments from "./Component/ViewAppointments.jsx";
import GuestLayout from "./Layouts/GuestLayout.jsx";
import Confirmation from "./Component/Subcomponent/Confirmation.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Confirmation />,
    },
    {
        path: "/guest",
        element: <GuestLayout />,
    },
    {
        path: "/student",
        element: <StudentLayout />,
        children: [
            {
                path: "",
                element: <Dashboard />,
            },
            {
                path: "dashboard",
                element: <Dashboard />,
            },
            {
                path: "set-appointment",
                element: <SetAppointment />,
            },
            {
                path: "view-appointment",
                element: <ViewAppointments />,
            },
        ],
    },
]);

export default router;
