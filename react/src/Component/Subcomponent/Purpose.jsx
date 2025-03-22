import { useEffect, useState } from "react";

const Purpose = ({ formData, setFormData, errors }) => {
    const [dropdowns, setDropdowns] = useState([{ id: 0, value: "" }]); // Track dropdowns
    const [showOtherInput, setShowOtherInput] = useState(false); // Track "Other" visibility
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    const [options, setOptions] = useState([]); // Dropdown options

    const [touched, setTouched] = useState({
        aptother: false,
    });

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched((prevState) => ({
            ...prevState,
            [name]: true,
        }));
    };

    useEffect(() => {
        if (formData.aptpurpose) {
            const initialDropdowns = formData.aptpurpose
                .split(", ")
                .map((value, index) => ({
                    id: index,
                    value,
                }));
            setDropdowns(initialDropdowns);

            // Check if "Other" was previously selected
            const hasOther = initialDropdowns.some(
                (dropdown) =>
                    dropdown.value.toLowerCase() === "other" ||
                    dropdown.value.toLowerCase() === "others"
            );
            setShowOtherInput(hasOther); // Restore "Other" field visibility
        }
    }, [formData.aptpurpose]);

    useEffect(() => {
        const fetchPurposes = async () => {
            if (!formData.aptoffice || !formData.aptbranch) return;

            try {
                const response = await fetch(
                    `${apiBaseUrl}/api/office/purposes/${formData.aptoffice}/${formData.aptbranch}`
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setOptions(data);
            } catch (error) {
                console.error("Error fetching purposes:", error);
            }
        };
        fetchPurposes();
    }, [formData.aptoffice, formData.aptbranch]);

    const addDropdown = () => {
        if (dropdowns.length < 3) {
            setDropdowns([...dropdowns, { id: Date.now(), value: "" }]);
        }
    };

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
            aptother: showOtherInput ? prevFormData.aptother : "", // Reset aptother if Other is removed
        }));

        // Check if "Other" is still selected in any dropdown
        const hasOther = filteredDropdowns.some(
            (dropdown) =>
                dropdown.value.toLowerCase() === "other" ||
                dropdown.value.toLowerCase() === "others"
        );
        setShowOtherInput(hasOther);
    };

    const handleDropdownChange = (e, index) => {
        const newValue = e.target.value;
        const updatedDropdowns = dropdowns.map((dropdown, i) =>
            i === index ? { ...dropdown, value: newValue } : dropdown
        );
        setDropdowns(updatedDropdowns);

        // Check if "Other" is selected in any dropdown
        const hasOther = updatedDropdowns.some(
            (dropdown) =>
                dropdown.value.toLowerCase() === "other" ||
                dropdown.value.toLowerCase() === "others"
        );
        setShowOtherInput(hasOther);

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
                        <option value="" disabled>
                            --Select Purpose--
                        </option>

                        {options.map((option, i) => (
                            <option key={i} value={option}>
                                {option}
                            </option>
                        ))}
                        <option value="Others">Others</option>
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

            {/* Other Input Field */}
            {showOtherInput && (
                <div className="mt-4">
                    <label className="block text-white">
                        Specify (Others):
                        <textarea
                            placeholder="Enter Other Concerns"
                            type="text"
                            maxLength="200" // Limit input to 200 characters
                            rows="3" // Initial height of the textarea
                            onBlur={handleBlur} // Track blur
                            name="aptother"
                            className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75] resize-y"
                            value={formData.aptother || ""}
                            onChange={(e) => {
                                const newValue = e.target.value;
                                setFormData((prevFormData) => ({
                                    ...prevFormData,
                                    aptother: newValue, // Update aptother in formData
                                }));
                            }}
                        />
                    </label>
                    {touched.aptother && (
                        <p className="text-[#FFDB75] text-sm">
                            {errors.aptother}
                        </p>
                    )}
                    {/* Remaining Characters Display */}
                    <p className="text-white text-sm mt-2">
                        {200 - (formData.aptother?.length || 0)} characters
                        remaining
                    </p>
                </div>
            )}
        </div>
    );
};

export default Purpose;
