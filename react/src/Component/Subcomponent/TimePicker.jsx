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
    const [adminDisabledTime, setAdminDisabledTime] = useState([]);
    const [loading, setLoading] = useState(true);
    const limits = Math.ceil(limit / 9);
    const timeSlots = [
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "1:00",
        "2:00",
        "3:00",
        "4:00",
    ];

    const isTimePassed = (dateString, timeString) => {
        if (!dateString || !timeString) return false;

        // Get current time in PH (UTC+8)
        const now = new Date();
        const phNow = new Date(now.getTime() + 8 * 60 * 60 * 1000);

        // Parse the selected date (assuming format is YYYY-MM-DD)
        const [year, month, day] = dateString.split("-").map(Number);

        // Parse the time (convert to 24-hour format)
        let [hours, minutes] = timeString.split(":").map(Number);

        // Handle PM times (assuming times like "1:00" are PM)
        if (
            timeString.includes(":") &&
            hours < 8 &&
            !timeString.startsWith("0")
        ) {
            hours += 12;
        }

        // Create date object for the appointment in UTC+8
        const appointmentDate = new Date(
            Date.UTC(year, month - 1, day, hours, minutes || 0, 0, 0)
        );

        return phNow > appointmentDate;
    };

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

            // Add time slots that have passed to disabled array
            timeSlots.forEach((time) => {
                if (isTimePassed(formData.aptdate, time)) {
                    disabled.push(time);
                }
            });

            setDisabledTime([...disabled]);

            if (disabled.includes(formData.apttime)) {
                const availableTime = timeSlots.find(
                    (time) =>
                        !disabled.includes(time) &&
                        !adminDisabledTime.includes(time)
                );
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    apttime: availableTime || "",
                }));
                setTimeSelected(!!availableTime);
            }

            setTimeout(() => {
                setLoading(false);
            }, 1000);
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

                    setAdminDisabledTime([...fetchedTimes]);

                    // Add passed times to regular disabled slots
                    const passedTimes = [];
                    timeSlots.forEach((time) => {
                        if (isTimePassed(formData.aptdate, time)) {
                            passedTimes.push(time);
                        }
                    });

                    setDisabledTime((prev) => [...prev, ...passedTimes]);
                } catch (error) {
                    console.error("Error fetching disabled time slots:", error);
                } finally {
                    setTimeout(() => {
                        setLoading(false);
                    }, 1000);
                }
            };

            fetchDisabledSlots();
        },
        [apiBaseUrl, formData.aptoffice, formData.aptbranch, formData.aptdate],
        500
    );

    const handleTimeClick = (time) => {
        const isPassed = isTimePassed(formData.aptdate, time);
        const isAtLimit =
            disabledTime.includes(time) && !adminDisabledTime.includes(time);
        const isAdmin = userRole !== "Student" && userRole !== "Guest";

        // Prevent selection if time has passed or is at limit
        if (isPassed || isAtLimit) {
            return;
        }

        // Only prevent selection for non-admins if admin disabled the time
        if (!isAdmin && adminDisabledTime.includes(time)) {
            return;
        }

        setFormData((prevFormData) => ({
            ...prevFormData,
            apttime: time,
        }));
        setTimeSelected(true);
    };

    // Determine the display style for a time slot
    const getTimeSlotStyle = (time) => {
        const isPassed = isTimePassed(formData.aptdate, time);
        const isAtLimit =
            disabledTime.includes(time) && !adminDisabledTime.includes(time);
        const isAdminDisabled = adminDisabledTime.includes(time);
        const isAdmin = userRole !== "Student" && userRole !== "Guest";
        const isSelected = formData.apttime === time;

        if (isSelected) {
            return "bg-blue-600 text-white";
        }

        if (isPassed) {
            return "bg-red-100 text-gray-700 cursor-not-allowed";
        }

        if (isAtLimit) {
            return "bg-gray-200 text-gray-500 cursor-not-allowed";
        }

        if (isAdminDisabled) {
            return isAdmin
                ? "bg-yellow-300 text-gray-900 cursor-pointer"
                : "bg-gray-200 text-gray-500 cursor-not-allowed";
        }

        return "bg-white text-gray-700 hover:bg-gray-100";
    };

    // Determine if a time slot should be disabled
    const isTimeDisabled = (time) => {
        const isPassed = isTimePassed(formData.aptdate, time);
        const isAtLimit =
            disabledTime.includes(time) && !adminDisabledTime.includes(time);

        const isAdminDisabled = adminDisabledTime.includes(time);
        const isAdmin = userRole !== "Student" && userRole !== "Guest";

        return isPassed || isAtLimit || (!isAdmin && isAdminDisabled);
    };

    return (
        <div className="container w-full mx-auto max-w-md p-4 text-black">
            <h2 className="text-2xl font-semibold mb-4">Select a Time</h2>

            {loading ? (
                <div className="text-gray-500 text-center p-9">
                    Loading available times...
                </div>
            ) : formData.aptdate ? (
                <div className="grid grid-cols-3 gap-4 xsm:text-xs sm:text-base">
                    {timeSlots.map((time, index) => {
                        const disabled = isTimeDisabled(time);
                        const style = getTimeSlotStyle(time);
                        const isAdminDisabled =
                            adminDisabledTime.includes(time);
                        const isAdmin =
                            userRole !== "Student" && userRole !== "Guest";

                        return (
                            <button
                                type="button"
                                key={index}
                                onClick={() => handleTimeClick(time)}
                                disabled={loading || disabled}
                                className={`flex justify-center items-center p-4 border border-gray-300 rounded-lg focus:outline-none transition-colors ${style}`}
                                title={
                                    isTimePassed(formData.aptdate, time)
                                        ? "This time slot has already passed"
                                        : isAdminDisabled
                                        ? isAdmin
                                            ? "Admin-disabled time (click to use anyway)"
                                            : "This time slot has been disabled by admin"
                                        : disabledTime.includes(time)
                                        ? "This time slot has reached the appointment limit"
                                        : ""
                                }
                            >
                                {time}
                                {isTimePassed(formData.aptdate, time) && (
                                    <span className="sr-only"> (Passed)</span>
                                )}
                                {isAdminDisabled && isAdmin && (
                                    <span className="sr-only">
                                        {" "}
                                        (Admin-disabled)
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            ) : (
                <div className="text-gray-500">Please select a date first.</div>
            )}
        </div>
    );
};

export default TimePicker;
