import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import StudentLayout from "./Layouts/StudentLayout.jsx";
import Dashboard from "./Component/Dashboard.jsx";
import SetAppointment from "./Component/SetAppointment.jsx";
import ViewAppointments from "./Component/ViewAppointments.jsx";
import GuestLayout from "./Layouts/GuestLayout.jsx";
import SupAdminLayout from "./Layouts/SupAdminLayout.jsx";
import DashboardAdmin from "./Component/Admin/DashboardAdmin.jsx";
import AccountSettingsAdmin from "./Component/Admin/AccountSettingsAdmin.jsx";
import OfficelistAdmin from "./Component/Admin/OfficelistAdmin.jsx";
import AppointmentsAdmin from "./Component/Admin/AppointmentsAdmin.jsx";
import AddOffice from "./Component/Admin/Component/AddOffice.jsx";
import LoginAdmin from "./Component/Admin/LoginAdmin.jsx";
import Login from "./Component/Login.jsx";

const AppRouter = () => (
    <>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/ewqqwe/suppa" element={<SupAdminLayout />}>
                <Route path="" element={<DashboardAdmin />} />
                <Route path="login" element={<LoginAdmin />} />
                <Route path="dashboard" element={<DashboardAdmin />} />
                <Route path="offices" element={<OfficelistAdmin />} />
                <Route path="appointments" element={<AppointmentsAdmin />} />
                <Route path="accounts" element={<AccountSettingsAdmin />} />
            </Route>
            <Route path="/guest" element={<GuestLayout />} />
            <Route path="/test" element={<AddOffice />} />
            <Route path="/student" element={<StudentLayout />}>
                <Route path="" element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="set-appointment" element={<SetAppointment />} />
                <Route path="view-appointment" element={<ViewAppointments />} />
            </Route>
        </Routes>
    </>
);

export default AppRouter;
