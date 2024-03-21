import React, { useState } from "react";

const TimePicker = ({ formData, setFormData }) => {
    const [selectedTime, setSelectedTime] = useState(null);
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
        "17:00",
    ];

    const handleTimeClick = (time) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            apttime: time,
        }));
        console.log(formData);
    };

    return (
        <div className="container w-full mx-auto max-w-md p-4 text-black">
            <h2 className="text-2xl font-semibold mb-4">Select a Time</h2>
            <div className="grid grid-cols-5 gap-4">
                {timeSlots.map((time, index) => (
                    <button
                        type="button"
                        key={index}
                        onClick={() => handleTimeClick(time)}
                        className={`flex justify-center items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors ${
                            formData.apttime === time
                                ? "bg-blue-600 text-white"
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
