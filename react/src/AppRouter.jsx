import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import StudentLayout from "./Layouts/StudentLayout.jsx";
import SetAppointment from "./Component/SetAppointment.jsx";
import ViewAppointments from "./Component/ViewAppointments.jsx";
import GuestLayout from "./Layouts/GuestLayout.jsx";
import SupAdminLayout from "./Layouts/SupAdminLayout.jsx";
import AccountSettingsAdmin from "./Component/Admin/AccountSettingsAdmin.jsx";
import OfficelistAdmin from "./Component/Admin/OfficelistAdmin.jsx";
import AppointmentsAdmin from "./Component/Admin/AppointmentsAdmin.jsx";
import LoginAdmin from "./Component/Admin/LoginAdmin.jsx";
import GuestSetAppointment from "./Component/GuestSetAppointment.jsx";
import { AuthProvider } from "./Hooks/useAuth.jsx";
import { StudentAuthProvider } from "./Hooks/useStudentAuth.jsx";
import AdminLayout from "./Layouts/AdminLayout.jsx";
import NotFound from "./Component/NotFound.jsx";
import Feedback from "./Component/Feedback.jsx";
import Feedbacks from "./Component/Admin/Feedbacks.jsx";
import ManageAcc from "./Component/Admin/ManageAcc.jsx";
import OfficeAdminManage from "./Component/Admin/OfficeAdminManage.jsx";
import Login from "./Component/Authentication/Login.jsx";
import Register from "./Component/Authentication/Register.jsx";
import Authentication from "./Component/Authentication/Authentication.jsx";
import ManageAccount from "./Component/Subcomponent/ManageAccount.jsx";
import ForgotPassword from "./Component/Authentication/ForgotPassword.jsx";
import ForgotPasswordAuthentication from "./Component/Authentication/ForgotPasswordAuthentication.jsx";
import ResetPassword from "./Component/Authentication/ResetPassword.jsx";
import Dashboard from "./Component/Admin/Dashboard.jsx";
import App from "./App.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

const AppRouter = () => (
    <>
        <AuthProvider>
            <StudentAuthProvider>
                <App>
                    <Routes>
                        {/* 404 Route */}
                        <Route path="*" element={<NotFound />} />

                        {/* Admin Login Route */}
                        <Route path="rtu/login" element={<LoginAdmin />} />

                        {/* Admin Routes */}
                        <Route
                            path="/rtu/admin"
                            element={
                                <ProtectedRoute
                                    type="default"
                                    allowedRoles={["admin"]}
                                >
                                    <AdminLayout />
                                </ProtectedRoute>
                            }
                        >
                            <Route
                                path=""
                                element={<Navigate to="/rtu/admin/dashboard" />}
                            />
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route
                                path="office"
                                element={<OfficeAdminManage />}
                            />
                            <Route path="manage" element={<ManageAcc />} />
                            <Route path="feedback" element={<Feedbacks />} />
                            <Route
                                path="appointments"
                                element={<AppointmentsAdmin />}
                            />
                        </Route>

                        {/* Super Admin Routes */}
                        <Route
                            path="/rtu/suppa"
                            element={
                                <ProtectedRoute
                                    type="default"
                                    allowedRoles={["superadmin"]}
                                >
                                    <SupAdminLayout />
                                </ProtectedRoute>
                            }
                        >
                            <Route
                                path=""
                                element={<Navigate to="/rtu/suppa/dashboard" />}
                            />
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="feedbacks" element={<Feedbacks />} />
                            <Route path="manage" element={<ManageAcc />} />
                            <Route
                                path="offices"
                                element={<OfficelistAdmin />}
                            />
                            <Route
                                path="appointments"
                                element={<AppointmentsAdmin />}
                            />
                            <Route
                                path="accounts"
                                element={<AccountSettingsAdmin />}
                            />
                        </Route>

                        {/* Guest Routes */}
                        <Route path="/guest" element={<GuestLayout />}>
                            <Route
                                path=""
                                element={
                                    <Navigate to="/guest/set-appointment" />
                                }
                            />
                            <Route
                                path="set-appointment"
                                element={<GuestSetAppointment />}
                            />
                            <Route
                                path="view-appointment"
                                element={<ViewAppointments />}
                            />
                        </Route>

                        {/* Student Routes */}
                        <Route path="/student" element={<StudentLayout />}>
                            <Route
                                path=""
                                element={
                                    <Navigate to="/student/set-appointment" />
                                }
                            />
                            <Route
                                path="set-appointment"
                                element={
                                    <ProtectedRoute type="student">
                                        <SetAppointment />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="view-appointment"
                                element={
                                    <ProtectedRoute type="student">
                                        <ViewAppointments />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="manage-account"
                                element={
                                    <ProtectedRoute type="student">
                                        <ManageAccount />
                                    </ProtectedRoute>
                                }
                            />
                        </Route>

                        {/* Authentication Routes for Students */}
                        <Route path="/student/login" element={<Login />} />
                        <Route
                            path="/student/register"
                            element={<Register />}
                        />
                        <Route
                            path="/student/authenticate"
                            element={
                                <ProtectedRoute type="register">
                                    <Authentication />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/student/forgot-password"
                            element={<ForgotPassword />}
                        />
                        <Route
                            path="/student/forgot-password-authenticate"
                            element={
                                <ProtectedRoute type="forgot">
                                    <ForgotPasswordAuthentication />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/reset-password"
                            element={<ResetPassword />}
                        />

                        {/* Root Route */}
                        <Route path="/" element={<Navigate to="/student" />} />

                        {/* Feedback Route */}
                        <Route
                            path="feedback"
                            element={
                                <ProtectedRoute type="feedback">
                                    <Feedback />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </App>
            </StudentAuthProvider>
        </AuthProvider>
    </>
);

export default AppRouter;
