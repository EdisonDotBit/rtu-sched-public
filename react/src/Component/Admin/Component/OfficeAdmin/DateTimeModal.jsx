import Calendar from "../../../Subcomponent/Calendar";
import TimePicker from "../../../Subcomponent/TimePicker";
import { toast } from "react-toastify";

export default function DateTimeModal({
    dateTimeModal,
    selectedOffice,
    formData,
    setFormData,
    disabledDates,
    disabledTimes,
    calendarKey,
    timePickerKey,
    role,
    offData,
    isDateDisabled,
    isTimeDisabled,
    handleDateToggle,
    handleTimeToggle,
    setIsTimeSelected,
    isLoading,
}) {
    return (
        <dialog
            ref={dateTimeModal}
            className="modal top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop:bg-gray-900/50 backdrop:backdrop-blur-sm"
            aria-labelledby="datetime-modal-title"
        >
            <div className="modal-box max-w-4xl bg-white rounded-xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3
                        id="datetime-modal-title"
                        className="text-lg font-bold text-gray-900"
                    >
                        Manage Date & Time
                    </h3>
                    <button
                        onClick={() => dateTimeModal.current.close()}
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
                <p className="text-gray-600 mb-6">
                    Office: {selectedOffice?.offname || "No Office Selected"}
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="flex flex-col items-center">
                        <Calendar
                            key={calendarKey}
                            formData={formData}
                            setFormData={setFormData}
                            limit={selectedOffice?.offlimit || 10}
                            appointments={offData}
                            userRole={role}
                            disabledDates={disabledDates}
                            setIsTimeSelected={setIsTimeSelected}
                        />
                        <button
                            className="mt-4 px-4 py-2 w-full bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
                            onClick={async () => {
                                if (formData.aptdate) {
                                    await handleDateToggle(formData.aptdate);
                                } else {
                                    toast.error(
                                        "Please select a date to toggle."
                                    );
                                }
                            }}
                            disabled={isLoading || !formData.aptdate}
                        >
                            {isLoading
                                ? "Processing..."
                                : isDateDisabled
                                ? "Enable Date"
                                : "Disable Date"}
                        </button>
                    </div>

                    <div className="flex flex-col items-center">
                        <TimePicker
                            key={timePickerKey}
                            formData={formData}
                            setFormData={setFormData}
                            limit={selectedOffice?.offlimit || 10}
                            appointments={offData}
                            userRole={role}
                            disabledTimes={disabledTimes}
                            setIsTimeSelected={setIsTimeSelected}
                        />
                        <button
                            className="mt-4 px-4 py-2 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
                            onClick={async () => {
                                if (formData.aptdate && formData.apttime) {
                                    await handleTimeToggle(
                                        formData.aptdate,
                                        formData.apttime
                                    );
                                } else {
                                    toast.error(
                                        "Please select a date and time to toggle."
                                    );
                                }
                            }}
                            disabled={
                                isLoading ||
                                !formData.aptdate ||
                                !formData.apttime
                            }
                        >
                            {isLoading
                                ? "Processing..."
                                : isTimeDisabled
                                ? "Enable Time"
                                : "Disable Time"}
                        </button>
                    </div>
                </div>
            </div>
        </dialog>
    );
}
