import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../Subcomponent/Asset/rtu_logo_v3.png";

function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    const handleRequestPin = async (e) => {
        e.preventDefault();
        setMessage("");
        setErrorMessage("");
        setLoading(true);

        try {
            const response = await axios.post(
                `${apiBaseUrl}/api/users/request-password-reset`,
                { email },
                { withCredentials: true }
            );
            if (response.data.success) {
                setMessage(response.data.message);
                navigate("/student/forgot-password-authenticate", {
                    state: {
                        email,
                    },
                });
            }
        } catch (error) {
            setErrorMessage("Failed to send verification email.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 py-8 font-roboto">
            <div className="mb-4">
                <img
                    src={Logo}
                    alt="RTU Online Appointment Logo"
                    className="w-[300px] lg:w-[400px]"
                />
            </div>
            <div className="w-full max-w-md bg-[#194F90] rounded-lg shadow-md p-6 md:px-8 lg:px-10">
                <form onSubmit={handleRequestPin} className="space-y-6">
                    <h2 className="text-white text-2xl font-semibold text-center">
                        Forgot Password
                    </h2>
                    <div>
                        <label className="block text-white">Email:</label>
                        <input
                            className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75] transition"
                            type="email"
                            placeholder="Enter Your Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-[#FFDB75] text-[#194F90] font-semibold rounded-lg hover:bg-[#f3cd64] transition duration-200"
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Send Verification PIN"}
                    </button>
                    {message && (
                        <p className="text-green-400 text-center mt-4">
                            {message}
                        </p>
                    )}
                    {errorMessage && (
                        <p className="text-red-400 text-center mt-4">
                            {errorMessage}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;
