import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const StudentAuthContext = createContext();

export const StudentAuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Added loading state
    const [token, setToken] = useState(Cookies.get("studentToken"));

    useEffect(() => {
        const handleCookieChange = () => setToken(Cookies.get("studentToken"));

        window.addEventListener("storage", handleCookieChange);
        return () => window.removeEventListener("storage", handleCookieChange);
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            console.log("Fetching user token:", token);
            if (token) {
                try {
                    setLoading(true); // Set loading before fetching
                    const response = await axios.get(
                        `${import.meta.env.VITE_API_BASE_URL}/api/users/info`,
                        {
                            headers: { Authorization: `Bearer ${token}` },
                            withCredentials: true,
                        }
                    );
                    console.log("Fetched user data:", response.data);
                    setUser(response.data);
                } catch (error) {
                    console.error("Failed to fetch user info", error);
                    setUser(null); // Ensure user is null if fetching fails
                } finally {
                    setLoading(false); // Stop loading when fetch is done
                }
            } else {
                setLoading(false); // No token, stop loading
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

            console.log("Login response:", response.data);

            if (response.status === 200 && response.data.token) {
                Cookies.set("studentToken", response.data.token, {
                    expires: 7,
                });
                setUser(response.data.user); // Ensure user state updates

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
        try {
            await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/users/logout`,
                {},
                {
                    withCredentials: true,
                }
            );
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            Cookies.remove("studentToken");
            setUser(null);
            window.location.href = "/student/login"; // Ensure fresh redirect
        }
    };

    const isStudentAuthenticated = () => !!token;

    const value = useMemo(
        () => ({
            user,
            studentLogin,
            studentLogout,
            isStudentAuthenticated,
            loading, // Include loading state in context
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
