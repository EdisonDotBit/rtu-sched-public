// src/hooks/useAuth.jsx
import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useLocalStorage("user", null);
    const [role, setRole] = useLocalStorage("role", null);
    const [branch, setBranch] = useLocalStorage("branch", null);
    const navigate = useNavigate();

    const login = async (data) => {
        setUser(data.user);
        setRole(data.role);
        setBranch(data.branch); // Ensure branch is set correctly
        if (data.role === "superadmin") {
            navigate("/rtu/suppa");
        } else {
            navigate("/rtu/admin");
        }
    };

    const logout = () => {
        setUser(null);
        setRole(null);
        setBranch(null);
        localStorage.removeItem("admuser");
        localStorage.removeItem("admrole");
        localStorage.removeItem("admbranch");
        navigate("/rtu/login", { replace: true });
    };

    const value = useMemo(
        () => ({
            user,
            role,
            branch,
            login,
            logout,
        }),
        [user, role, branch]
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
