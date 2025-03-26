import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useDebouncedEffect } from "../../Hooks/useDebouncedEffect";

function Feedbacks() {
    const [feedbacks, setFeedback] = useState([]);
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const [avg, setAvg] = useState(0);
    const modals = useRef(null);
    const [selectedFeedback, setSelectedFeedback] = useState({ name: "" });

    // Fetch feedback data (keep existing implementation)
    const getData = useCallback(async () => {
        try {
            const getRes = await fetch(`${apiBaseUrl}/api/feedbacks`);
            const getDataResult = await getRes.json();

            if (getRes.status === 200) {
                const totalRatings = getDataResult.reduce(
                    (acc, feedback) => acc + feedback.rating,
                    0
                );
                const averageRating =
                    getDataResult.length > 0
                        ? totalRatings / getDataResult.length
                        : 0;
                setAvg(averageRating);
                setFeedback(getDataResult);
            }
        } catch (error) {
            console.error("Error fetching feedbacks:", error);
        }
    }, [apiBaseUrl]);

    useDebouncedEffect(
        () => {
            getData();
        },
        [apiBaseUrl],
        500
    );

    const openModal = useCallback((feedItem) => {
        setSelectedFeedback(feedItem);
        modals.current.showModal();
    }, []);

    const averageRatingDisplay = useMemo(() => avg.toFixed(1), [avg]);

    const feedbackCards = useMemo(
        () =>
            feedbacks.map((feedItem, index) => (
                <div
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-100 hover:border-blue-100 w-full sm:w-80"
                    onClick={() => openModal(feedItem)}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <div className="bg-blue-50 text-blue-600 rounded-full w-10 h-10 flex items-center justify-center font-medium">
                                {feedItem.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-3">
                                <p className="font-medium text-gray-900">
                                    {feedItem.name.slice(0, 1)}
                                    {feedItem.name
                                        .slice(1, -1)
                                        .replace(/./g, "•")}
                                    {feedItem.name.slice(-1)}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                            <span className="text-yellow-600 font-medium mr-1">
                                {feedItem.rating}
                            </span>
                            <svg
                                className="w-4 h-4 text-yellow-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-3">
                        {feedItem.message}
                    </p>
                    <div className="mt-4 flex justify-end">
                        <button className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors">
                            View details →
                        </button>
                    </div>
                </div>
            )),
        [feedbacks, openModal]
    );

    return (
        <div className="w-full h-full p-6 max-w-7xl mx-auto">
            {/* Header with stats */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Customer Feedback
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Insights from your users and customers
                    </p>
                </div>

                <div className="flex items-center mt-4 md:mt-0 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="text-center mr-6">
                        <p className="text-3xl font-bold text-gray-900">
                            {feedbacks.length}
                        </p>
                        <p className="text-sm text-gray-500">Total feedbacks</p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center">
                            <span className="text-3xl font-bold text-gray-900 mr-2">
                                {averageRatingDisplay}
                            </span>
                            <svg
                                className="w-6 h-6 text-yellow-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </div>
                        <p className="text-sm text-gray-500">Average rating</p>
                    </div>
                </div>
            </div>

            {/* Feedback cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {feedbackCards}
            </div>

            {/* Empty state */}
            {feedbacks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-xl">
                    <svg
                        className="w-16 h-16 text-gray-300 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-700">
                        No feedback yet
                    </h3>
                    <p className="text-gray-500 mt-1 text-center max-w-md">
                        Customer feedback will appear here once they start
                        submitting reviews.
                    </p>
                </div>
            )}

            {/* Feedback detail modal */}
            <dialog
                ref={modals}
                className="w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md bg-white rounded-xl shadow-xl p-0 backdrop:bg-black/30 backdrop:backdrop-blur-sm border-0"
            >
                <div className="relative">
                    {/* Modal header */}
                    <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 rounded-t-xl flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Feedback Details
                        </h2>
                        <button
                            onClick={() => modals.current.close()}
                            className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-50 transition-colors"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Modal content */}
                    <div className="p-6">
                        {selectedFeedback && (
                            <div className="space-y-6">
                                {/* User info */}
                                <div className="flex items-center space-x-4">
                                    <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center text-lg font-medium">
                                        {selectedFeedback.name
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">
                                            {selectedFeedback.name.slice(0, 1)}
                                            {selectedFeedback.name
                                                .slice(1, -1)
                                                .replace(/./g, "•")}
                                            {selectedFeedback.name.slice(-1)}
                                        </h3>
                                        <div className="flex items-center mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <svg
                                                    key={i}
                                                    className={`w-5 h-5 ${
                                                        i <
                                                        selectedFeedback.rating
                                                            ? "text-yellow-400"
                                                            : "text-gray-300"
                                                    }`}
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                            <span className="ml-2 text-sm text-gray-500">
                                                {selectedFeedback.rating}/5
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Feedback message */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                                        MESSAGE
                                    </h4>
                                    <p className="text-gray-700 whitespace-pre-line">
                                        {selectedFeedback.message}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Modal footer */}
                    <div className="sticky bottom-0 bg-gray-50 px-6 py-3 border-t border-gray-100 rounded-b-xl flex justify-end">
                        <button
                            onClick={() => modals.current.close()}
                            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </dialog>
        </div>
    );
}

export default Feedbacks;
