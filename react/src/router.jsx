import { createBrowserRouter } from "react-router-dom";
import StudentLayout from "./Layouts/StudentLayout.jsx";
import Dashboard from "./Component/Dashboard.jsx";
import SetAppointment from "./Component/SetAppointment.jsx";
import ViewAppointments from "./Component/ViewAppointments.jsx";
import GuestLayout from "./Layouts/GuestLayout.jsx";
import DetailsInfo from "./Component/Subcomponent/DetailsInfo.jsx";
import AdminLayout from "./Layouts/AdminLayout.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <DetailsInfo />,
    },
    {
        path: "/guest",
        element: <GuestLayout />,
    },
    {
        path: "/admin",
        element: <AdminLayout />,
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
