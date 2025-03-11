import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const StudentAuthContext = createContext();

export const StudentAuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(Cookies.get("studentToken"));

    useEffect(() => {
        const handleCookieChange = () => setToken(Cookies.get("studentToken"));

        window.addEventListener("storage", handleCookieChange);
        return () => window.removeEventListener("storage", handleCookieChange);
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
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
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchUser();
    }, [token]);

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
                });
                setUser(response.data.user);

                // Force a reload to make sure state is refreshed
                window.location.href = "/student/set-appointment";
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
                // Handle 401 Unauthorized error gracefully
                if (error.response?.status === 401) {
                    console.log("Token is invalid or expired.");
                }
            } finally {
                Cookies.remove("studentToken");
                console.log("Token removed from cookies");
                setToken(null); // Update the token state
                setUser(null);
                console.log("User state cleared");
                // Navigate to the login page
                navigate("/student/login");
            }
        } else {
            // If no token, clear user state and navigate to login
            console.log(
                "No token found. Clearing user state and navigating to login."
            );
            setUser(null);
            navigate("/student/login");
        }
    };

    const isStudentAuthenticated = () => !!token;

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
