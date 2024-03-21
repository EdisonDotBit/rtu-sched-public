import { useEffect, useRef, useState } from "react";
import SelectOffice from "./Subcomponent/SelectOffice";
import Calendar from "./Subcomponent/Calendar";
import InputDetails from "./Subcomponent/InputDetails";
import Confirmation from "./Subcomponent/Confirmation";
import SelectBranch from "./Subcomponent/SelectBranch";
import axios from "axios";
import TimePicker from "./Subcomponent/TimePicker";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PDFFile from "./PDFFile";

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
        apttime: "",
    });
    const [limit, setLimit] = useState(null);
    const [office, setOffice] = useState([]);
    const [selectedAccordion, setSelectedAccordion] = useState(0);
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const [formReady, setFormReady] = useState(false);
    const modals = useRef(null);
    const [succData, setSuccData] = useState({});
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

        try {
            const res = await axios.post(`${apiBaseUrl}/api/setappt`, formData);

            if (res.status === 200) {
                openmodal(res.data.data);
            }
        } catch (error) {
            alert("Appointment noPlease check your details");
        }
    };

    const handleAccordinc = (e) => {
        e.preventDefault();
        setSelectedAccordion((prevState) => prevState + 1);
    };
    const openmodal = (data) => {
        setSuccData(data);
        modals.current.showModal();
    };

    return (
        <>
            <form>
                <div className="carousel w-full ">
                    <div className="carousel-item w-full h-full" id="basta">
                        <div className="w-full">
                            <div className="bg-transparent collapse collapse-arrow bg-base-200 h-auto">
                                <input
                                    type="radio"
                                    name="my-accordion-2"
                                    checked={selectedAccordion === 0}
                                    onChange={() => handleAccordionClick(0)}
                                />
                                <div className="collapse-title text-xl font-medium xsm:text-base md:text-xl">
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
                                        className="flex justify-center items-center bg-blue-500 text-white py-2 px-4 rounded-md w-96 xsm:w-[100px] sm:w-[200px] md:w-[300px]"
                                        type="button"
                                        onClick={handleAccordinc}
                                    >
                                        Next &gt;
                                    </button>
                                </div>
                            </div>
                            <div className="bg-transparent collapse collapse-arrow bg-base-200 h-auto w-full">
                                <input
                                    type="radio"
                                    name="my-accordion-2"
                                    checked={selectedAccordion === 1}
                                    onChange={() => handleAccordionClick(1)}
                                />
                                <div className="collapse-title text-xl font-medium xsm:text-base md:text-xl">
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
                                        className="flex justify-center items-center bg-blue-500 text-white py-2 px-4 rounded-md w-96 mt-5 xsm:w-[100px] sm:w-[200px] md:w-[300px]"
                                        type="button"
                                        onClick={handleAccordinc}
                                    >
                                        Next &gt;
                                    </button>
                                </div>
                            </div>
                            <div className="bg-transparent collapse collapse-arrow bg-base-200 h-auto w-full">
                                <input
                                    type="radio"
                                    name="my-accordion-2"
                                    checked={selectedAccordion === 2}
                                    onChange={() => handleAccordionClick(2)}
                                />
                                <div className="collapse-title text-xl font-medium xsm:text-base md:text-xl">
                                    Select Date
                                </div>
                                <div
                                    className={`flex flex-col justify-center items-center collapse-content ${
                                        selectedAccordion === 2 ? "" : "hidden"
                                    }`}
                                >
                                    <div className="flex flex-col sm:flex-row justify-center items-center">
                                        <Calendar
                                            formData={formData}
                                            setFormData={setFormData}
                                            limit={limit}
                                        />
                                        <TimePicker
                                            formData={formData}
                                            setFormData={setFormData}
                                        />
                                        <button
                                            className="flex justify-center items-center bg-blue-500 text-white py-2 px-4 rounded-md w-96 xsm:w-[100px] sm:w-[200px] md:w-[300px]"
                                            type="button"
                                            onClick={handleAccordinc}
                                        >
                                            Next &gt;
                                        </button>
                                    </div>
                                    <button
                                        className="flex justify-center items-center bg-blue-500 text-white py-2 px-4 rounded-md w-96"
                                        type="button"
                                        onClick={handleAccordinc}
                                    >
                                        Next &gt;
                                    </button>
                                </div>
                            </div>
                            <div className="bg-transparent collapse collapse-arrow bg-base-200 h-full">
                                <input
                                    type="radio"
                                    name="my-accordion-2"
                                    checked={selectedAccordion === 3}
                                    onChange={() => handleAccordionClick(3)}
                                />
                                <div className="collapse-title text-xl font-medium xsm:text-base md:text-xl">
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
                                            className="flex justify-center items-center bg-blue-500 text-white py-2 px-4 rounded-md w-96 xsm:w-[100px] sm:w-[200px] md:w-[300px]"
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
                    <dialog ref={modals} className="modal">
                        <div className="flex flex-col justify-center items-center text-white modal-box">
                            <PDFDownloadLink
                                document={<PDFFile succData={succData} />}
                                fileName="Transaction_Summary.pdf"
                            >
                                {({ loading }) =>
                                    loading ? (
                                        <h1>Please wait. Loading....</h1>
                                    ) : (
                                        <button
                                            type="button"
                                            className="btn btn-outline"
                                        >
                                            Download
                                        </button>
                                    )
                                }
                            </PDFDownloadLink>
                            <div className="item-center modal-action"></div>
                        </div>
                    </dialog>
                </div>
            </form>
        </>
    );
}

export default SetAppointment;
