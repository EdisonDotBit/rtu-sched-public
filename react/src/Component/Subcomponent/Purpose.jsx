import { useEffect, useState } from "react";

const Purpose = ({ formData, setFormData }) => {
    // State to hold the list of dropdowns
    const [dropdowns, setDropdowns] = useState([{ id: 0 }]);

    // Options for the dropdown
    const [options, setOptions] = useState(["Select Purpose"]);

    useEffect(() => {
        if (formData.aptoffice === "MISO") {
            setOptions([
                "--Select Purpose--",
                "Option A Purpose 1",
                "Option A Purpose 2",
                "Option A Purpose 3",
            ]);
        } else if (formData.aptoffice === "EWQ") {
            setOptions([
                "--Select Purpose--",
                "Option B Purpose 1",
                "Option B Purpose 2",
                "Option B Purpose 3",
            ]);
        } else {
            setOptions(["--Select Purpose--"]);
        }
    }, [formData.aptoffice]);

    // Function to add a new dropdown
    const addDropdown = () => {
        if (dropdowns.length < 3) {
            setDropdowns([...dropdowns, { id: Date.now() }]);
        }
    };

    // Function to delete a dropdown
    const deleteDropdown = (id) => {
        const deletedDropdown = dropdowns.find(
            (dropdown) => dropdown.id === id
        );
        setDropdowns(dropdowns.filter((dropdown) => dropdown.id !== id));
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
            .filter((value) => value !== "--Select Purpose--")
            .join(", ");
        setFormData((prevFormData) => ({
            ...prevFormData,
            aptpurpose: newStringValue,
        }));
    };

    return (
        <div className="mx-auto w-full bg-transparent">
            <h1 className="text-white flex justify-center text-xl font-semibold mb-4">
                Purpose
            </h1>
            {dropdowns.map((dropdown, index) => (
                <div
                    key={dropdown.id}
                    className="text-gray-800 flex items-center mb-4 w-full"
                >
                    <select
                        className="bg-white py-2 px-3 border w-full rounded-md flex-grow bg-transparent"
                        value={dropdown.value || ""}
                        onChange={(e) => handleDropdownChange(e, index)}
                    >
                        {options.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                    <div className="ml-3 min-w-[90px] flex justify-center">
                        {index !== 0 && (
                            <button
                                onClick={() => deleteDropdown(dropdown.id)}
                                className="bg-red-500 text-white py-2 px-4 rounded-md"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                </div>
            ))}
            {dropdowns.length < 3 && (
                <button
                    type="button"
                    onClick={addDropdown}
                    className="flex justify-center bg-[#FFDB75] text-gray-900 font-medium py-2 px-4 rounded-md w-full"
                >
                    Add Purpose
                </button>
            )}
        </div>
    );
};

export default Purpose;
