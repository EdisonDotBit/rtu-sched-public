import { useEffect, useRef, useState } from "react";

function Feedbacks() {
    const [feedbacks, setFeedback] = useState([]);
    const [counts, setCount] = useState();
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const [avg, setAvg] = useState();
    const modals = useRef(null);
    const [selectedFeedback, setSelectedFeedback] = useState({ name: "" });
    useEffect(() => {
        const getData = async () => {
            const getRes = await fetch(`${apiBaseUrl}/api/feedbacks`);
            const getDataResult = await getRes.json();

            if (getRes.status === 200) {
                const totalRatings = getDataResult.reduce(
                    (acc, feedback) => acc + feedback.rating,
                    0
                );
                const averageRating = totalRatings / getDataResult.length;
                setAvg(averageRating);
                setFeedback(getDataResult);
            }
        };
        getData();
    }, []);
    const openModal = (feedItem) => {
        setSelectedFeedback(feedItem);
        modals.current.showModal();
    };
    return (
        <div className="w-full h-full flex flex-col ">
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
                        {avg}
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
                {feedbacks.map((feedItem, index) => (
                    <div
                        key={index}
                        className="p-6 border border-gray-300 rounded-md shadow-md transition-transform hover:scale-105 w-96 max-w-sm mx-2 my-2 cursor-pointer"
                        onClick={() => openModal(feedItem)}
                    >
                        <p
                            type="button"
                            className="text-5xl mr-8 text-yellow-500 flex justify-center items-center rounded-2xl w-full"
                            disabled
                        >
                            ★<p className="text-black">{feedItem.rating} </p>
                        </p>
                        <p className="text-xl text-center">
                            {feedItem.name.slice(0, 1)}
                            {feedItem.name.slice(1, -1).replace(/./g, "*")}
                            {feedItem.name.slice(-1)}
                        </p>

                        <p className="text-sm line-clamp-1">
                            {feedItem.message}
                        </p>
                    </div>
                ))}
            </div>
            <dialog ref={modals} className="modal">
                <div className="flex flex-col text-white modal-box p-10">
                    <h1 className="text-center">Feedback Details</h1>
                    <div className=" mt-8">
                        {selectedFeedback && (
                            <div>
                                <div className="flex">
                                    <p className="text-left ml-20 mr-40">
                                        Name:{selectedFeedback.name.slice(0, 1)}
                                        {selectedFeedback.name
                                            .slice(1, -1)
                                            .replace(/./g, "*")}
                                        {selectedFeedback.name.slice(-1)}
                                    </p>
                                    Rating:{selectedFeedback.rating}
                                </div>
                                <div>
                                    <p className="text-center">
                                        <br />
                                        Message
                                    </p>
                                    <p className="text-left">
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
