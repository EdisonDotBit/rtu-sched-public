import { useState, useEffect } from "react";

export default function EditLimitModal({
    editLimitModal,
    selectedOffice,
    handleLimitUpdate,
    isLoading,
}) {
    const [limit, setLimit] = useState(selectedOffice?.offlimit || "");

    useEffect(() => {
        if (selectedOffice) {
            setLimit(selectedOffice.offlimit);
        }
    }, [selectedOffice]);

    const handleSubmit = (e) => {
        e.preventDefault();
        handleLimitUpdate(limit);
    };

    return (
        <dialog
            ref={editLimitModal}
            className="modal w-1/2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop:bg-gray-900/50 backdrop:backdrop-blur-sm"
            aria-labelledby="limit-modal-title"
        >
            <div className="modal-box w-full bg-white rounded-xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3
                        id="limit-modal-title"
                        className="text-lg font-bold text-gray-900"
                    >
                        Edit Office Limit
                    </h3>
                    <button
                        onClick={() => editLimitModal.current.close()}
                        className="text-gray-400 hover:text-gray-500"
                        aria-label="Close modal"
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
                <div className="mb-6">
                    <p className="text-gray-600 mb-2">
                        Office: {selectedOffice?.offname}
                    </p>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="number"
                            min="1"
                            value={limit}
                            onChange={(e) => setLimit(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                            required
                        />
                    </form>
                </div>
                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        onClick={() => editLimitModal.current.close()}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 border border-transparent text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? "Updating..." : "Update"}
                    </button>
                </div>
            </div>
        </dialog>
    );
}
