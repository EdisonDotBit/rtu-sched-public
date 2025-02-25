import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const StudentAuthContext = createContext();

export const StudentAuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Added loading state
    const token = useMemo(
        () => Cookies.get("studentToken"),
        [Cookies.get("studentToken")]
    );

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
            setLoading(true); // Start loading before login
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/users/login`,
                data,
                { withCredentials: true }
            );
            console.log("Login response:", response.data);
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
        } finally {
            setLoading(false); // Stop loading after login attempt
        }
    };

    const studentLogout = async () => {
        console.log("Logging out, token:", token);
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
