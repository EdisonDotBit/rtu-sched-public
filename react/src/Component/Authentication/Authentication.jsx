import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function Authentication() {
    const navigate = useNavigate();
    const location = useLocation();
    const [pin, setPin] = useState(["", "", "", "", "", ""]);
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e, index) => {
        const value = e.target.value;
        // Only allow digits and max 1 character per input
        if (value.length <= 1 && /^[0-9]*$/.test(value)) {
            const newPin = [...pin];
            newPin[index] = value;
            setPin(newPin);

            // Auto focus next input
            if (value !== "" && index < pin.length - 1) {
                document.getElementById(`pin-${index + 1}`).focus();
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:8000/api/users/verify-pin",
                { pin },
                { withCredentials: true }
            );

            if (response.status === 200 && response.data.success) {
                navigate("/student/set-appointment", {
                    state: {
                        message: response.data.message,
                    },
                });
            }
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message || "Verification failed."
            );
        }
    };

    return (
        <div className="w-full h-full flex flex-col justify-center items-center gap-8">
            <h2 className="text-2xl font-semibold">Verify Your Email</h2>
            {location.state?.message && (
                <div className="text-green-600">{location.state.message}</div>
            )}
            {errorMessage && <div className="text-red-600">{errorMessage}</div>}
            <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center gap-4"
            >
                <div className="flex gap-2">
                    {pin.map((digit, index) => (
                        <input
                            key={index}
                            id={`pin-${index}`}
                            type="text"
                            value={digit}
                            onChange={(e) => handleChange(e, index)}
                            className="text-center w-12 h-12 border rounded-lg"
                            maxLength={1}
                        />
                    ))}
                </div>
                <button
                    type="submit"
                    className="btn btn-outline w-full text-[#194F90] bg-[#FFDB75] hover:bg-[#f3cd64] hover:text-[#194F90] mt-4"
                >
                    Verify PIN
                </button>
            </form>
        </div>
    );
}

export default Authentication;
