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
import AddOffice from "./Component/Admin/Component/AddOffice.jsx";
import LoginAdmin from "./Component/Admin/LoginAdmin.jsx";
import GuestSetAppointment from "./Component/GuestSetAppointment.jsx";
import { AuthProvider } from "./Hooks/useAuth.jsx";
import { StudentAuthProvider } from "./Hooks/useStudentAuth.jsx";
import { ProtectedRoute } from "./ProtectedRoute.jsx";
import AdminLayout from "./Layouts/AdminLayout.jsx";
import NotFound from "./Component/NotFound.jsx";
import Feedback from "./Component/Feedback.jsx";
import Feedbacks from "./Component/Admin/Feedbacks.jsx";
import ManageAcc from "./Component/Admin/ManageAcc.jsx";
import OfficeAdminManage from "./Component/Admin/OfficeAdminManage.jsx";
import Login from "./Component/Authentication/Login.jsx";
import Register from "./Component/Authentication/Register.jsx";
import ProtectedStudentRoute from "./ProtectedStudentRoute.jsx";
import Authentication from "./Component/Authentication/Authentication.jsx";
import ManageAccount from "./Component/Subcomponent/ManageAccount.jsx";
import ForgotPassword from "./Component/Authentication/ForgotPassword.jsx";
import ForgotPasswordAuthentication from "./Component/Authentication/ForgotPasswordAuthentication.jsx";
import ResetPassword from "./Component/Authentication/ResetPassword.jsx";
import ProtectedRegisterRoute from "./ProtectedRegisterRoute.jsx";
import ProtectedForgotRoute from "./ProtectedForgotRoute.jsx";
import Dashboard from "./Component/Admin/Dashboard.jsx";

const AppRouter = () => (
    <>
        <AuthProvider>
            <StudentAuthProvider>
                <Routes>
                    <Route path="*" element={<NotFound />} />
                    <Route path="rtu/login" element={<LoginAdmin />} />

                    {/* Admin Routes */}
                    <Route
                        path="/rtu/admin"
                        element={
                            <ProtectedRoute>
                                <AdminLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route
                            path=""
                            element={<Navigate to="/rtu/admin/dashboard" />}
                        />

                        <Route
                            path="dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="office"
                            element={
                                <ProtectedRoute>
                                    <OfficeAdminManage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="manage"
                            element={
                                <ProtectedRoute>
                                    <ManageAcc />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="feedback"
                            element={
                                <ProtectedRoute>
                                    <Feedbacks />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="appointments"
                            element={
                                <ProtectedRoute>
                                    <AppointmentsAdmin />
                                </ProtectedRoute>
                            }
                        />
                    </Route>

                    {/* Super Admin Routes */}
                    <Route
                        path="/rtu/suppa"
                        element={
                            <ProtectedRoute>
                                <SupAdminLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route
                            path=""
                            element={<Navigate to="/rtu/suppa/dashboard" />}
                        />

                        <Route
                            path="dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="feedbacks"
                            element={
                                <ProtectedRoute>
                                    <Feedbacks />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="manage"
                            element={
                                <ProtectedRoute>
                                    <ManageAcc />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="offices"
                            element={
                                <ProtectedRoute>
                                    <OfficelistAdmin />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="appointments"
                            element={
                                <ProtectedRoute>
                                    <AppointmentsAdmin />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="accounts"
                            element={
                                <ProtectedRoute>
                                    <AccountSettingsAdmin />
                                </ProtectedRoute>
                            }
                        />
                    </Route>

                    {/* Guest Routes */}
                    <Route path="/guest" element={<GuestLayout />}>
                        <Route
                            path=""
                            element={<Navigate to="/guest/set-appointment" />}
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
                            element={<Navigate to="/student/set-appointment" />}
                        />
                        <Route
                            path="set-appointment"
                            element={
                                <ProtectedStudentRoute>
                                    <SetAppointment />
                                </ProtectedStudentRoute>
                            }
                        />
                        <Route
                            path="view-appointment"
                            element={
                                <ProtectedStudentRoute>
                                    <ViewAppointments />
                                </ProtectedStudentRoute>
                            }
                        />

                        <Route
                            path="manage-account"
                            element={
                                <ProtectedStudentRoute>
                                    <ManageAccount />
                                </ProtectedStudentRoute>
                            }
                        />
                    </Route>

                    {/* Authentication Routes for Students */}
                    <Route path="/student/login" element={<Login />} />
                    <Route path="/student/register" element={<Register />} />
                    <Route
                        path="/student/authenticate"
                        element={
                            <ProtectedRegisterRoute>
                                <Authentication />
                            </ProtectedRegisterRoute>
                        }
                    />
                    <Route
                        path="/student/forgot-password"
                        element={<ForgotPassword />}
                    />
                    <Route
                        path="/student/forgot-password-authenticate"
                        element={
                            <ProtectedForgotRoute>
                                <ForgotPasswordAuthentication />
                            </ProtectedForgotRoute>
                        }
                    />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/" element={<Navigate to="/student" />} />

                    <Route path="feedback" element={<Feedback />} />
                </Routes>
            </StudentAuthProvider>
        </AuthProvider>
    </>
);

export default AppRouter;
