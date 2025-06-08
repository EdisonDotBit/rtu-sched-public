import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StudentAuthContext = createContext();

export const StudentAuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(Cookies.get("studentToken"));

    // Handle token changes (e.g., when cookies are updated)
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
                    toast.error("Session expired. Please log in again."); // Show error toast
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchUser();
    }, [token]);

    // Student login function
    const studentLogin = async (data) => {
        try {
            setLoading(true);
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/users/login`,
                data,
                { withCredentials: true }
            );

            if (response.status === 200 && response.data.token) {
                // Set the token in cookies
                Cookies.set("studentToken", response.data.token, {
                    expires: 7, // Token expires in 7 days
                });

                // Update the token state immediately
                setToken(response.data.token);

                // Update the user state
                setUser(response.data.user);

                // Show success toast
                toast.success("Login successful!");

                // Redirect to the set-appointment page
                navigate("/student/set-appointment");
            } else {
                throw new Error("Login successful but no token received.");
            }
        } catch (error) {
            console.error("Student login failed:", error);
            toast.error(
                error.response?.data?.message ||
                    "Login failed. Please try again."
            ); // Show error toast
        } finally {
            setLoading(false);
        }
    };

    // Student logout function
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
                toast.success("Logged out successfully!"); // Show success toast
                navigate("/student/login");
            }
        } else {
            setUser(null);
            navigate("/student/login");
        }
    };

    // Check if the student is authenticated
    const isStudentAuthenticated = () => !!token;

    // Memoized context value
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


// The authentication for admin side is hidden and kept in the private repository to avoid sensitive vulnerability.

export const useStudentAuth = () => useContext(StudentAuthContext);
