import React, { useState } from "react";

const Calendar = ({ setSelectedDate, selectedDate }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const handleDateClick = (date) => {
        setSelectedDate(
            `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${date}`
        );
    };

    const handlePrevYear = () => {
        setCurrentDate(
            (prevDate) =>
                new Date(prevDate.getFullYear() - 1, prevDate.getMonth())
        );
    };

    const handleNextYear = () => {
        setCurrentDate(
            (prevDate) =>
                new Date(prevDate.getFullYear() + 1, prevDate.getMonth())
        );
    };

    const handlePrevMonth = () => {
        setCurrentDate(
            (prevDate) =>
                new Date(prevDate.getFullYear(), prevDate.getMonth() - 1)
        );
    };

    const handleNextMonth = () => {
        setCurrentDate(
            (prevDate) =>
                new Date(prevDate.getFullYear(), prevDate.getMonth() + 1)
        );
    };

    // Function to get the number of days in a given month
    const getDaysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // Function to render calendar days in a table format
    const renderCalendarDays = () => {
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        const totalDays = getDaysInMonth(currentMonth, currentYear);
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

        let calendarDays = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarDays.push(
                <td key={`empty-${i}`} className="border border-gray-200"></td>
            );
        }

        // Add days of the month
        for (let day = 1; day <= totalDays; day++) {
            const currentDate = new Date(currentYear, currentMonth, day);
            let className = "border border-gray-200";

            // Check if the current day is a Saturday or Sunday
            if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
                className += " text-red-500"; // Add red color
            }

            // Add a class to highlight the clicked date
            if (
                selectedDate &&
                selectedDate ===
                    `${currentDate.getFullYear()}-${
                        currentDate.getMonth() + 1
                    }-${day}`
            ) {
                className += " bg-blue-200"; // Change background color to blue
            }

            calendarDays.push(
                <td key={day} className={className}>
                    <button
                        onClick={() => handleDateClick(day)}
                        className={`w-full h-full p-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ${
                            currentDate.getDay() === 0 ||
                            currentDate.getDay() === 6
                                ? "pointer-events-none"
                                : ""
                        }`}
                    >
                        {day}
                    </button>
                </td>
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

        // Render calendar table
        return rows.map((row, index) => (
            <tr key={index} className="border border-gray-200">
                {row}
            </tr>
        ));
    };

    return (
        <div className="mx-auto max-w-xl p-4">
            <div className="flex justify-between mb-4">
                <div>
                    <button
                        onClick={handlePrevYear}
                        className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                    >
                        Previous Year
                    </button>
                </div>
                <div className="text-center">
                    <div className="mb-2 font-semibold">Year</div>
                    <div className="text-2xl">{currentDate.getFullYear()}</div>
                </div>
                <div>
                    <button
                        onClick={handleNextYear}
                        className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                    >
                        Next Year
                    </button>
                </div>
            </div>
            <div className="flex justify-between mb-4">
                <div>
                    <button
                        onClick={handlePrevMonth}
                        className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                    >
                        Previous Month
                    </button>
                </div>
                <div className="text-center">
                    <div className="mb-2 font-semibold">Month</div>
                    <div className="text-2xl">
                        {currentDate.toLocaleString("default", {
                            month: "long",
                        })}
                    </div>
                </div>
                <div>
                    <button
                        onClick={handleNextMonth}
                        className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                    >
                        Next Month
                    </button>
                </div>
            </div>
            <table className="w-full">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-200 p-2">Sun</th>
                        <th className="border border-gray-200 p-2">Mon</th>
                        <th className="border border-gray-200 p-2">Tue</th>
                        <th className="border border-gray-200 p-2">Wed</th>
                        <th className="border border-gray-200 p-2">Thu</th>
                        <th className="border border-gray-200 p-2">Fri</th>
                        <th className="border border-gray-200 p-2">Sat</th>
                    </tr>
                </thead>
                <tbody>{renderCalendarDays()}</tbody>
            </table>
        </div>
    );
};

export default Calendar;
