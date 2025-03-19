import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const StudentAuthContext = createContext();

export const StudentAuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(Cookies.get("studentToken") || null);

    // Update token state when cookie changes
    useEffect(() => {
        const handleCookieChange = () => {
            const newToken = Cookies.get("studentToken");
            if (newToken !== token) {
                setToken(newToken);
            }
        };

        window.addEventListener("storage", handleCookieChange);
        return () => window.removeEventListener("storage", handleCookieChange);
    }, [token]);

    // Fetch user info when token changes
    useEffect(() => {
        const fetchUser = async () => {
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
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
                setUser(null);
                Cookies.remove("studentToken"); // Remove expired/invalid token
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [token]);

    // Student Login
    const studentLogin = async (data) => {
        try {
            setLoading(true);
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/users/login`,
                data,
                { withCredentials: true }
            );

            if (response.status === 200 && response.data.token) {
                Cookies.set("studentToken", response.data.token, {
                    expires: 7,
                    secure: true,
                    sameSite: "Strict",
                });
                setToken(response.data.token);
                setUser(response.data.user);
                navigate("/student/set-appointment");
            } else {
                throw new Error("Login successful but no token received.");
            }
        } catch (error) {
            console.error("Student login failed:", error);
            alert(
                "Login failed: " +
                    (error.response?.data?.message || error.message)
            );
        } finally {
            setLoading(false);
        }
    };

    // Student Logout
    const studentLogout = async () => {
        if (token) {
            try {
                await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/api/users/logout`,
                    {},
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        withCredentials: true,
                    }
                );
            } catch (error) {
                console.error("Logout failed", error);
                if (error.response?.status === 401) {
                    console.log("Token is invalid or expired.");
                }
            } finally {
                Cookies.remove("studentToken");
                setToken(null);
                setUser(null);
                navigate("/student/login");
            }
        } else {
            setUser(null);
            navigate("/student/login");
        }
    };

    // Check if student is authenticated
    const isStudentAuthenticated = () => !!token;

    // Memoized value for performance optimization
    const value = useMemo(
        () => ({
            user,
            studentLogin,
            studentLogout,
            isStudentAuthenticated,
            loading,
        }),
        [user, token, loading]
    );

    return (
        <StudentAuthContext.Provider value={value}>
            {children}
        </StudentAuthContext.Provider>
    );
};

export const useStudentAuth = () => useContext(StudentAuthContext);
