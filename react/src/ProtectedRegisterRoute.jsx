import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRegisterRoute = ({ children }) => {
    // Ensure user has registered before accessing authentication
    const registrationData = Cookies.get("registration_data");

    if (!registrationData) {
        return <Navigate to="/student/register" />; // Redirect to register if not registered
    }

    return children;
};

export default ProtectedRegisterRoute;
