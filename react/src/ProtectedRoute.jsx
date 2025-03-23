import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { useAuth } from "./Hooks/useAuth";
import { useStudentAuth } from "./Hooks/useStudentAuth";

const ProtectedForgotRoute = ({ children }) => {
    const location = useLocation();
    const email = location.state?.email; // Get email from navigation state

    return email ? (
        children
    ) : (
        <Navigate to="/student/forgot-password" replace />
    );
};

const ProtectedRegisterRoute = ({ children }) => {
    const registrationData = Cookies.get("registration_data");

    return registrationData ? children : <Navigate to="/student/register" />;
};

const ProtectedAdminRoute = ({ children, allowSuperadmin = false }) => {
    const { user, role } = useAuth();

    if (!user) return <Navigate to="/rtu/login" />;
    if (allowSuperadmin && role !== "superadmin")
        return <Navigate to="/rtu/unauthorized" />;
    if (!allowSuperadmin && role === "superadmin")
        return <Navigate to="/rtu/unauthorized" />;

    return children;
};

const ProtectedStudentRoute = ({ children }) => {
    const { isStudentAuthenticated } = useStudentAuth();

    return isStudentAuthenticated() ? (
        children
    ) : (
        <Navigate to="/student/login" />
    );
};

const ProtectedVerificationRoute = ({ children }) => {
    const registrationData = Cookies.get("registration_data");
    const passwordResetData = Cookies.get("password_reset_data");

    return registrationData && passwordResetData ? (
        children
    ) : (
        <Navigate to="/student/login" />
    );
};

export {
    ProtectedForgotRoute,
    ProtectedRegisterRoute,
    ProtectedAdminRoute,
    ProtectedStudentRoute,
    ProtectedVerificationRoute,
};
