import { createBrowserRouter } from "react-router-dom";
import Login from "./Component/Login.jsx";
import App from "./App.jsx";
import GuestLayout from "./GuestLayout.jsx";
import StudentLayout from "./StudentLayout.jsx";
import Dashboard from "./Component/Dashboard.jsx";
import SetAppointment from "./Component/SetAppointment.jsx";
import ViewAppointments from "./Component/ViewAppointments.jsx";
import Calendar from "./Component/Subcomponent/Calendar.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Calendar />,
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
