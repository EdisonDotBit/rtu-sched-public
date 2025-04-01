const OtherPurposeModal = ({
    isOtherPurposeModalOpen,
    selectedOtherPurpose,
    closeOtherPurposeModal,
}) => {
    if (!isOtherPurposeModalOpen) return null;

    return (
        <dialog
            open
            className="z-1000 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] bg-[#194F90] rounded-lg shadow-lg p-6"
            onKeyDown={(event) => {
                if (event.key === "Escape") {
                    event.preventDefault();
                }
            }}
        >
            <div className="relative flex flex-col justify-center items-center text-white bg-[#194F90] px-4 w-full">
                <h2 className="text-xl font-semibold mb-4">
                    View Other Purpose
                </h2>
                <div className="w-full max-h-[300px] overflow-y-auto p-4 bg-white text-gray-800 rounded-lg">
                    <p className="text-md">{selectedOtherPurpose}</p>
                </div>
                <button
                    onClick={closeOtherPurposeModal}
                    className="mt-4 px-6 py-2 bg-[#FFDB75] text-[#194F90] font-semibold rounded-md hover:bg-[#f3cd64] transition"
                >
                    Close
                </button>
            </div>
        </dialog>
    );
};

export default OtherPurposeModal;
