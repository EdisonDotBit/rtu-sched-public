import { useEffect, useState } from "react";

const Calendar = ({ formData, setFormData, limit }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const [aptData, setAptData] = useState([]);
    const [disabledDates, setDisabledDates] = useState([]);

    useEffect(() => {
        const getData = async () => {
            const getRes = await fetch(`${apiBaseUrl}/api/allongoing`);
            const getDataResult = await getRes.json();

            // Counting occurrences of each date for the specified aptoffice
            const dateCounts = {};
            getDataResult.forEach((item) => {
                const date = item.aptdate;
                if (item.aptoffice === formData.aptoffice) {
                    dateCounts[date] = (dateCounts[date] || 0) + 1;
                }
            });

            // Filtering dates that occur exactly three times for the specified aptoffice
            const datesToDisable = Object.keys(dateCounts).filter(
                (date) => dateCounts[date] >= limit
            );

            // Setting disabledDates state with filtered dates as an array
            setDisabledDates(datesToDisable);
        };

        getData();
    }, [formData]); // Trigger useEffect when formData.aptoffice changes

    const handleDateClick = (date) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            aptdate: `${currentDate.getFullYear()}-${
                currentDate.getMonth() + 1
            }-${date}`,
        }));
        console.log(formData.aptoffice);
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

    const isPastDate = (day) => {
        const selectedDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            day,
            23,
            59,
            59
        );

        // Check if selectedDate is in the past
        if (selectedDate < new Date()) {
            return true;
        }

        // Check if selectedDate is a disabled date
        const formattedDisabledDate = `${selectedDate.getFullYear()}-${(
            selectedDate.getMonth() + 1
        )
            .toString()
            .padStart(2, "0")}-${selectedDate
            .getDate()
            .toString()
            .padStart(2, "0")}`;

        if (disabledDates.includes(formattedDisabledDate)) {
            return true;
        }

        // Check if selectedDate is a weekend
        if (selectedDate.getDay() === 0 || selectedDate.getDay() === 6) {
            return true;
        }

        return false;
    };

    const getDaysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const renderCalendarDays = () => {
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        const totalDays = getDaysInMonth(currentMonth, currentYear);
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

        let calendarDays = [];

        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarDays.push(
                <td key={`empty-${i}`} className="border border-gray-200"></td>
            );
        }

        for (let day = 1; day <= totalDays; day++) {
            const currentDate = new Date(currentYear, currentMonth, day);
            let className = "border border-gray-200";

            if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
                className += " text-red-500";
            }

            if (
                formData.aptdate &&
                formData.aptdate ===
                    `${currentDate.getFullYear()}-${
                        currentDate.getMonth() + 1
                    }-${day}`
            ) {
                className += " bg-blue-600";
            }

            if (isPastDate(day)) {
                className += " pointer-events-none opacity-50";
            }

            calendarDays.push(
                <td key={day} className={className}>
                    <button
                        type="button"
                        onClick={() => handleDateClick(day)}
                        className={`w-full h-full p-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ${
                            currentDate.getDay() === 0 ||
                            currentDate.getDay() === 6
                                ? "pointer-events-none"
                                : ""
                        }`}
                        disabled={isPastDate(day)}
                    >
                        {day}
                    </button>
                </td>
            );
        }

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
    };

    return (
        <div className="mx-auto max-w-xl p-4 text-black">
            <div className="flex justify-between mb-4">
                <div>
                    <button
                        type="button"
                        onClick={handlePrevYear}
                        className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                    >
                        Previous
                    </button>
                </div>
                <div className="text-center">
                    <div className="mb-2 font-semibold">Year</div>
                    <div className="text-2xl">{currentDate.getFullYear()}</div>
                </div>
                <div>
                    <button
                        type="button"
                        onClick={handleNextYear}
                        className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                    >
                        Next
                    </button>
                </div>
            </div>
            <div className="flex justify-between mb-4">
                <div>
                    <button
                        type="button"
                        onClick={handlePrevMonth}
                        className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                    >
                        Previous
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
                        type="button"
                        onClick={handleNextMonth}
                        className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                    >
                        Next
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
