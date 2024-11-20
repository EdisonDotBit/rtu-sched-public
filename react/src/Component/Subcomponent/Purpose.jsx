import { useEffect, useState } from "react";

const Purpose = ({ formData, setFormData }) => {
    // State to hold the list of dropdowns
    const [dropdowns, setDropdowns] = useState([{ id: 0, value: "" }]);
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    // Options for the dropdown
    const [options, setOptions] = useState([]);

    // Initialize dropdowns from formData when the component mounts
    useEffect(() => {
        if (formData.aptpurpose) {
            const initialDropdowns = formData.aptpurpose
                .split(", ")
                .map((value, index) => ({
                    id: index,
                    value,
                }));
            setDropdowns(initialDropdowns);
        }
    }, [formData.aptpurpose]);

    useEffect(() => {
        const fetchPurposes = async () => {
            try {
                const response = await fetch(
                    `${apiBaseUrl}/api/office/purposes/${formData.aptoffice}`
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json(); // Directly parse JSON
                setOptions(data);
            } catch (error) {
                console.error("Error fetching purposes:", error);
            }
        };
        fetchPurposes();
    }, [formData.aptoffice]);

    // Function to add a new dropdown
    const addDropdown = () => {
        if (dropdowns.length < 3) {
            setDropdowns([...dropdowns, { id: Date.now(), value: "" }]);
        }
    };

    // Function to delete a dropdown
    const deleteDropdown = (id) => {
        const filteredDropdowns = dropdowns.filter(
            (dropdown) => dropdown.id !== id
        );
        const newStringValue = filteredDropdowns
            .map((dropdown) => dropdown.value || "")
            .join(", ");
        setDropdowns(filteredDropdowns);
        setFormData((prevFormData) => ({
            ...prevFormData,
            aptpurpose: newStringValue,
        }));
    };

    // Function to handle dropdown change
    const handleDropdownChange = (e, index) => {
        const newValue = e.target.value;
        const updatedDropdowns = dropdowns.map((dropdown, i) =>
            i === index ? { ...dropdown, value: newValue } : dropdown
        );
        setDropdowns(updatedDropdowns);

        // Update formData to store all selected dropdown values
        const newStringValue = updatedDropdowns
            .map((dropdown) => dropdown.value || "")
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
                        className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75]"
                        value={dropdown.value || ""}
                        onChange={(e) => handleDropdownChange(e, index)}
                    >
                        <option value="" disabled selected>
                            --Select Purpose--
                        </option>
                        {options.map((option, i) => (
                            <option key={i} value={option}>
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
