import { Navigate, useLocation } from "react-router-dom";

const ProtectedForgotRoute = ({ children }) => {
    const location = useLocation();
    const email = location.state?.email; // Get email from navigation state

    if (!email) {
        return <Navigate to="/student/forgot-password" replace />;
    }

    return children;
};

export default ProtectedForgotRoute;
