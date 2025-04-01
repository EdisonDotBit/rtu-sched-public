const AttachmentModal = ({
    isModalOpen,
    selectedAttachments,
    closeAttachmentModal,
}) => {
    if (!isModalOpen) return null;

    return (
        <dialog
            open
            className="z-1000 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] bg-[#194F90] rounded-lg shadow-lg p-6"
            onKeyDown={(event) => {
                if (event.key === "Escape") {
                    event.preventDefault();
                }
            }}
        >
            <div className="relative flex flex-col justify-center items-center text-white bg-[#194F90] px-4 w-full">
                <h2 className="text-xl font-semibold mb-4">View Attachments</h2>
                <div className="flex flex-col gap-4 w-full max-h-[500px] overflow-y-auto p-4 bg-white ">
                    {selectedAttachments.map((file, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center p-4 border-b"
                        >
                            {file.endsWith(".png") ||
                            file.endsWith(".jpg") ||
                            file.endsWith(".jpeg") ? (
                                <img
                                    src={`${
                                        import.meta.env.VITE_API_BASE_URL
                                    }/storage/${file}`}
                                    alt="Attachment"
                                    className="w-full h-[400px] object-contain bg-white p-2 rounded-lg"
                                />
                            ) : file.endsWith(".pdf") ? (
                                <iframe
                                    src={`${
                                        import.meta.env.VITE_API_BASE_URL
                                    }/storage/${file}`}
                                    className="w-full h-[400px] bg-white p-2 rounded-lg"
                                    title={`Attachment ${index + 1}`}
                                ></iframe>
                            ) : (
                                <a
                                    href={`${
                                        import.meta.env.VITE_API_BASE_URL
                                    }/storage/${file}`}
                                    download
                                    className="text-blue-600 underline"
                                >
                                    Download File
                                </a>
                            )}
                        </div>
                    ))}
                </div>
                <button
                    onClick={closeAttachmentModal}
                    className="mt-4 px-6 py-2 bg-[#FFDB75] text-[#194F90] font-semibold rounded-md hover:bg-[#f3cd64] transition"
                >
                    Close
                </button>
            </div>
        </dialog>
    );
};

export default AttachmentModal;
