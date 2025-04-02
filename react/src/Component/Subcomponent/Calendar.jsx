import { useEffect, useState, useMemo, useCallback } from "react";
import Loading from "./Loading";
import { fetchHolidays } from "../../../../resources/js/fetchHolidays";

const Calendar = ({
    formData,
    setFormData,
    limit,
    appointments,
    userRole,
    setIsTimeSelected,
}) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const [holidayDates, setHolidayDates] = useState([]);
    const [manuallyDisabledDates, setManuallyDisabledDates] = useState([]);
    const [datesAtLimit, setDatesAtLimit] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    // Fetch holidays and appointment-limited dates
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const holidays = await fetchHolidays(currentYear);
            const holidayDates = holidays.map(
                (holiday) =>
                    holiday.start.date || holiday.start.dateTime.slice(0, 10)
            );

            const counts = {};
            appointments.forEach((item) => {
                const date = item.aptdate;
                if (item.aptoffice === formData.aptoffice) {
                    counts[date] = (counts[date] || 0) + 1;
                }
            });

            const datesAtLimit = Object.keys(counts).filter(
                (date) => counts[date] >= limit
            );

            setHolidayDates(holidayDates);
            setDatesAtLimit(datesAtLimit);
            setIsLoading(false);
        };

        fetchData();
    }, [formData.aptoffice, limit, currentYear, appointments]);

    // Fetch manually disabled dates
    useEffect(() => {
        const fetchDisabledDates = async () => {
            if (!formData.aptoffice || !formData.aptbranch) return;
            try {
                const endpoint = `${apiBaseUrl}/api/office/disabled-dates/${formData.aptoffice}/${formData.aptbranch}`;
                const res = await fetch(endpoint);
                if (!res.ok) throw new Error(res.statusText);
                const data = await res.json();
                setManuallyDisabledDates(data.map((item) => item.date));
            } catch (error) {
                console.error("Error fetching disabled dates:", error);
            }
        };

        fetchDisabledDates();
    }, [apiBaseUrl, formData.aptoffice, formData.aptbranch]);

    // Navigation handlers
    const handlePrevMonth = useCallback(() => {
        const prevMonth = new Date(currentYear, currentMonth - 1);
        if (
            prevMonth >=
            new Date(new Date().getFullYear(), new Date().getMonth())
        ) {
            setCurrentDate(prevMonth);
        }
    }, [currentYear, currentMonth]);

    const handleNextMonth = useCallback(() => {
        const nextMonth = new Date(currentYear, currentMonth + 1);
        if (
            nextMonth <=
            new Date(new Date().getFullYear(), new Date().getMonth() + 1)
        ) {
            setCurrentDate(nextMonth);
        }
    }, [currentYear, currentMonth]);

    // Check if a date is disabled
    const getIsDateDisabled = useCallback(
        (day, formattedDate) => {
            const selectedDate = new Date(
                currentYear,
                currentMonth,
                day,
                23,
                59,
                59
            );
            const today = new Date();
            const tomorrow = new Date();
            tomorrow.setDate(today.getDate() + 1);
            tomorrow.setHours(23, 59, 59, 0);

            // Past dates
            if (selectedDate < today) return true;

            // Today + tomorrow for Students/Guests
            if (
                (userRole === "Student" || userRole === "Guest") &&
                selectedDate <= tomorrow
            ) {
                return true;
            }

            // Weekends
            if (selectedDate.getDay() === 0 || selectedDate.getDay() === 6)
                return true;

            // Holidays
            if (holidayDates.includes(formattedDate)) return true;

            // Dates at limit
            if (datesAtLimit.includes(formattedDate)) return true;

            // Manually disabled dates only for non-admin users
            if (
                (userRole === "Student" || userRole === "Guest") &&
                manuallyDisabledDates.includes(formattedDate)
            ) {
                return true;
            }

            return false;
        },
        [
            currentYear,
            currentMonth,
            userRole,
            holidayDates,
            datesAtLimit,
            manuallyDisabledDates,
        ]
    );

    // Handle date selection
    const handleDateClick = useCallback(
        (day) => {
            const formattedDate = `${currentYear}-${(currentMonth + 1)
                .toString()
                .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

            const isDisabled = getIsDateDisabled(day, formattedDate);

            if (
                (userRole === "Student" || userRole === "Guest") &&
                (isDisabled || manuallyDisabledDates.includes(formattedDate))
            ) {
                return;
            }

            setFormData((prev) => ({
                ...prev,
                aptdate: formattedDate,
                apttime: "",
            }));
            setIsTimeSelected(false);
        },
        [
            currentYear,
            currentMonth,
            userRole,
            getIsDateDisabled,
            manuallyDisabledDates,
            setFormData,
            setIsTimeSelected,
        ]
    );

    const renderCalendarDays = useMemo(() => {
        const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        const today = new Date();
        const isCurrentMonth =
            currentYear === today.getFullYear() &&
            currentMonth === today.getMonth();

        let calendarDays = [];

        // Empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarDays.push(<td key={`empty-${i}`} className="h-10"></td>);
        }

        // Days of the month
        for (let day = 1; day <= totalDays; day++) {
            const formattedDate = `${currentYear}-${(currentMonth + 1)
                .toString()
                .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

            const isDisabled = getIsDateDisabled(day, formattedDate);
            const isSelected = formData.aptdate === formattedDate;
            const isToday = isCurrentMonth && day === today.getDate();
            const isWeekend =
                new Date(currentYear, currentMonth, day).getDay() % 6 === 0;
            const isHoliday = holidayDates.includes(formattedDate);
            const isManuallyDisabled =
                manuallyDisabledDates.includes(formattedDate);
            const isAtLimit = datesAtLimit.includes(formattedDate);

            let className =
                "h-10 w-10 rounded-full text-center transition-colors duration-200 focus:outline-none";

            if (isSelected) {
                className += " bg-blue-600 text-white";
            } else if (isToday) {
                className += " border-2 border-blue-500";
            }

            if (isManuallyDisabled) {
                className +=
                    " bg-yellow-100 hover:bg-yellow-300 focus:bg-yellow-300 focus:text-black";
            }

            if (isAtLimit) {
                className += " bg-purple-100";
            }

            if (isHoliday) {
                className += " bg-red-100";
            }

            if (isWeekend && !isDisabled) {
                className += " text-red-500";
            }

            if (isDisabled) {
                className += " cursor-not-allowed opacity-50";
            } else {
                className += " hover:bg-blue-300";
            }

            const shouldDisableButton =
                isDisabled ||
                ((userRole === "Student" || userRole === "Guest") &&
                    isManuallyDisabled);

            calendarDays.push(
                <td key={day} className="p-1">
                    <button
                        type="button"
                        onClick={() => handleDateClick(day)}
                        disabled={shouldDisableButton}
                        className={className}
                    >
                        {day}
                    </button>
                </td>
            );
        }

        // Split into weeks
        const weeks = [];
        for (let i = 0; i < calendarDays.length; i += 7) {
            weeks.push(calendarDays.slice(i, i + 7));
        }

        return weeks.map((week, index) => (
            <tr key={index} className="h-10">
                {week}
            </tr>
        ));
    }, [
        currentYear,
        currentMonth,
        formData.aptdate,
        getIsDateDisabled,
        holidayDates,
        datesAtLimit,
        manuallyDisabledDates,
        handleDateClick,
        userRole,
    ]);

    // Navigation button states
    const isPrevMonthDisabled =
        new Date(currentYear, currentMonth - 1) <
        new Date(new Date().getFullYear(), new Date().getMonth());
    const isNextMonthDisabled =
        new Date(currentYear, currentMonth + 1) >
        new Date(new Date().getFullYear(), new Date().getMonth() + 1);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 w-full h-[520px] flex flex-col">
            {isLoading ? (
                <div className="flex justify-center items-center flex-grow">
                    <Loading />
                </div>
            ) : (
                <>
                    {/* Month Navigation */}
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={handlePrevMonth}
                            disabled={isPrevMonthDisabled}
                            className={`flex items-center justify-center p-2 rounded-lg ${
                                isPrevMonthDisabled
                                    ? "text-gray-400 cursor-not-allowed"
                                    : "text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>
                        <h3 className="text-lg font-semibold text-gray-800">
                            {currentDate.toLocaleString("default", {
                                month: "long",
                                year: "numeric",
                            })}
                        </h3>
                        <button
                            onClick={handleNextMonth}
                            disabled={isNextMonthDisabled}
                            className={`flex items-center justify-center p-2 rounded-lg ${
                                isNextMonthDisabled
                                    ? "text-gray-400 cursor-not-allowed"
                                    : "text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Calendar Grid */}
                    <div className="overflow-x-auto flex-grow">
                        <table className="w-full">
                            <thead>
                                <tr className="text-gray-500 text-sm">
                                    {[
                                        "Sun",
                                        "Mon",
                                        "Tue",
                                        "Wed",
                                        "Thu",
                                        "Fri",
                                        "Sat",
                                    ].map((day) => (
                                        <th
                                            key={day}
                                            className="pb-2 font-medium"
                                        >
                                            {day}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="text-gray-700">
                                {renderCalendarDays}
                            </tbody>
                        </table>
                    </div>

                    {/* Legend */}
                    <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-600">
                        <div className="flex items-center">
                            <span className="w-3 h-3 rounded-full bg-blue-600 mr-2"></span>
                            <span>Selected</span>
                        </div>
                        <div className="flex items-center">
                            <span className="w-3 h-3 border-2 border-blue-500 rounded-full mr-2"></span>
                            <span>Today</span>
                        </div>

                        {(userRole === "Student" || userRole === "Guest") && (
                            <div className="flex items-center">
                                <span className="w-3 h-3 bg-purple-100 rounded-full mr-2"></span>
                                <span>Slot Reached</span>
                            </div>
                        )}

                        <div className="flex items-center">
                            <span className="w-3 h-3 bg-red-100 rounded-full mr-2"></span>
                            <span>Holiday</span>
                        </div>

                        <div className="flex items-center">
                            <span className="w-3 h-3 bg-yellow-100 rounded-full mr-2"></span>
                            <span>Disabled</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Calendar;
