import { Navigate } from "react-router-dom";
import { useStudentAuth } from "./Hooks/useStudentAuth";

const ProtectedStudentRoute = ({ children }) => {
    const { isStudentAuthenticated } = useStudentAuth();

    // Check if the student is authenticated
    if (!isStudentAuthenticated()) {
        return <Navigate to="/student/login" />;
    }

    return children;
};

export default ProtectedStudentRoute;
