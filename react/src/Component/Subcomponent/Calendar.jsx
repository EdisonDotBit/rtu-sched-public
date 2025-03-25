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
    const [disabledDates, setDisabledDates] = useState([]); // For holidays and appointment-limited dates
    const [manuallyDisabledDates, setManuallyDisabledDates] = useState([]); // For manually disabled dates
    const [isLoading, setIsLoading] = useState(true);

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    // Fetch holidays and appointment-limited dates
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            // Fetch holidays
            const holidays = await fetchHolidays(currentYear);
            const holidayDates = holidays.map(
                (holiday) =>
                    holiday.start.date || holiday.start.dateTime.slice(0, 10)
            );

            // Count appointments for the current office
            const counts = {};
            appointments.forEach((item) => {
                const date = item.aptdate;
                if (item.aptoffice === formData.aptoffice) {
                    counts[date] = (counts[date] || 0) + 1;
                }
            });

            // Disable dates where the appointment count exceeds the limit
            const datesToDisable = Object.keys(counts).filter(
                (date) => counts[date] >= limit
            );

            // Combine holidays and appointment-limited dates
            setDisabledDates((prevDisabledDates) => {
                return Array.from(
                    new Set([...holidayDates, ...datesToDisable])
                );
            });

            setIsLoading(false);
        };

        fetchData();
    }, [formData.aptoffice, limit, currentYear]); // Removed `appointments` from dependencies

    // Fetch manually disabled dates from the backend API
    useEffect(() => {
        const fetchDisabledDates = async () => {
            if (!formData.aptoffice || !formData.aptbranch) return;
            try {
                const endpoint = `${apiBaseUrl}/api/office/disabled-dates/${formData.aptoffice}/${formData.aptbranch}`;
                const res = await fetch(endpoint);
                if (!res.ok) throw new Error(res.statusText);
                const data = await res.json();
                const fetchedDates = data.map((item) => item.date);
                setManuallyDisabledDates(fetchedDates); // Store manually disabled dates separately
            } catch (error) {
                console.error("Error fetching disabled dates:", error);
            }
        };

        fetchDisabledDates();
    }, [apiBaseUrl, formData.aptoffice, formData.aptbranch]);

    // Handle date selection
    const handleDateClick = useCallback(
        (day) => {
            const formattedDate = `${currentYear}-${(currentMonth + 1)
                .toString()
                .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

            // Prevent selection if the date is disabled for non-admin users
            if (
                (userRole === "Student" || userRole === "Guest") &&
                (disabledDates.includes(formattedDate) ||
                    manuallyDisabledDates.includes(formattedDate))
            ) {
                return;
            }

            setFormData((prevFormData) => ({
                ...prevFormData,
                aptdate: formattedDate,
                apttime: "",
            }));

            setIsTimeSelected(false);
        },
        [
            currentYear,
            currentMonth,
            userRole,
            disabledDates,
            manuallyDisabledDates,
            setFormData,
            setIsTimeSelected,
        ]
    );

    // Navigation handlers
    const handlePrevYear = useCallback(() => {
        setCurrentDate(
            (prevDate) =>
                new Date(prevDate.getFullYear() - 1, prevDate.getMonth())
        );
    }, []);

    const handleNextYear = useCallback(() => {
        setCurrentDate(
            (prevDate) =>
                new Date(prevDate.getFullYear() + 1, prevDate.getMonth())
        );
    }, []);

    const handlePrevMonth = useCallback(() => {
        setCurrentDate(
            (prevDate) =>
                new Date(prevDate.getFullYear(), prevDate.getMonth() - 1)
        );
    }, []);

    const handleNextMonth = useCallback(() => {
        setCurrentDate(
            (prevDate) =>
                new Date(prevDate.getFullYear(), prevDate.getMonth() + 1)
        );
    }, []);

    // Check if a date is disabled
    const isPastDate = useCallback(
        (day) => {
            const selectedDate = new Date(
                currentYear,
                currentMonth,
                day,
                23,
                59,
                59
            );

            // Disable past dates
            if (selectedDate < new Date()) return true;

            // Disable weekends
            if (selectedDate.getDay() === 0 || selectedDate.getDay() === 6)
                return true;

            // Disable holidays and appointment-limited dates for all users
            const formatted = `${selectedDate.getFullYear()}-${(
                selectedDate.getMonth() + 1
            )
                .toString()
                .padStart(2, "0")}-${selectedDate
                .getDate()
                .toString()
                .padStart(2, "0")}`;

            if (disabledDates.includes(formatted)) return true;

            // Disable manually disabled dates for non-admin users only
            if (
                (userRole === "Student" || userRole === "Guest") &&
                manuallyDisabledDates.includes(formatted)
            ) {
                return true;
            }

            return false;
        },
        [
            currentYear,
            currentMonth,
            userRole,
            disabledDates,
            manuallyDisabledDates,
        ]
    );

    // Get the number of days in the current month
    const getDaysInMonth = useCallback((month, year) => {
        return new Date(year, month + 1, 0).getDate();
    }, []);

    // Render the calendar days
    const renderCalendarDays = useMemo(() => {
        const totalDays = getDaysInMonth(currentMonth, currentYear);
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

        let calendarDays = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarDays.push(
                <td
                    key={`empty-${i}`}
                    className="border border-gray-200 h-4"
                ></td>
            );
        }

        // Add days of the month
        for (let day = 1; day <= totalDays; day++) {
            const formattedDate = `${currentYear}-${(currentMonth + 1)
                .toString()
                .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

            let className =
                "border border-gray-200 text-center transition-colors duration-200 h-10";

            // Style weekends
            if (
                new Date(currentYear, currentMonth, day).getDay() === 0 ||
                new Date(currentYear, currentMonth, day).getDay() === 6
            ) {
                className += " text-red-500";
            }

            // Style selected date
            if (formData.aptdate === formattedDate) {
                className += " bg-blue-600 text-white";
            }

            // Disable past dates and weekends
            if (isPastDate(day)) {
                className += " pointer-events-none opacity-50";
            }

            // Style manually disabled dates for non-admin users
            if (manuallyDisabledDates.includes(formattedDate)) {
                if (userRole === "Student" || userRole === "Guest") {
                    className +=
                        " bg-gray-300 text-gray-500 pointer-events-none cursor-not-allowed";
                } else {
                    className += " bg-yellow-300 text-gray-900";
                }
            }

            calendarDays.push(
                <td key={day} className={className}>
                    <button
                        type="button"
                        onClick={() => handleDateClick(day)}
                        className="w-full h-full focus:outline-none hover:bg-blue-100"
                        disabled={isPastDate(day)}
                    >
                        {day}
                    </button>
                </td>
            );
        }

        // Fill remaining cells to complete the calendar grid
        while (calendarDays.length < 42) {
            calendarDays.push(
                <td
                    key={`empty-${calendarDays.length}`}
                    className="border border-gray-200 h-10"
                ></td>
            );
        }

        // Split calendar days into rows
        const rows = [];
        let cells = [];

        calendarDays.forEach((day, index) => {
            if (index % 7 !== 0) {
                cells.push(day);
            } else {
                rows.push(cells);
                cells = [];
                cells.push(day);
            }
            if (index === calendarDays.length - 1) {
                rows.push(cells);
            }
        });

        return rows.map((row, index) => (
            <tr key={index} className="border border-gray-200">
                {row}
            </tr>
        ));
    }, [
        currentYear,
        currentMonth,
        formData.aptdate,
        isPastDate,
        disabledDates,
        manuallyDisabledDates,
        userRole,
        handleDateClick,
    ]);

    return (
        <div className="mx-auto w-full max-w-xl p-2 sm:p-3 md:p-4 text-black">
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    {/* Year Navigation */}
                    <div className="flex justify-between items-center mb-2 sm:mb-3 md:mb-4 gap-1 sm:gap-3 md:gap-4">
                        <button
                            type="button"
                            onClick={handlePrevYear}
                            className="bg-[#194F90] hover:bg-[#123A69] text-white px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-lg transition-colors duration-200 text-xs sm:text-sm md:text-base"
                        >
                            <span className="hidden sm:inline">Previous</span>
                            <span className="sm:hidden">Prev</span>
                        </button>
                        <div className="text-center">
                            <div className="mb-0 sm:mb-1 md:mb-2 font-semibold text-xs sm:text-sm md:text-lg">
                                Year
                            </div>
                            <div className="text-sm sm:text-xl md:text-2xl font-bold">
                                {currentYear}
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleNextYear}
                            className="bg-[#194F90] hover:bg-[#123A69] text-white px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-lg transition-colors duration-200 text-xs sm:text-sm md:text-base"
                        >
                            <span className="hidden sm:inline">Next</span>
                            <span className="sm:hidden">Next</span>
                        </button>
                    </div>

                    {/* Month Navigation */}
                    <div className="flex justify-between items-center mb-2 sm:mb-3 md:mb-4 gap-1 sm:gap-3 md:gap-4">
                        <button
                            type="button"
                            onClick={handlePrevMonth}
                            className="bg-[#194F90] hover:bg-[#123A69] text-white px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-lg transition-colors duration-200 text-xs sm:text-sm md:text-base"
                        >
                            <span className="hidden sm:inline">Previous</span>
                            <span className="sm:hidden">Prev</span>
                        </button>
                        <div className="text-center">
                            <div className="mb-0 sm:mb-1 md:mb-2 font-semibold text-xs sm:text-sm md:text-lg">
                                Month
                            </div>
                            <div className="text-sm sm:text-xl md:text-2xl font-bold">
                                {currentDate.toLocaleString("default", {
                                    month: "long",
                                })}
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleNextMonth}
                            className="bg-[#194F90] hover:bg-[#123A69] text-white px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-lg transition-colors duration-200 text-xs sm:text-sm md:text-base"
                        >
                            <span className="hidden sm:inline">Next</span>
                            <span className="sm:hidden">Next</span>
                        </button>
                    </div>

                    {/* Calendar Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs sm:text-sm md:text-base">
                            <thead>
                                <tr className="bg-[#194F90] text-white">
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
                                            className="p-1 sm:p-2 border-r-2 border-r-white text-xs sm:text-sm"
                                        >
                                            {day.substring(0, 3)}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {renderCalendarDays}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default Calendar;
