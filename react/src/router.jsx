import { createBrowserRouter } from "react-router-dom";
import GuestLayout from "./GuestLayout.jsx";
import StudentLayout from "./StudentLayout.jsx";
import Dashboard from "./Component/Dashboard.jsx";
import SetAppointment from "./Component/SetAppointment.jsx";
import ViewAppointments from "./Component/ViewAppointments.jsx";
<<<<<<<<< Temporary merge branch 1
import Confirmation from "./Component/Subcomponent/Confirmation.jsx";
=========
import SelectBranch from "./Component/SelectBranch.jsx";
import SelectOffice from "./Component/SelectOffice.jsx";
>>>>>>>>> Temporary merge branch 2

const router = createBrowserRouter([
    {
        path: "/",
<<<<<<<<< Temporary merge branch 1
        element: <Confirmation />,
=========
        element: <SelectOffice />,
>>>>>>>>> Temporary merge branch 2
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
