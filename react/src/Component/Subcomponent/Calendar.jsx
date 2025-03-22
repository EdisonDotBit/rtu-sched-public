import { useEffect, useState } from "react";
import Loading from "./Loading";
import { useDebouncedEffect } from "../../Hooks/useDebouncedEffect";

const Calendar = ({ formData, setFormData, limit, appointments, userRole }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const [disabledDates, setDisabledDates] = useState([
        // Holidays
        "2024-01-01",
        "2024-03-28",
        "2024-03-29",
        "2024-04-09",
        "2024-05-01",
        "2024-06-12",
        "2024-08-26",
        "2024-11-30",
        "2024-12-25",
        "2024-12-30",
    ]);
    const [isLoading, setIsLoading] = useState(true);
    const [rerender, setRerender] = useState(false);

    useEffect(() => {
        const getData = async () => {
            setIsLoading(true);

            const counts = {};
            appointments.forEach((item) => {
                const date = item.aptdate;
                if (item.aptoffice === formData.aptoffice) {
                    counts[date] = (counts[date] || 0) + 1;
                }
            });

            const datesToDisable = Object.keys(counts).filter(
                (date) => counts[date] >= limit
            );

            setDisabledDates((prevDisabledDates) => {
                return Array.from(
                    new Set([...prevDisabledDates, ...datesToDisable])
                );
            });
            setIsLoading(false);
        };

        getData();
    }, [formData.aptoffice]);

    useEffect(() => {
        const fetchDisabledDates = async () => {
            if (!formData.aptoffice || !formData.aptbranch) return;
            try {
                const endpoint = `${apiBaseUrl}/api/office/disabled-dates/${formData.aptoffice}/${formData.aptbranch}`;
                console.log("Fetching disabled dates from:", endpoint);
                const res = await fetch(endpoint);
                if (!res.ok) {
                    throw new Error(res.statusText);
                }
                const data = await res.json();
                console.log("Fetched disabled dates:", data);

                const fetchedDates = data.map((item) => item.date);
                setDisabledDates((prev) =>
                    Array.from(new Set([...prev, ...fetchedDates]))
                );
            } catch (error) {
                console.error("Error fetching disabled dates:", error);
            }
        };
        fetchDisabledDates();
    }, [apiBaseUrl, formData.aptoffice, formData.aptbranch]);

    const handleDateClick = (day) => {
        // Create a formatted date string (YYYY-MM-DD)
        const formattedDate = `${currentDate.getFullYear()}-${(
            currentDate.getMonth() + 1
        )
            .toString()
            .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

        console.log("Clicked date:", formattedDate);

        if (
            userRole === "Student" ||
            (userRole === "Guest" && disabledDates.includes(formattedDate))
        ) {
            return;
        }

        // Reset the selected time when changing the date
        setFormData((prevFormData) => ({
            ...prevFormData,
            aptdate: formattedDate,
            apttime: "",
        }));
        console.log(limit);
        setRerender((prev) => !prev);
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

        // Check if the selected date is in the past.
        if (selectedDate < new Date()) {
            return true;
        }

        // Always disable weekends, regardless of role.
        if (selectedDate.getDay() === 0 || selectedDate.getDay() === 6) {
            return true;
        }

        // For students only:
        if (userRole === "Student") {
            const formatted = `${selectedDate.getFullYear()}-${(
                selectedDate.getMonth() + 1
            )
                .toString()
                .padStart(2, "0")}-${selectedDate
                .getDate()
                .toString()
                .padStart(2, "0")}`;
            if (disabledDates.includes(formatted)) {
                return true;
            }
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
            const formattedDate = `${currentYear}-${(currentMonth + 1)
                .toString()
                .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

            let className = "border border-gray-200";

            if (
                new Date(currentYear, currentMonth, day).getDay() === 0 ||
                new Date(currentYear, currentMonth, day).getDay() === 6
            ) {
                className += " text-red-500";
            }

            if (formData.aptdate === formattedDate) {
                className += " bg-blue-600 text-white";
            }

            if (isPastDate(day)) {
                className += " pointer-events-none opacity-50";
            }

            if (disabledDates.includes(formattedDate)) {
                if (userRole === "Student" || userRole === "Guest") {
                    className +=
                        " bg-gray-300 text-gray-500 pointer-events-none cursor-not-allowed"; // Disabled for students
                } else {
                    className += " bg-yellow-300 text-gray-900"; // Highlighted but still clickable for admins
                }
            }

            calendarDays.push(
                <td key={day} className={className}>
                    <button
                        type="button"
                        onClick={() => handleDateClick(day)}
                        className="w-full h-full p-2 focus:outline-none"
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
        <div className="mx-auto max-w-xl p-4 text-black xsm:w-full sm:w-full">
            {isLoading ? ( // Display loading text if isLoading is true
                <div>
                    <Loading />
                </div>
            ) : (
                <>
                    <div className="flex justify-between mb-4">
                        <div>
                            <button
                                type="button"
                                onClick={handlePrevYear}
                                className=" bg-[#194F90] hover:bg-[#123A69] text-white  px-2 py-1 rounded xsm:text-xs sm:text-base"
                            >
                                Previous
                            </button>
                        </div>
                        <div className="text-center">
                            <div className="mb-2 font-semibold">Year</div>
                            <div className="text-2xl">
                                {currentDate.getFullYear()}
                            </div>
                        </div>
                        <div>
                            <button
                                type="button"
                                onClick={handleNextYear}
                                className=" bg-[#194F90] hover:bg-[#123A69] text-white  px-5 py-1 rounded xsm:text-xs sm:text-base"
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
                                className=" bg-[#194F90] hover:bg-[#123A69] text-white px-2 py-1 rounded xsm:text-xs sm:text-base"
                            >
                                Previous
                            </button>
                        </div>
                        <div className="text-center">
                            <div className="mb-2 font-semibold">Month</div>
                            <div className="text-2xl">
                                {currentDate
                                    .toLocaleString("default", {
                                        month: "long",
                                    })
                                    .padStart(2, "0")}
                            </div>
                        </div>
                        <div>
                            <button
                                type="button"
                                onClick={handleNextMonth}
                                className=" bg-[#194F90] hover:bg-[#123A69] text-white  px-5 py-1 rounded xsm:text-xs sm:text-base"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                    <table className="xsm:w-full xsm:text-xs sm:w-full sm:text-base">
                        <thead>
                            <tr className="bg-[#194F90]">
                                <th className="text-white border-r-2 border-r-white p-2">
                                    Sun
                                </th>
                                <th className="text-white border-r-2 border-r-white p-2">
                                    Mon
                                </th>
                                <th className="text-white border-r-2 border-r-white p-2">
                                    Tue
                                </th>
                                <th className="text-white border-r-2 border-r-white p-2">
                                    Wed
                                </th>
                                <th className="text-white border-r-2 border-r-white p-2">
                                    Thu
                                </th>
                                <th className="text-white border-r-2 border-r-white p-2">
                                    Fri
                                </th>
                                <th className="text-white p-2">Sat</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {renderCalendarDays()}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default Calendar;
