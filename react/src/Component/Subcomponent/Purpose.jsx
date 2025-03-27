import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Purpose = ({ formData, setFormData, errors }) => {
    const [dropdowns, setDropdowns] = useState([{ id: 0, value: "" }]);
    const [showOtherInput, setShowOtherInput] = useState(false);
    const [showInstructionModal, setShowInstructionModal] = useState(false);
    const [currentInstruction, setCurrentInstruction] = useState("");
    const [currentPurpose, setCurrentPurpose] = useState("");
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    const [options, setOptions] = useState([]); // Will now store full purpose objects
    const [touched, setTouched] = useState({ aptother: false });

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

            const hasOther = initialDropdowns.some(
                (dropdown) =>
                    dropdown.value.toLowerCase() === "other" ||
                    dropdown.value.toLowerCase() === "others"
            );
            setShowOtherInput(hasOther);
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
                // Store the full purpose objects including instructions
                setOptions(data);
            } catch (error) {
                console.error("Error fetching purposes:", error);
                toast.error("Failed to load purposes. Please try again.");
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
            aptother: showOtherInput ? prevFormData.aptother : "",
        }));

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

        const hasOther = updatedDropdowns.some(
            (dropdown) =>
                dropdown.value.toLowerCase() === "other" ||
                dropdown.value.toLowerCase() === "others"
        );
        setShowOtherInput(hasOther);

        const newStringValue = updatedDropdowns
            .map((dropdown) => dropdown.value || "")
            .join(", ");
        setFormData((prevFormData) => ({
            ...prevFormData,
            aptpurpose: newStringValue,
        }));
    };

    const showInstruction = (purposeName) => {
        const selectedPurpose = options.find((p) => p.purpose === purposeName);
        if (selectedPurpose && selectedPurpose.instruction) {
            setCurrentPurpose(purposeName);
            setCurrentInstruction(selectedPurpose.instruction);
            setShowInstructionModal(true);
        }
    };

    return (
        <div className="mx-auto w-full bg-transparent">
            {dropdowns.map((dropdown, index) => (
                <div
                    key={dropdown.id}
                    className="text-gray-800 flex items-center mb-4 w-full"
                >
                    <div className="flex items-center w-full">
                        <select
                            className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75]"
                            value={dropdown.value || ""}
                            onChange={(e) => handleDropdownChange(e, index)}
                        >
                            <option value="" disabled>
                                --Select Purpose--
                            </option>
                            {options.map((option, i) => (
                                <option key={i} value={option.purpose}>
                                    {option.purpose}
                                </option>
                            ))}
                            <option value="Others">Others</option>
                        </select>

                        {/* Show info icon if purpose has instructions */}
                        {dropdown.value &&
                            dropdown.value !== "Others" &&
                            options.some(
                                (opt) =>
                                    opt.purpose === dropdown.value &&
                                    opt.instruction
                            ) && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        showInstruction(dropdown.value)
                                    }
                                    className="ml-2 text-blue-500 hover:text-blue-700"
                                    title="View requirements"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-8 w-8"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </button>
                            )}
                    </div>

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
                <div className="mt-1">
                    <label className="block text-white">
                        Specify (Others):
                        <textarea
                            placeholder="Enter Other Concerns"
                            type="text"
                            maxLength="200"
                            rows="3"
                            onBlur={handleBlur}
                            name="aptother"
                            className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75] resize-y"
                            value={formData.aptother || ""}
                            onChange={(e) => {
                                const newValue = e.target.value;
                                setFormData((prevFormData) => ({
                                    ...prevFormData,
                                    aptother: newValue,
                                }));
                            }}
                        />
                    </label>
                    {touched.aptother && (
                        <p className="text-red-500 text-xs">
                            {errors.aptother}
                        </p>
                    )}
                    <p className="text-white text-sm mt-2">
                        {200 - (formData.aptother?.length || 0)} characters
                        remaining
                    </p>
                </div>
            )}

            {showInstructionModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-2 sm:mx-4">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Requirements for {currentPurpose}
                            </h3>
                            <button
                                onClick={() => setShowInstructionModal(false)}
                                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                aria-label="Close modal"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Content - Textarea Version */}
                        <div className="p-4">
                            {currentInstruction ? (
                                <textarea
                                    className="w-full h-64 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    value={currentInstruction}
                                    readOnly={true} // Set to false if you want editable textarea
                                    onChange={(e) =>
                                        setCurrentInstruction(e.target.value)
                                    } // Only include if editable
                                />
                            ) : (
                                <div className="h-64 flex items-center justify-center">
                                    <p className="text-gray-500 italic">
                                        No specific requirements for this
                                        purpose.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
                            {/* Add a save button if you make it editable */}
                            {/* <button
          onClick={handleSaveInstructions}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
        >
          Save Changes
        </button> */}
                            <button
                                onClick={() => setShowInstructionModal(false)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Purpose;
