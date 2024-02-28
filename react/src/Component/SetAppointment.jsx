import React, { useState } from "react";
import SelectOffice from "./SelectOffice";
import Calendar from "./Subcomponent/Calendar";
import InputDetails from "./InputDetails";
import Confirmation from "./Subcomponent/Confirmation";
import SelectBranch from "./SelectBranch";
function SetAppointment() {
    {
        /* appoinement vars*/
    }
    const [selectedBranch, setSelectedBranch] = useState();
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedOffice, setSelectedOffice] = useState("");

    const [selectedAccordion, setSelectedAccordion] = useState(null);

    const handleAccordionClick = (index) => {
        if (selectedAccordion === index) {
            setSelectedAccordion(null);
        } else {
            setSelectedAccordion(index);
        }
    };

    return (
        <>
            <div className="h-full overflow-y-auto">
                <div className="bg-transparent collapse collapse-arrow bg-base-200 h-2/4">
                    <input
                        type="radio"
                        name="my-accordion-2"
                        checked={selectedAccordion === 0}
                        onChange={() => handleAccordionClick(0)}
                    />
                    <div className="collapse-title text-xl font-medium">
                        Select Branch
                    </div>
                    <div
                        className={`collapse-content ${
                            selectedAccordion === 0 ? "" : "hidden"
                        }`}
                    >
                        {" "}  
                        <SelectBranch
                            selectedBranch={selectedBranch}
                            setSelectedBranch={setSelectedBranch}
                        />
                    </div>
                </div>
                <div className="bg-transparent collapse collapse-arrow bg-base-200 h-2/4">
                    <input
                        type="radio"
                        name="my-accordion-2"
                        checked={selectedAccordion === 1}
                        onChange={() => handleAccordionClick(1)}
                    />
                    <div className="collapse-title text-xl font-medium">
                        Select Office
                    </div>
                    <div
                        className={`collapse-content ${
                            selectedAccordion === 1 ? "" : "hidden"
                        }`}
                    >
                        <SelectOffice
                            selectedOffice={selectedOffice}
                            setSelectedOffice={setSelectedOffice}
                        />
                    </div>
                </div>
                <div className="bg-transparent collapse collapse-arrow bg-base-200 h-2/4">
                    <input
                        type="radio"
                        name="my-accordion-2"
                        checked={selectedAccordion === 2}
                        onChange={() => handleAccordionClick(2)}
                    />
                    <div className="collapse-title text-xl font-medium">
                        Select Date
                    </div>
                    <div
                        className={`collapse-content ${
                            selectedAccordion === 2 ? "" : "hidden"
                        }`}
                    >
                        <div>
                            <Calendar setSelectedDate={setSelectedDate} />
                        </div>
                        <div>
                            <p className="mt-4">
                                Selected Date:{" "}
                                {selectedDate ? selectedDate : "None"}
                            </p>
                            <div className="flex flex-col justify-center w-full items-center">
                                <button className="flex justify-center items-center bg-blue-500 text-white py-2 px-4 rounded-md w-96 ml-5 mt-7">
                                    Next &gt;
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-transparent collapse collapse-arrow bg-base-200 h-2/4">
                    <input
                        type="radio"
                        name="my-accordion-2"
                        checked={selectedAccordion === 3}
                        onChange={() => handleAccordionClick(3)}
                    />
                    <div className="collapse-title text-xl font-medium">
                        Input Details
                    </div>
                    <div
                        className={`collapse-content ${
                            selectedAccordion === 3 ? "" : "hidden"
                        }`}
                    >
                        <InputDetails />
                    </div>
                </div>
                <div>
                    <Confirmation />
                </div>
            </div>
        </>
    );
}

export default SetAppointment;
