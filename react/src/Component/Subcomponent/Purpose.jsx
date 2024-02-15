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
        <div className="mx-auto max-w-xl p-4 w-2/3">
            <h1 className="flex justify-center text-3xl mb-5">Purpose</h1>
            {dropdowns.map((dropdown, index) => (
                <div
                    key={dropdown.id}
                    className="flex justify-start items-center mb-4 ml-5"
                >
                    <select className="py-2 px-3 border rounded-md mr-2 w-4/6">
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
                    className="flex justify-center bg-blue-500 text-white py-2 px-4 rounded-md w-2/3 ml-5"
                >
                    Add Purpose
                </button>
            )}
        </div>
    );
};

export default Purpose;
