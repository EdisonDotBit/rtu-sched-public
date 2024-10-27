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
import { ProtectedRoute } from "./ProtectedRoute.jsx";
import AdminLayout from "./Layouts/AdminLayout.jsx";
import NotFound from "./Component/NotFound.jsx";
import Feedback from "./Component/Feedback.jsx";
import Feedbacks from "./Component/Admin/Feedbacks.jsx";
import ManageAcc from "./Component/Admin/ManageAcc.jsx";

const AppRouter = () => (
    <>
        <AuthProvider>
            <Routes>
                <Route path="feedback" element={<Feedback />} />
                <Route path="/ewqqwe/admin" element={<AdminLayout />}>
                    <Route
                        path=""
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
                <Route path="ewqqwe/login" element={<LoginAdmin />} />
                <Route path="/" element={<Navigate to="/student" />} />
                <Route
                    path="/ewqqwe/suppa"
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

                <Route path="/student" element={<StudentLayout />}>
                    <Route
                        path=""
                        element={<Navigate to="/student/set-appointment" />}
                    />
                    <Route
                        path="set-appointment"
                        element={<SetAppointment />}
                    />
                    <Route
                        path="view-appointment"
                        element={<ViewAppointments />}
                    />
                </Route>
            </Routes>
        </AuthProvider>
    </>
);

export default AppRouter;
