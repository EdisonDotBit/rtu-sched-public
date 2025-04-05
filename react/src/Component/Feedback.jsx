import { useEffect, useState } from "react";
import rtu from "./Subcomponent/Asset/RTU_Pasig.jpg";
import axios from "axios";

const StarRating = ({ rating, onRatingChange }) => {
    const stars = [1, 2, 3, 4, 5];

    return (
        <div className="flex justify-center gap-2 sm:gap-3">
            {stars.map((star) => (
                <button
                    type="button"
                    key={star}
                    className={`transition-transform duration-200 hover:scale-110 text-2xl sm:text-3xl ${
                        star <= rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                    onClick={() => onRatingChange(star)}
                    aria-label={`Rate ${star} star`}
                >
                    {star <= rating ? "★" : "☆"}
                </button>
            ))}
        </div>
    );
};

const Feedback = () => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        message: "",
        rating: 0,
    });

    useEffect(() => {
        // Check URL parameters when component mounts
        const params = new URLSearchParams(window.location.search);
        const source = params.get("src");
        const aptId = params.get("apt");

        // Only show form if coming from email with an appointment ID
        const isValidAccess = source === "email" && aptId;
        setShowForm(isValidAccess);

        if (isValidAccess) {
            setFormData((prev) => ({ ...prev, appointmentId: aptId }));
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const maxLength = 200;

    const handleRatingChange = (rating) => {
        setFormData({ ...formData, rating });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.rating === 0) {
            alert("Please select a rating");
            return;
        } else {
            try {
                const res = await axios.post(
                    `${apiBaseUrl}/api/feedback`,
                    formData
                );
                if (res.status === 200) {
                    alert("Thank you for your feedback");
                    setFormData({
                        name: "",
                        message: "",
                        rating: 0,
                    });
                }
            } catch (error) {
                alert("Feedback failed. Please check your details");
            }
        }
    };

    if (!showForm) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        Access Restricted
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Please access this form using the link from your
                        appointment completion email.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center p-2 sm:p-4 bg-gray-900">
            {/* Background Image with Overlay */}
            <div
                className="fixed inset-0 bg-cover bg-center z-0"
                style={{ backgroundImage: `url(${rtu})` }}
            >
                <div className="absolute inset-0 backdrop-blur-sm"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-md md:max-w-2xl lg:max-w-4xl bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-lg mx-2 my-4">
                <div className="flex flex-col lg:flex-row">
                    {/* Left Section - Branding (Hidden on small screens) */}
                    <div className="hidden sm:block sm:w-full lg:w-2/5 bg-gradient-to-br from-blue-800 to-blue-600 p-4 sm:p-6 text-white">
                        <div className="mb-4">
                            <h1 className="text-xl sm:text-2xl font-bold mb-2 leading-tight">
                                Share Your Experience
                            </h1>
                            <p className="text-blue-100 text-xs sm:text-sm">
                                We value your input as it helps us improve and
                                provide a better experience.
                            </p>
                        </div>
                        <p className="text-blue-200 italic text-xs sm:text-sm mt-4">
                            "Forever true to the gold and blue"
                        </p>
                    </div>

                    {/* Right Section - Form */}
                    <div className="w-full lg:w-3/5 p-4 sm:p-6">
                        <div className="mb-4">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                                Feedback Form
                            </h2>
                            <p className="text-gray-600 text-xs sm:text-sm">
                                Help us serve you better
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                                >
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="message"
                                    className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
                                >
                                    Your Feedback
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="3"
                                    maxLength={maxLength}
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                                    placeholder="Share your thoughts..."
                                    required
                                ></textarea>
                                <div className="text-xs text-gray-500 text-right mt-1">
                                    {formData.message.length}/{maxLength}{" "}
                                    characters
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                    Rating
                                </label>
                                <StarRating
                                    rating={formData.rating}
                                    onRatingChange={handleRatingChange}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                            >
                                Submit Feedback
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Feedback;
