import { createBrowserRouter } from "react-router-dom";
import StudentLayout from "./Layouts/StudentLayout.jsx";
import Dashboard from "./Component/Dashboard.jsx";
import SetAppointment from "./Component/SetAppointment.jsx";
import ViewAppointments from "./Component/ViewAppointments.jsx";
import GuestLayout from "./Layouts/GuestLayout.jsx";
import DetailsInfo from "./Component/Subcomponent/DetailsInfo.jsx";
import AdminLayout from "./Layouts/AdminLayout.jsx";
import SupAdminLayout from "./Layouts/SupAdminLayout.jsx";
import DashboardAdmin from "./Component/Admin/DashboardAdmin.jsx";
import AccountSettingsAdmin from "./Component/Admin/AccountSettingsAdmin.jsx";
import OfficelistAdmin from "./Component/Admin/OfficelistAdmin.jsx";
import AppointmentsAdmin from "./Component/Admin/AppointmentsAdmin.jsx";
import AddOffice from "./Component/Admin/Component/AddOffice.jsx";
const router = createBrowserRouter([
    {
        path: "/",
        element: <SupAdminLayout />,
        children: [
            {
                path: "",
                element: <DashboardAdmin />,
            },
            {
                path: "dashboard",
                element: <DashboardAdmin />,
            },
            {
                path: "offices",
                element: <OfficelistAdmin />,
            },
            {
                path: "appointments",
                element: <AppointmentsAdmin />,
            },
            {
                path: "accounts",
                element: <AccountSettingsAdmin />,
            },
        ],
    },
    {
        path: "/guest",
        element: <GuestLayout />,
    },
    {
        path: "/test",
        element: <AddOffice />,
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
