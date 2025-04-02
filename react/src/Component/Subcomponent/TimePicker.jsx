// TimePicker.jsx
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

        const now = new Date();
        const phNow = new Date(now.getTime() + 8 * 60 * 60 * 1000);
        const [year, month, day] = dateString.split("-").map(Number);
        let [hours, minutes] = timeString.split(":").map(Number);

        if (
            timeString.includes(":") &&
            hours < 8 &&
            !timeString.startsWith("0")
        ) {
            hours += 12;
        }

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

            setTimeout(() => setLoading(false), 1000);
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
                    setTimeout(() => setLoading(false), 1000);
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

        if (isPassed || isAtLimit) return;
        if (!isAdmin && adminDisabledTime.includes(time)) return;

        setFormData((prevFormData) => ({
            ...prevFormData,
            apttime: time,
        }));
        setTimeSelected(true);
    };

    const getTimeSlotStyle = (time) => {
        const isPassed = isTimePassed(formData.aptdate, time);
        const isAtLimit =
            disabledTime.includes(time) && !adminDisabledTime.includes(time);
        const isAdminDisabled = adminDisabledTime.includes(time);
        const isAdmin = userRole !== "Student" && userRole !== "Guest";
        const isSelected = formData.apttime === time;

        if (isSelected) return "bg-blue-600 text-white";
        if (isPassed) return "bg-red-100 text-gray-700 cursor-not-allowed";
        if (isAtLimit) return "bg-gray-200 text-gray-500 cursor-not-allowed";
        if (isAdminDisabled) {
            return isAdmin
                ? "bg-yellow-300 text-gray-900 cursor-pointer hover:bg-yellow-400"
                : "bg-yellow-100 text-gray-700 cursor-not-allowed";
        }
        return "bg-white text-gray-700 hover:bg-gray-100";
    };

    const isTimeDisabled = (time) => {
        const isPassed = isTimePassed(formData.aptdate, time);
        const isAtLimit =
            disabledTime.includes(time) && !adminDisabledTime.includes(time);
        const isAdminDisabled = adminDisabledTime.includes(time);
        const isAdmin = userRole !== "Student" && userRole !== "Guest";

        return isPassed || isAtLimit || (!isAdmin && isAdminDisabled);
    };

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:h-[520px] flex flex-col">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">
                Select Time Slot
            </h2>

            <div className="flex-grow">
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="animate-pulse flex space-x-4">
                            <div className="flex-1 space-y-4 py-1">
                                Loading Time Slot
                            </div>
                        </div>
                    </div>
                ) : formData.aptdate ? (
                    <div className="grid grid-cols-2 gap-3">
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
                                    className={`relative flex items-center justify-center p-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${style} ${
                                        disabled
                                            ? "cursor-not-allowed"
                                            : "cursor-pointer hover:shadow-md"
                                    }`}
                                    title={
                                        isTimePassed(formData.aptdate, time)
                                            ? "This time slot has passed"
                                            : isAdminDisabled
                                            ? isAdmin
                                                ? "Admin-disabled (click to use)"
                                                : "Disabled by admin"
                                            : disabledTime.includes(time)
                                            ? "Fully booked"
                                            : "Available"
                                    }
                                >
                                    <span className="font-medium">{time}</span>
                                    {formData.apttime === time && (
                                        <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center">
                                            <svg
                                                className="h-3 w-3 text-white"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </span>
                                    )}
                                    {isAdminDisabled && (
                                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-yellow-400 border border-yellow-500"></span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col justify-center items-center h-full text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <p className="mt-2 text-sm">
                            Please select a date first
                        </p>
                    </div>
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                    <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full bg-blue-600 mr-2"></span>
                        <span>Selected</span>
                    </div>
                    {(userRole === "Student" || userRole === "Guest") && (
                        <div className="flex items-center">
                            <span className="w-3 h-3 bg-gray-300 rounded-full mr-2"></span>
                            <span>Slot Reached</span>
                        </div>
                    )}
                    <div className="flex items-center">
                        <span className="w-3 h-3 bg-red-100 rounded mr-2"></span>
                        <span>Time Passed</span>
                    </div>
                    <div className="flex items-center">
                        <span className="w-3 h-3 bg-yellow-100 rounded mr-2"></span>
                        <span>Disabled</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimePicker;
