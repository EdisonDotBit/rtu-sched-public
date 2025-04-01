import React, { useState } from "react";

function SelectOffice({
    formData,
    setFormData,
    office,
    setLimit,
    setOfficeSelected,
}) {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const [options, setOptions] = useState([]);

    const handleOfficeSelection = (selectedOffAbbr, limits) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            aptoffice: selectedOffAbbr,
        }));
        setLimit(limits);
        setOfficeSelected(true);
        fetchPurposes(selectedOffAbbr);
    };

    const fetchPurposes = async (officeAbbr) => {
        if (!formData.aptbranch) return;

        try {
            const response = await fetch(
                `${apiBaseUrl}/api/office/purposes/${officeAbbr}/${formData.aptbranch}`
            );
            const data = await response.json();
            setOptions(data);
        } catch (error) {
            console.error("Error fetching purposes:", error);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {office.map((officeItem, index) => (
                <div
                    key={index}
                    className={`relative p-5 rounded-xl shadow-sm border transition-all duration-200 cursor-pointer ${
                        formData.aptoffice === officeItem.offabbr
                            ? "ring-2 ring-blue-500 border-blue-300 bg-blue-50/30"
                            : "border-gray-200 hover:border-blue-200 bg-white"
                    }`}
                    onClick={() =>
                        handleOfficeSelection(
                            officeItem.offabbr,
                            officeItem.offlimit
                        )
                    }
                >
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-1">
                                {officeItem.offabbr}
                            </h3>
                            <p className="text-gray-600">
                                {officeItem.offname}
                            </p>
                            {officeItem.offlimit && (
                                <div className="mt-2 flex items-center text-sm text-gray-600">
                                    <svg
                                        className="mr-1.5 h-4 w-4 text-gray-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeWidth={2}
                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                        />
                                    </svg>
                                    <span>
                                        {officeItem.offlimit} slots daily
                                    </span>
                                </div>
                            )}
                        </div>
                        {formData.aptoffice === officeItem.offabbr ? (
                            <div className="bg-blue-600 text-white p-1 rounded-full">
                                <svg
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        ) : (
                            <div className="border border-gray-300 rounded-full p-1">
                                <div className="w-5 h-5"></div>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default SelectOffice;
