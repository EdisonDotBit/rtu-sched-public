export default function DeleteModal({
    deleteModal,
    purposeToDelete,
    deletePurpose,
    isLoading,
}) {
    return (
        <dialog
            ref={deleteModal}
            className="modal top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop:bg-gray-900/50 backdrop:backdrop-blur-sm"
            aria-labelledby="delete-modal-title"
        >
            <div className="modal-box max-w-md bg-white rounded-xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3
                        id="delete-modal-title"
                        className="text-lg font-bold text-gray-900"
                    >
                        Confirm Deletion
                    </h3>
                    <button
                        onClick={() => deleteModal.current.close()}
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
                        Are you sure you want to delete the purpose:{" "}
                        <strong>{purposeToDelete?.purpose}</strong>?
                    </p>
                    <p className="text-gray-500 text-sm">
                        This action cannot be undone.
                    </p>
                </div>
                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        onClick={() => {
                            deleteModal.current.close();
                        }}
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 border border-transparent text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        onClick={() => {
                            deletePurpose(purposeToDelete.id);
                            deleteModal.current.close();
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </dialog>
    );
}
