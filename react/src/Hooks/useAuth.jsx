import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useLocalStorage("user", null); // Key for user
    const [role, setRole] = useLocalStorage("role", null); // Key for role
    const navigate = useNavigate();

    // Call this function when you want to authenticate the user
    const login = async (data) => {
        setUser(data.user); // This sets 'user' in local storage
        setRole(data.role); // This sets 'role' in local storage
        if (data.user === "admin") {
            navigate("/rtu/suppa");
        } else {
            navigate("/rtu/admin");
        }
    };

    // Call this function to sign out the logged-in user
    const logout = () => {
        setUser(null); // Clear user from state and local storage
        setRole(null); // Clear role from state and local storage

        // Remove the newly created keys from local storage (this is optional)
        localStorage.removeItem("admuser");
        localStorage.removeItem("admrole");

        navigate("/rtu/login", { replace: true });
    };

    const value = useMemo(
        () => ({
            user,
            role,
            login,
            logout,
        }),
        [user, role]
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
