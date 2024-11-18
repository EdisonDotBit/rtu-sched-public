import { Navigate } from "react-router-dom";
import { useAuth } from "./Hooks/useAuth";

export const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) {
        // user is not authenticated
        return <Navigate to="../rtu/login" />;
    }
    return children;
};
