import { useState } from "react";
import rtu from "./Subcomponent/Asset/RTU_Pasig.jpg";
import axios from "axios";

const StarRating = ({ rating, onRatingChange }) => {
    const stars = [1, 2, 3, 4, 5];

    return (
        <div className="flex items-center justify-center w-auto gap-8">
            {stars.map((star) => (
                <button
                    type="button"
                    key={star}
                    className={`text-2xl sm:text-4xl md:text-5xl ${
                        star <= rating ? "text-yellow-500" : "text-gray-400"
                    }`}
                    onClick={() => onRatingChange(star)}
                >
                    ★
                </button>
            ))}
        </div>
    );
};

const Feedback = () => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const [formData, setFormData] = useState({
        name: "",
        message: "",
        rating: 0,
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const maxLength = 200; // Set your desired character limit

    const handleRatingChange = (rating) => {
        setFormData({ ...formData, rating });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if the rating is 0
        if (formData.rating === 0) {
            // Display an error message or take any other action
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

        console.log(formData);
    };

    return (
        <div
            className="relative h-full w-full flex justify-center items-center bg-opacity-50 bg-cover backdrop-blur-lg"
            style={{
                backgroundImage: `url(${rtu})`,
                backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay
            }}
        >
            <div className="flex flex-col md:flex-row w-full max-w-5xl z-10 py-5 shadow-lg bg-opacity-50 backdrop-blur-sm rounded-2xl">
                {/* Left Section */}
                <div className="flex flex-col w-3/4 p-6 lg:p-8 space-y-4 justify-between">
                    <div className="flex flex-col gap-10">
                        <h1 className="text-3xl lg:text-4xl font-bold text-white leading-snug">
                            Leave us your feedback!
                        </h1>
                        <p className="text-justify text-sm md:text-lg text-white leading-relaxed">
                            We value your input as it helps us improve and
                            provide a better experience. Please take a moment to
                            share your thoughts, suggestions, or concerns. Your
                            feedback is greatly appreciated and will help us
                            enhance our services.
                        </p>
                    </div>
                    <p className="text-sm md:text-lg italic text-[#FFDB75] opacity-90">
                        "~Forever true to the gold and blue~"
                    </p>
                </div>

                {/* Right Section */}
                <div className="flex flex-col w-full p-6 lg:p-8">
                    <div className="bg-white shadow-lg rounded-lg p-10 w-full">
                        <h4 className="text-2xl font-semibold text-gray-900 mb-4">
                            Have a Suggestion?
                        </h4>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-gray-700 font-medium mb-1 mt-4"
                                >
                                    Name (Optional):
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75]"
                                    placeholder="Enter Name"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="message"
                                    className="block text-gray-700 font-medium mb-1 mt-4"
                                >
                                    Comment
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="4"
                                    maxLength={maxLength}
                                    className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75]"
                                    placeholder="Your Feedback"
                                    required
                                ></textarea>
                                <div className="text-right text-sm text-gray-500 mt-2">
                                    {formData.message.length} / {maxLength}{" "}
                                    characters
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-1 mt-4">
                                    Rating
                                </label>
                                <StarRating
                                    rating={formData.rating}
                                    onRatingChange={handleRatingChange}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Feedback;
