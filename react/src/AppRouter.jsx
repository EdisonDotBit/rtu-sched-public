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

const AppRouter = () => (
    <>
        <AuthProvider>
            <StudentAuthProvider>
                <Routes>
                    <Route path="feedback" element={<Feedback />} />

                    {/* Admin Routes */}
                    <Route path="/rtu/admin" element={<AdminLayout />}>
                        <Route
                            path=""
                            element={
                                <ProtectedRoute>
                                    <Feedbacks />
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

                    <Route path="*" element={<NotFound />} />
                    <Route path="rtu/login" element={<LoginAdmin />} />

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
                            element={
                                <ProtectedRoute>
                                    <Feedbacks />
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

                    <Route path="/test" element={<AddOffice />} />

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
                        element={<Authentication />}
                    />
                    <Route path="/" element={<Navigate to="/student" />} />
                </Routes>
            </StudentAuthProvider>
        </AuthProvider>
    </>
);

export default AppRouter;
