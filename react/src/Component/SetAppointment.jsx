import React, { useState } from "react";
import SelectOffice from "./Subcomponent/SelectOffice";
import Calendar from "./Subcomponent/Calendar";
import InputDetails from "./Subcomponent/InputDetails";
import Confirmation from "./Subcomponent/Confirmation";
import SelectBranch from "./Subcomponent/SelectBranch";
function SetAppointment() {
    const [formData, setFormData] = useState({
        branch: null,
        date: null,
        office: "",
        type: "Student",
        purpose: "",
        studNum: "",
        name: "",
        email: "",
        pnumber: "",
    });

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
            <div className="carousel w-full">
                <div className="carousel-item w-full">
                    <div className="w-full">
                        <div className="bg-transparent collapse collapse-arrow bg-base-200 h-auto">
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
                                    formData={formData}
                                    setFormData={setFormData}
                                />
                            </div>
                        </div>
                        <div className="bg-transparent collapse collapse-arrow bg-base-200 h-auto">
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
                                    formData={formData}
                                    setFormData={setFormData}
                                />
                            </div>
                        </div>
                        <div className="bg-transparent collapse collapse-arrow bg-base-200 h-auto">
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
                                    <Calendar
                                        formData={formData}
                                        setFormData={setFormData}
                                    />
                                </div>
                                <div>
                                    <p className="mt-4">
                                        Selected Date:{" "}
                                        {formData.date ? formData.date : "None"}
                                    </p>

                                    <div className="flex flex-col justify-center w-full items-center">
                                        <button className="flex justify-center items-center bg-blue-500 text-white py-2 px-4 rounded-md w-96 ml-5 mt-7">
                                            Next &gt;
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-transparent collapse collapse-arrow bg-base-200 h-auto">
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
                                <InputDetails
                                    formData={formData}
                                    setFormData={setFormData}
                                />
                                <a href="#confirmation" className="btn btn-xs">
                                    1
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="confirmation" className="carousel-item w-full">
                    <div>
                        <Confirmation
                            formData={formData}
                            setFormData={setFormData}
                        />

                        <div className="flex items-center justify-center w-lvh mt-4">
                            <button className="py-2 px-8 rounded-md text-white hover:text-white bg-[#194F90] hover:bg-[#123A69] font-semibold">
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SetAppointment;
