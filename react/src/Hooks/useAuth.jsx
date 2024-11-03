import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useLocalStorage("user", null);
    const [role, setRole] = useLocalStorage("role", null);
    const navigate = useNavigate();

    // call this function when you want to authenticate the user
    const login = async (data) => {
        setUser(data);
        setRole(data);
        if (data == "admin") {
            navigate("/ewqqwe/suppa");
        } else {
            navigate("/ewqqwe/admin");
        }
    };

    // call this function to sign out logged in user
    const logout = () => {
        setUser(null);
        setRole(null);
        navigate("/ewqqwe/login", { replace: true });
    };

    const value = useMemo(
        () => ({
            user,
            role,
            login,
            logout,
        }),
        [user]
    );
    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
