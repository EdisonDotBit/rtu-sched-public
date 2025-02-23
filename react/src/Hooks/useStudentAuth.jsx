import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const StudentAuthContext = createContext();

export const StudentAuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = Cookies.get("studentToken");
            if (token) {
                try {
                    const response = await axios.get(
                        `${import.meta.env.VITE_API_BASE_URL}/api/users/info`,
                        {
                            headers: { Authorization: `Bearer ${token}` },
                            withCredentials: true,
                        }
                    );
                    setUser(response.data);
                } catch (error) {
                    console.error("Failed to fetch user info", error);
                }
            }
        };

        fetchUser();
    }, []);

    const studentLogin = async (data) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/users/login`,
                data,
                { withCredentials: true }
            );
            if (response.status === 200) {
                Cookies.set("studentToken", response.data.token, {
                    expires: 7,
                });
                setUser(response.data.user);
                navigate("/student/set-appointment");
            }
        } catch (error) {
            console.error("Student login failed", error);
            throw error;
        }
    };

    const studentLogout = async () => {
        const token = Cookies.get("studentToken");
        try {
            await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/users/logout`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );
            Cookies.remove("studentToken");
            setUser(null);
            navigate("/student/login", { replace: true });
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const isStudentAuthenticated = () => {
        return !!Cookies.get("studentToken");
    };

    const value = useMemo(
        () => ({
            user,
            studentLogin,
            studentLogout,
            isStudentAuthenticated,
        }),
        []
    );

    return (
        <StudentAuthContext.Provider value={value}>
            {children}
        </StudentAuthContext.Provider>
    );
};

export const useStudentAuth = () => useContext(StudentAuthContext);
