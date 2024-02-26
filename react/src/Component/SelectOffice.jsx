import React, { useState } from "react";

function SelectOffice({ selectedOffice, setSelectedOffice }) {
    const [office, setOffice] = useState([
        {
            offAbbr: "MIC",
            offName: "Management Information Center",
            transaction: "Registration and Grade Slip",
            offID: "01",
        },
        {
            offAbbr: "SRAC",
            offName: "QWEQWEQWE",
            transaction: "Pay Tuition Fee and Re-print ID",
            offID: "02",
        },
    ]);
    const [expanded, setExpanded] = useState(false);

    const handleOfficeSelection = (selectedOffAbbr) => {
        setSelectedOffice(selectedOffAbbr);
    };

    return (
        <div className="flex flex-wrap w-full">
            {office.map((officeItem, index) => (
                <div
                    key={index}
                    className={`p-6 border border-gray-300 rounded-md shadow-md transition-transform hover:scale-105 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 mx-2 my-2 cursor-pointer ${
                        selectedOffice === officeItem.offAbbr
                            ? "bg-blue-500"
                            : ""
                    }`}
                    onMouseEnter={() => setExpanded(true)}
                    onMouseLeave={() => setExpanded(false)}
                    onClick={() => handleOfficeSelection(officeItem.offAbbr)}
                >
                    <h2 className="text-3xl  text-center">
                        {officeItem.offAbbr}
                    </h2>
                    <p className="text-xl">{officeItem.offName}</p>
                    <p className="text-sm">{officeItem.transaction}</p>
                </div>
            ))}
        </div>
    );
}

export default SelectOffice;
