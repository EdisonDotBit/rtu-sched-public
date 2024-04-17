import { useState } from "react";
import Qwe from "./Subcomponent/Asset/e.jpg";
import axios from "axios";

const StarRating = ({ rating, onRatingChange }) => {
    const stars = [1, 2, 3, 4, 5];

    return (
        <div className="flex items-center justify-center w-auto">
            {stars.map((star) => (
                <button
                    type="button"
                    key={star}
                    className={`text-2xl sm:text-4xl md:text-5xl mr-8 ${
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
            className="relative h-full w-full flex justify-center items-center bg-opacity-50 bg-cover backdrop-filter backdrop-blur-lg"
            style={{
                backgroundImage: `url(${Qwe})`,
                // Apply semi-transparent black overlay
                backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust opacity here (0.5 for 50%)
            }}
        >
            <div class="mx-auto flex flex-col md:flex-row z-10 py-5 shadow-lg bg-opacity-50 backdrop-filter backdrop-blur-sm rounded-2xl">
                <div className="flex flex-col w-full lg:w-1/3 p-8 md: mr-40">
                    <p className="ml-6 text-yellow-300 text-lg uppercase tracking-loose">
                        REVIEW
                    </p>
                    <p className="text-3xl md:text-5xl my-4 text-gray-300 leading-relaxed md:leading-snug">
                        Leave us a feedback!
                    </p>
                    <p className="text-sm md:text-base leading-snug text-gray-50 text-opacity-100">
                        Please provide your valuable feedback and something
                        something ...
                    </p>
                </div>
                <div className="flex flex-col w-full justify-center">
                    <div className="w-full px-4">
                        <div className="flex flex-wrap justify-center">
                            <div className="w-full px-4">
                                <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white">
                                    <div className="flex-auto p-5 lg:p-10">
                                        <h4 className="text-2xl mb-4 text-black font-semibold">
                                            Have a suggestion?
                                        </h4>
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-4">
                                                <label
                                                    htmlFor="name"
                                                    className="block text-gray-700 font-semibold mb-2"
                                                >
                                                    Name
                                                </label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:border-blue-500 bg-transparent"
                                                    placeholder="Your Name"
                                                    required
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label
                                                    htmlFor="message"
                                                    className="block text-gray-700 font-semibold mb-2"
                                                >
                                                    Comment
                                                </label>
                                                <textarea
                                                    id="message"
                                                    name="message"
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    rows="4"
                                                    className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:border-blue-500 bg-transparent h-auto"
                                                    placeholder="Your Feedback"
                                                    required
                                                ></textarea>
                                            </div>
                                            <div className="mb-4 flex flex-col">
                                                <label className="block text-gray-700 font-semibold mb-2">
                                                    Rating
                                                </label>
                                                <StarRating
                                                    rating={formData.rating}
                                                    onRatingChange={
                                                        handleRatingChange
                                                    }
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                                            >
                                                Submit
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Feedback;
