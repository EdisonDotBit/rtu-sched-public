import React, { useState, useEffect } from "react";

const TimePicker = ({
    formData,
    setFormData,
    appointments,
    limit,
    setTimeSelected,
}) => {
    const [disabledTime, setDisabledTime] = useState([]);
    const limits = Math.ceil(limit / 9);
    const timeSlots = [
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "1:00",
        "2:00",
        "3:00",
        "4:00",
    ];

    useEffect(() => {
        setDisabledTime([]);
        const getData = async () => {
            const counts = {};
            appointments.forEach((item) => {
                const time = item.apttime.slice(0, 5);
                if (
                    item.aptdate === formData.aptdate &&
                    item.aptoffice === formData.aptoffice &&
                    item.aptbranch === formData.aptbranch
                ) {
                    counts[time] = (counts[time] || 0) + 1;
                }
            });

            const disabled = Object.keys(counts).filter(
                (times) => counts[times] >= limits
            );

            console.log(counts);

            setDisabledTime((prev) => {
                return Array.from(new Set([...prev, ...disabled]));
            });

            // If the previously selected time is disabled, choose another available time. - Disable in case TimePicker doesn't work as expected.
            if (disabled.includes(formData.apttime)) {
                const availableTime = timeSlots.find(
                    (time) => !disabled.includes(time)
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
    }, [formData.aptdate, formData.aptoffice, appointments]);

    const handleTimeClick = (time) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            apttime: time,
        }));
        setTimeSelected(true);
    };

    return (
        <div className="container w-full mx-auto max-w-md p-4 text-black md:ml-10">
            <h2 className="text-2xl font-semibold mb-4">Select a Time</h2>
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
        </div>
    );
};

export default TimePicker;
