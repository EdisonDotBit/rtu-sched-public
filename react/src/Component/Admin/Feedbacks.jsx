import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useDebouncedEffect } from "../../Hooks/useDebouncedEffect";

function Feedbacks() {
    const [feedbacks, setFeedback] = useState([]);
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const [avg, setAvg] = useState(0);
    const modals = useRef(null);
    const [selectedFeedback, setSelectedFeedback] = useState({ name: "" });

    // Fetch feedback data
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

    // Fetch data on mount and when apiBaseUrl changes
    useDebouncedEffect(
        () => {
            getData();
        },
        [apiBaseUrl],
        500
    );

    // Open modal with selected feedback
    const openModal = useCallback((feedItem) => {
        setSelectedFeedback(feedItem);
        modals.current.showModal();
    }, []);

    // Memoize average rating display
    const averageRatingDisplay = useMemo(() => avg.toFixed(1), [avg]);

    // Memoize feedback cards to avoid re-rendering
    const feedbackCards = useMemo(
        () =>
            feedbacks.map((feedItem, index) => (
                <div
                    key={index}
                    className="bg-white p-6 border border-gray-300 rounded-md shadow-md transition-transform hover:scale-105 w-96 max-w-sm mx-2 my-2 cursor-pointer"
                    onClick={() => openModal(feedItem)}
                >
                    <div className="text-5xl mr-8 text-yellow-500 flex justify-center items-center rounded-2xl w-full">
                        ★<span className="text-black">{feedItem.rating}</span>
                    </div>
                    <p className="text-xl text-center">
                        {feedItem.name.slice(0, 1)}
                        {feedItem.name.slice(1, -1).replace(/./g, "*")}
                        {feedItem.name.slice(-1)}
                    </p>
                    <p className="text-sm line-clamp-1">{feedItem.message}</p>
                </div>
            )),
        [feedbacks, openModal]
    );

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex flex-col justify-center">
                <p className="text-xl font-medium text-black dark:text-gray-400 flex justify-center">
                    {feedbacks.length} Total Feedbacks
                </p>
                <div className="flex items-center justify-center mb-2 text-center">
                    <svg
                        className="w-4 h-4 text-yellow-300 me-1"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20"
                    >
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                    </svg>
                    <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                        {averageRatingDisplay}
                    </p>
                    <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                        out of
                    </p>
                    <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                        5
                    </p>
                </div>
            </div>
            <div className="flex flex-wrap justify-center mt-6">
                {feedbackCards}
            </div>
            <dialog
                ref={modals}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] bg-[#194F90] rounded-lg shadow-lg p-4 backdrop:bg-black/50"
            >
                <div className="modal-box flex flex-col justify-center items-center text-white bg-[#194F90] p-10">
                    {/* Close button with SVG */}
                    <button
                        className="absolute top-2 right-2 p-2 transition duration-300 focus:outline-none"
                        onClick={() => modals.current.close()}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                    <h1 className="text-center text-xl font-semibold mb-6">
                        Feedback Details
                    </h1>

                    <div className="w-full max-w-lg">
                        {selectedFeedback && (
                            <div className="flex flex-col space-y-4">
                                {/* Name and Rating Section */}
                                <div className="flex flex-col sm:flex-row justify-center gap-20 items-start sm:items-center">
                                    <p className="text-center text-sm">
                                        Name:{" "}
                                        {selectedFeedback.name.slice(0, 1)}
                                        {selectedFeedback.name
                                            .slice(1, -1)
                                            .replace(/./g, "*")}
                                        {selectedFeedback.name.slice(-1)}
                                    </p>
                                    <p className="text-center">
                                        Rating: {selectedFeedback.rating}
                                    </p>
                                </div>

                                {/* Message Section */}
                                <div className="mt-4 text-sm">
                                    <p className="text-center text-lg font-medium my-2">
                                        Message:
                                    </p>
                                    <p className="text-justify">
                                        {selectedFeedback.message}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </dialog>
        </div>
    );
}

export default Feedbacks;
