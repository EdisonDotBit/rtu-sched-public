import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedVerificationRoute = ({ children }) => {
    // Check if the necessary session data exists
    const registrationData = Cookies.get("registration_data");
    const passwordResetData = Cookies.get("password_reset_data");

    if (!passwordResetData) {
        return <Navigate to="/student/login" />;
    }

    if (!registrationData) {
        return <Navigate to="/student/login" />;
    }

    return children;
};

export default ProtectedVerificationRoute;
