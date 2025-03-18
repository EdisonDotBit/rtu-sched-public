import React, { useState } from "react";

function SelectOffice({
    formData,
    setFormData,
    office,
    setLimit,
    setOfficeSelected,
}) {
    const [expanded, setExpanded] = useState(false);
    const [options, setOptions] = useState([]);

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

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
        <div className="flex flex-wrap w-full justify-center">
            {office.map((officeItem, index) => (
                <div
                    key={index}
                    className={`p-6 border border-gray-300 rounded-md shadow-md transition-transform hover:scale-105 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-[300px] mx-2 my-2 cursor-pointer ${
                        formData.aptoffice === officeItem.offabbr
                            ? "bg-blue-500 text-white"
                            : "bg-white"
                    }`}
                    onMouseEnter={() => setExpanded(true)}
                    onMouseLeave={() => setExpanded(false)}
                    onClick={() =>
                        handleOfficeSelection(
                            officeItem.offabbr,
                            officeItem.offlimit
                        )
                    }
                >
                    <h2 className="font-bold text-3xl text-center mb-2">
                        {officeItem.offabbr}
                    </h2>
                    <p className="text-xl text-center">{officeItem.offname}</p>
                </div>
            ))}
        </div>
    );
}

export default SelectOffice;
