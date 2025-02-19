import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";

const StudentAuthContext = createContext();

export const StudentAuthProvider = ({ children }) => {
    const [user, setUser] = useLocalStorage("studentUser", null);
    const navigate = useNavigate();

    const studentLogin = (data) => {
        setUser(data.user);
        navigate("/student/set-appointment");
    };

    const studentLogout = () => {
        setUser(null);
        navigate("/student/login", { replace: true });
    };

    const value = useMemo(
        () => ({
            user,
            studentLogin,
            studentLogout,
        }),
        [user]
    );

    return (
        <StudentAuthContext.Provider value={value}>
            {children}
        </StudentAuthContext.Provider>
    );
};

export const useStudentAuth = () => useContext(StudentAuthContext);
