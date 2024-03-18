import { useEffect, useState } from "react";
import SelectOffice from "./Subcomponent/SelectOffice";
import Calendar from "./Subcomponent/Calendar";
import InputDetails from "./Subcomponent/InputDetails";
import Confirmation from "./Subcomponent/Confirmation";
import SelectBranch from "./Subcomponent/SelectBranch";
import axios from "axios";

function SetAppointment() {
    const [formData, setFormData] = useState({
        apttype: "Student",
        aptbranch: "",
        aptoffice: "",
        aptname: "",
        aptpurpose: "",
        aptstudnum: "",
        aptdate: "",
        aptemail: "",
        aptpnumber: "",
    });
    const [limit, setLimit] = useState(null);
    const [office, setOffice] = useState([]);
    const [selectedAccordion, setSelectedAccordion] = useState(null);
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const [formReady, setFormReady] = useState(false);

    const handleAccordionClick = (index) => {
        if (selectedAccordion === index) {
            setSelectedAccordion(null);
        } else {
            setSelectedAccordion(index);
        }
    };
    useEffect(() => {
        const getData = async () => {
            const getRes = await fetch(`${apiBaseUrl}/api/office/all`);
            const getDataResult = await getRes.json();
            setOffice(getDataResult);
        };
        getData();
    }, []);

    const setApt = async (e) => {
        e.preventDefault(); // Prevent page reload
        console.log(formData); // Log the formData

        try {
            const res = await axios.post(`${apiBaseUrl}/api/setappt`, formData);

            if (res.data.status === "200") {
            } else {
                console.error("Appointment not set:", res.data.message); // Log error message
            }
        } catch (error) {
            console.error("Error setting appointment:", error); // Log any error that occurs during the request
        }
    };

    const handleAccordinc = (e) => {
        e.preventDefault();
        setSelectedAccordion((prevState) => prevState + 1);
    };

    return (
        <>
            <form>
                <div className="carousel w-full">
                    <div className="carousel-item w-full h-full" id="basta">
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
                                    className={`flex flex-col justify-center items-center collapse-content ${
                                        selectedAccordion === 0 ? "" : "hidden"
                                    }`}
                                >
                                    {" "}
                                    <SelectBranch
                                        formData={formData}
                                        setFormData={setFormData}
                                    />
                                    <button
                                        className="flex justify-center items-center bg-blue-500 text-white py-2 px-4 rounded-md w-96"
                                        type="button"
                                        onClick={handleAccordinc}
                                    >
                                        Next &gt;
                                    </button>
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
                                    className={`flex flex-col justify-center items-center collapse-content ${
                                        selectedAccordion === 1 ? "" : "hidden"
                                    }`}
                                >
                                    <SelectOffice
                                        formData={formData}
                                        setFormData={setFormData}
                                        office={office}
                                        setOffice={setOffice}
                                        setLimit={setLimit}
                                    />
                                    <button
                                        className="flex justify-center items-center bg-blue-500 text-white py-2 px-4 rounded-md w-96 mt-5"
                                        type="button"
                                        onClick={handleAccordinc}
                                    >
                                        Next &gt;
                                    </button>
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
                                    className={`flex flex-col justify-center items-center collapse-content ${
                                        selectedAccordion === 2 ? "" : "hidden"
                                    }`}
                                >
                                    <div>
                                        <Calendar
                                            formData={formData}
                                            setFormData={setFormData}
                                            limit={limit}
                                        />
                                        <button
                                            className="flex justify-center items-center bg-blue-500 text-white py-2 px-4 rounded-md w-96"
                                            type="button"
                                            onClick={handleAccordinc}
                                        >
                                            Next &gt;
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-transparent collapse collapse-arrow bg-base-200 h-full">
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
                                    className={`flex flex-col justify-center items-center collapse-content ${
                                        selectedAccordion === 3 ? "" : "hidden"
                                    }`}
                                >
                                    <InputDetails
                                        formData={formData}
                                        setFormData={setFormData}
                                    />

                                    <a href="#confirmation">
                                        <button
                                            className="flex justify-center items-center bg-blue-500 text-white py-2 px-4 rounded-md w-96"
                                            type="button"
                                        >
                                            Next &gt;
                                        </button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        id="confirmation"
                        className="flex justify-center items-center carousel-item w-full"
                    >
                        <div>
                            <Confirmation
                                formData={formData}
                                setFormData={setFormData}
                            />

                            <div className="flex items-center justify-center w-lvh mt-4">
                                <a
                                    className="py-2 px-8 rounded-md m-5 text-white hover:text-white bg-[#194F90] hover:bg-[#123A69] font-semibold"
                                    href="#basta"
                                >
                                    Back
                                </a>
                                <button
                                    type="submit"
                                    className="py-2 px-8 rounded-md text-white hover:text-white bg-[#194F90] hover:bg-[#123A69] font-semibold"
                                    onClick={setApt}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}

export default SetAppointment;
