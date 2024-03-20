import React, { useState } from "react";

const Purpose = ({ formData, setFormData }) => {
    // State to hold the list of dropdowns
    const [dropdowns, setDropdowns] = useState([{ id: 0 }]);
    // State to hold the string value
    const [stringValue, setStringValue] = useState("");

    // Options for the dropdown
    const options = [
        "Select Purpose",
        "Printing of Documents",
        "ID Processing",
        "Transcript of Records",
        "Diploma",
        "Dismissal",
        "LOA",
    ];

    // Function to add a new dropdown
    const addDropdown = () => {
        if (dropdowns.length < 3) {
            setDropdowns([...dropdowns, { id: Date.now() }]);
        }
    };

    // Function to delete a dropdown
    const deleteDropdown = (id) => {
        // Find the value of the dropdown being deleted
        const deletedDropdown = dropdowns.find(
            (dropdown) => dropdown.id === id
        );
        // Remove the dropdown from the state
        setDropdowns(dropdowns.filter((dropdown) => dropdown.id !== id));
        // Remove the value of the deleted dropdown from the stored string
        setFormData.aptpurpose((prevValue) =>
            prevValue.replace(`${deletedDropdown.value}, `, "")
        );
    };

    // Function to handle dropdown change
    const handleDropdownChange = (e, index) => {
        const newValue = e.target.value;
        const updatedDropdowns = dropdowns.map((dropdown, i) =>
            i === index ? { ...dropdown, value: newValue } : dropdown
        );
        setDropdowns(updatedDropdowns);
        const newStringValue = updatedDropdowns
            .map((dropdown) => dropdown.value || "")
            .filter((value) => value !== "Select Purpose") // Exclude placeholder from the stored string
            .join(", ");
        setFormData((prevFormData) => ({
            ...prevFormData,
            aptpurpose: newStringValue,
        }));
    };

    return (
        <div className="mx-auto max-w-xl p-4 w-2/3 bg-transparent">
            <h1 className="flex justify-center text-3xl mb-5">Purpose</h1>
            {dropdowns.map((dropdown, index) => (
                <div
                    key={dropdown.id}
                    className="flex justify-start items-center mb-4 ml-5 text-black"
                >
                    <select
                        className="py-2 px-3 border rounded-md mr-2 w-4/6 bg-transparent"
                        value={dropdown.value || ""}
                        onChange={(e) => handleDropdownChange(e, index)}
                    >
                        {options.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
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
                    type="button"
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
