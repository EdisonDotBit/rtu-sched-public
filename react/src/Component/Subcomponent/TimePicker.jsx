import React, { useState, useEffect } from "react";
import { useDebouncedEffect } from "../../Hooks/useDebouncedEffect";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const TimePicker = ({
    formData,
    setFormData = () => {},
    appointments,
    limit,
    setTimeSelected = () => {},
    userRole,
}) => {
    const [disabledTime, setDisabledTime] = useState([]);
    const [loading, setLoading] = useState(true); // ✅ Loading starts immediately
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
        setLoading(true);
        const getData = async () => {
            const counts = {};
            appointments.forEach((item) => {
                const time = item.apttime ? item.apttime.slice(0, 5) : "";
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

            setDisabledTime([...disabled]);

            if (disabled.includes(formData.apttime)) {
                const availableTime = timeSlots.find(
                    (time) => !disabled.includes(time)
                );
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    apttime: availableTime || "", // Clears if no available time
                }));
                setTimeSelected(!!availableTime);
            }

            setTimeout(() => {
                setLoading(false);
            }, 1000); // ⏳ 1-second delay
        };

        getData();
    }, [formData.aptdate, formData.aptoffice, appointments]);

    useDebouncedEffect(
        () => {
            const fetchDisabledSlots = async () => {
                if (
                    !formData.aptoffice ||
                    !formData.aptbranch ||
                    !formData.aptdate
                )
                    return;

                setLoading(true);
                try {
                    const endpoint = `${apiBaseUrl}/api/office/disabled-slots/${formData.aptoffice}/${formData.aptbranch}`;
                    const res = await fetch(endpoint);
                    if (!res.ok) throw new Error(res.statusText);
                    const data = await res.json();
                    const fetchedTimes = data
                        .filter(
                            (item) =>
                                item.date === formData.aptdate && item.time
                        )
                        .map((item) => item.time);

                    setDisabledTime([...fetchedTimes]);
                } catch (error) {
                    console.error("Error fetching disabled time slots:", error);
                } finally {
                    setTimeout(() => {
                        setLoading(false);
                    }, 1000); // ⏳ 1-second delay
                }
            };

            fetchDisabledSlots();
        },
        [apiBaseUrl, formData.aptoffice, formData.aptbranch, formData.aptdate],
        500
    );

    useDebouncedEffect(
        () => {
            const fetchDisabledSlots = async () => {
                if (
                    !formData.aptoffice ||
                    !formData.aptbranch ||
                    !formData.aptdate
                )
                    return;

                setLoading(true);
                try {
                    const endpoint = `${apiBaseUrl}/api/office/disabled-slots/${formData.aptoffice}/${formData.aptbranch}`;
                    const res = await fetch(endpoint);
                    if (!res.ok) throw new Error(res.statusText);
                    const data = await res.json();

                    const fetchedTimes = data
                        .filter(
                            (item) =>
                                item.date === formData.aptdate && item.time
                        )
                        .map((item) => item.time);

                    setDisabledTime([...fetchedTimes]);
                } catch (error) {
                    console.error("Error fetching disabled time slots:", error);
                } finally {
                    setTimeout(() => {
                        setLoading(false);
                    }, 1000); // ⏳ 1-second delay
                }
            };

            fetchDisabledSlots();
        },
        [apiBaseUrl, formData.aptoffice, formData.aptbranch, formData.aptdate],
        500
    );

    const handleTimeClick = (time) => {
        // Prevent clicking if the time slot is explicitly disabled for students or guests.
        if (
            (userRole === "Student" || userRole === "Guest") &&
            disabledTime.includes(time)
        ) {
            return;
        }

        // Update the selected time in the form data.
        setFormData((prevFormData) => ({
            ...prevFormData,
            apttime: time,
        }));
        setTimeSelected(true);
    };

    return (
        <div className="container w-full mx-auto max-w-md p-4 text-black">
            <h2 className="text-2xl font-semibold mb-4">Select a Time</h2>

            {loading ? ( // ✅ Show loading state while fetching
                <div className="text-gray-500 text-center p-9">
                    Loading available times...
                </div>
            ) : formData.aptdate ? (
                <div className="grid grid-cols-3 gap-4 xsm:text-xs sm:text-base">
                    {timeSlots.map((time, index) => (
                        <button
                            type="button"
                            key={index}
                            onClick={() => handleTimeClick(time)}
                            disabled={
                                loading || // Disable if loading
                                (userRole === "Student" &&
                                    disabledTime.includes(time)) || // Disable for students if time is disabled
                                (userRole === "Guest" &&
                                    disabledTime.includes(time)) // Disable for guests if time is disabled
                            }
                            className={`flex justify-center items-center p-4 border border-gray-300 rounded-lg focus:outline-none transition-colors ${
                                formData.apttime === time
                                    ? "bg-blue-600 text-white"
                                    : disabledTime.includes(time)
                                    ? userRole === "Student" ||
                                      userRole === "Guest"
                                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                        : "bg-yellow-300 text-gray-900 cursor-pointer"
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
