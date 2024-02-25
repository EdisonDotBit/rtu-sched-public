import { createBrowserRouter } from "react-router-dom";
import GuestLayout from "./GuestLayout.jsx";
import StudentLayout from "./StudentLayout.jsx";
import Dashboard from "./Component/Dashboard.jsx";
import SetAppointment from "./Component/SetAppointment.jsx";
import ViewAppointments from "./Component/ViewAppointments.jsx";
import SelectBranch from "./Component/SelectBranch.jsx";
import SelectOffice from "./Component/SelectOffice.jsx";
import InputDetails from "./Component/InputDetails.jsx";
import Confirmation from "./Component/Subcomponent/Confirmation.jsx";
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
                children: [
                    {
                        path: "confirmation",
                        element: <SelectBranch />,
                    },
                    {
                        path: "branch",
                        element: <SelectBranch />,
                    },
                    {
                        path: "office",
                        element: <SelectOffice />,
                    },
                    {
                        path: "input-details",
                        element: <InputDetails />,
                    },
                    {
                        path: "confirmation",
                        element: <Confirmation />,
                    },
                ],
            },
            {
                path: "view-appointment",
                element: <ViewAppointments />,
            },
        ],
    },
]);

export default router;
