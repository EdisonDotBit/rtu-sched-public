import React, { useState, useEffect } from "react";

const TimePicker = ({
    formData,
    setFormData,
    appointments,
    limit,
    setTimeSelected,
}) => {
    const [disabledTime, setDisabledTime] = useState([]);
    const [initialTime, setInitialTime] = useState(formData.apttime);
    const limits = Math.ceil(limit / 9);
    const timeSlots = [
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
    ];

    useEffect(() => {
        setDisabledTime([]);
        const getData = async () => {
            const counts = {};

            // Count appointments for the selected branch, office, and date
            appointments.forEach((item) => {
                const time = item.apttime.slice(0, 5);
                const key = `${item.aptbranch}-${item.aptoffice}-${time}`;

                if (
                    item.aptdate === formData.aptdate &&
                    item.aptoffice === formData.aptoffice &&
                    item.aptbranch === formData.aptbranch
                ) {
                    counts[key] = (counts[key] || 0) + 1;
                }
            });

            // Disable times for the specific branch and office if they exceed the limit
            const branchOfficeDisabledTimes = timeSlots.filter(
                (time) =>
                    counts[
                        `${formData.aptbranch}-${formData.aptoffice}-${time}`
                    ] >= limits
            );

            setDisabledTime(branchOfficeDisabledTimes);

            // If the previously selected time is disabled, choose another available time.
            if (branchOfficeDisabledTimes.includes(formData.apttime)) {
                const availableTime = timeSlots.find(
                    (time) => !branchOfficeDisabledTimes.includes(time)
                );
                if (availableTime) {
                    setFormData((prevFormData) => ({
                        ...prevFormData,
                        apttime: availableTime,
                    }));
                    setTimeSelected(true);
                }
            }
        };

        getData();
    }, [
        formData.aptdate,
        formData.aptoffice,
        formData.aptbranch,
        appointments,
    ]);

    const handleTimeClick = (time) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            apttime: time,
        }));
        setTimeSelected(true);
    };

    useEffect(() => {
        // Reset the selected time when switching dates
        if (formData.aptdate !== initialTime) {
            setInitialTime(formData.apttime);
        }
    }, [formData.aptdate, formData.apttime, initialTime]);

    return (
        <div className="container w-full mx-auto max-w-md p-4 text-black md:ml-4">
            <h2 className="text-2xl font-semibold mb-4">Select a Time</h2>
            {formData.aptdate ? (
                <div className="grid grid-cols-3 gap-4 xsm:text-xs sm:text-base">
                    {timeSlots.map((time, index) => (
                        <button
                            type="button"
                            key={index}
                            onClick={() => handleTimeClick(time)}
                            disabled={disabledTime.includes(time)}
                            className={`flex justify-center items-center p-4 border border-gray-300 rounded-lg focus:outline-none transition-colors ${
                                formData.apttime === time
                                    ? "bg-blue-600 text-white"
                                    : disabledTime.includes(time)
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "bg-white text-gray-700"
                            }`}
                        >
                            {time}
                        </button>
                    ))}
                </div>
            ) : (
                <div className="text-gray-500">Please select a date first.</div>
            )}
        </div>
    );
};

export default TimePicker;
