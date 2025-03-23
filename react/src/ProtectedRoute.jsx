import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { useAuth } from "./Hooks/useAuth";
import { useStudentAuth } from "./Hooks/useStudentAuth";

const ProtectedRoute = ({
    children,
    type = "default",
    allowedRoles = [],
    redirectPath = "/student", // Default redirect path
}) => {
    const location = useLocation();
    const { user } = useAuth(); // Get user data from useAuth
    const { isStudentAuthenticated } = useStudentAuth(); // Get student auth status

    // Handle forgot password protection
    if (type === "forgot") {
        const email = location.state?.email; // Get email from navigation state
        if (!email) {
            return <Navigate to="/student/forgot-password" replace />;
        }
    }

    // Handle registration protection
    if (type === "register") {
        const registrationData = Cookies.get("registration_data");
        if (!registrationData) {
            return <Navigate to="/student/register" replace />;
        }
    }

    // Handle default authentication protection
    if (type === "default") {
        if (!user) {
            return <Navigate to={redirectPath} replace />;
        }

        // Check if the user has the required role
        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    // Handle student authentication protection
    if (type === "student") {
        if (!isStudentAuthenticated()) {
            return <Navigate to="/student/login" replace />;
        }
    }

    // Handle verification protection
    if (type === "verification") {
        const registrationData = Cookies.get("registration_data");
        const passwordResetData = Cookies.get("password_reset_data");

        if (!passwordResetData && !registrationData) {
            return <Navigate to="/student/login" replace />;
        }
    }

    if (type === "feedback") {
        const token = new URLSearchParams(location.search).get("token");
        if (!token) {
            return <Navigate to="/invalid-feedback-link" replace />;
        }
    }

    // If all checks pass, render the children
    return children;
};

export default ProtectedRoute;
