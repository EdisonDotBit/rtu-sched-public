const ConfirmationModal = ({
    modalRef,
    modalTitle,
    confirmationMessage,
    selectedAppointmentNum,
    isProcessing,
    action,
    setIsProcessing,
}) => {
    return (
        <dialog
            ref={modalRef}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] bg-[#194F90] rounded-lg shadow-lg p-4"
        >
            <div className="modal-box text-white bg-[#194F90]">
                <h3 className="font-bold text-lg">{modalTitle}</h3>
                <p className="py-4">{confirmationMessage}</p>
                <p className="py-4">
                    Appointment Number: {selectedAppointmentNum}
                </p>
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
                        {isProcessing ? "Processing..." : "Confirm"}
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
