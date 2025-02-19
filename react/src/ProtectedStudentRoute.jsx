import { Navigate } from "react-router-dom";
import { useStudentAuth } from "./Hooks/useStudentAuth";

const ProtectedStudentRoute = ({ children }) => {
    const { user } = useStudentAuth();

    // Check if the studentUser object is present and has a role of "Student"
    if (!user || user.role !== "Student") {
        return <Navigate to="/student/login" />;
    }

    return children;
};

export default ProtectedStudentRoute;
