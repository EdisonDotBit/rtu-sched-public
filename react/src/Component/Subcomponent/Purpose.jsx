import React, { useState } from "react";

const Purpose = () => {
    // State to hold the list of dropdowns
    const [dropdowns, setDropdowns] = useState([{ id: 0 }]);

    // Options for the dropdown
    const options = ["Option 1", "Option 2", "Option 3"];

    // Function to add a new dropdown
    const addDropdown = () => {
        if (dropdowns.length < 3) {
            setDropdowns([...dropdowns, { id: Date.now() }]);
        }
    };

    // Function to delete a dropdown
    const deleteDropdown = (id) => {
        setDropdowns(dropdowns.filter((dropdown) => dropdown.id !== id));
    };

    return (
        <div className="mx-auto max-w-xl p-4 w-96">
            <h1 className="flex justify-start text-3xl">Purpose</h1>
            {dropdowns.map((dropdown, index) => (
                <div
                    key={dropdown.id}
                    className="flex justify-start items-center mb-4"
                >
                    <select className="py-2 px-3 border rounded-md mr-2 w-2/3">
                        {options.map((option) => (
                            <option key={option}>{option}</option>
                        ))}
                    </select>
                    {index !== 0 && (
                        <button
                            onClick={() => deleteDropdown(dropdown.id)}
                            className="bg-red-500 text-white py-2 px-4 rounded-md"
                        >
                            Delete
                        </button>
                    )}
                </div>
            ))}
            {dropdowns.length < 3 && (
                <button
                    onClick={addDropdown}
                    className="flex justify-start bg-blue-500 text-white py-2 px-4 rounded-md w-1/3"
                >
                    Add Purpose
                </button>
            )}
        </div>
    );
};

export default Purpose;
