const ConfirmationModal = ({
    modalRef,
    modalTitle,
    confirmationMessage,
    selectedAppointmentNum,
    selectedAppointmentIds = [],
    isProcessing,
    action,
    setIsProcessing,
    isBulkAction = false,
}) => {
    return (
        <dialog
            ref={modalRef}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] bg-[#194F90] rounded-lg shadow-lg p-4"
        >
            <div className="modal-box text-white bg-[#194F90]">
                <h3 className="font-bold text-lg">{modalTitle}</h3>
                <p className="py-4">{confirmationMessage}</p>

                {/* Show appointment number for single action */}
                {!isBulkAction && selectedAppointmentNum && (
                    <p className="py-2">
                        Appointment Number: {selectedAppointmentNum}
                    </p>
                )}

                {/* Show count and IDs for bulk action */}
                {isBulkAction && selectedAppointmentIds.length > 0 && (
                    <div className="py-2">
                        <p>
                            Number of appointments:{" "}
                            {selectedAppointmentIds.length}
                        </p>
                        <details className="mt-2">
                            <summary className="cursor-pointer text-sm">
                                Show appointment IDs
                            </summary>
                            <div className="mt-2 max-h-40 overflow-y-auto text-sm bg-[#0d3a6e] p-2 rounded">
                                {selectedAppointmentIds.map((id, index) => (
                                    <div key={index}>{id}</div>
                                ))}
                            </div>
                        </details>
                    </div>
                )}

                <div className="modal-action flex justify-center gap-4">
                    <button
                        className="mt-6 px-6 py-2 border border-white text-white rounded-lg transition duration-100 ease-in-out hover:bg-white hover:text-[#194F90] disabled:opacity-50 disabled:cursor-not-allowed"
                        type="button"
                        disabled={isProcessing}
                        onClick={async () => {
                            setIsProcessing(true);
                            try {
                                await action();
                                modalRef.current.close();
                            } catch (error) {
                                console.error("Error:", error);
                            } finally {
                                setIsProcessing(false);
                            }
                        }}
                    >
                        {isProcessing ? (
                            <span className="flex items-center gap-2">
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Processing...
                            </span>
                        ) : (
                            "Confirm"
                        )}
                    </button>
                    <button
                        className="mt-6 ml-4 px-6 py-2 border border-white text-white rounded-lg transition duration-100 ease-in-out hover:bg-white hover:text-[#194F90] disabled:opacity-50 disabled:cursor-not-allowed"
                        type="button"
                        disabled={isProcessing}
                        onClick={() => {
                            modalRef.current.close();
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </dialog>
    );
};

export default ConfirmationModal;
