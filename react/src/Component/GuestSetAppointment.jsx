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
import Loading from "./Subcomponent/Loading";
import GuestDetails from "./Subcomponent/GuestDetails";
import ConfirmtionG from "./Subcomponent/ConfirmationG";

function GuestSetAppointment() {
    const [formData, setFormData] = useState({
        apttype: "Guest",
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
    const [appointmentIds, setAptID] = useState([]);
    const [limit, setLimit] = useState(null);
    const [office, setOffice] = useState([]);
    const [selectedAccordion, setSelectedAccordion] = useState(0);
    const [appointments, setAppointments] = useState([]);
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const [formReady, setFormReady] = useState(false);
    const modals = useRef(null);
    const modals1 = useRef(null);
    const [succData, setSuccData] = useState({});
    const [isConfirmed, setIsConfirmed] = useState(false);
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
    useEffect(() => {
        const getData = async () => {
            const getRes = await fetch(`${apiBaseUrl}/api/allongoing`);
            const getDataResult = await getRes.json();
            setAppointments(getDataResult);
        };
        getData();
    }, []);

    const setApt = async (e) => {
        e.preventDefault();
        const emailCount = appointments.reduce((count, appointment) => {
            if (appointment.aptemail === formData.aptemail) {
                count++;
            }
            return count;
        }, 0);

        // Check if emailCount is greater than or equal to 3
        if (emailCount >= 3) {
            openmodal1();
            return; // Exit function if already three appointments
        } else {
            try {
                const res = await axios.post(
                    `${apiBaseUrl}/api/setappt`,
                    formData
                );

                if (res.status === 200) {
                    openmodal(res.data.data);
                }
            } catch (error) {
                alert("Appointment failed. Please check your details");
            }
        }
    };
    const handleCheckboxChange = (e) => {
        setIsConfirmed(e.target.checked);
    };

    const handleAccordinc = (e) => {
        e.preventDefault();
        setSelectedAccordion((prevState) => prevState + 1);
    };
    const openmodal = (data) => {
        setSuccData(data);
        modals.current.showModal();
    };
    const openmodal1 = () => {
        modals1.current.showModal();
    };

    return (
        <>
            <form>
                <div className="carousel w-full touch-pan-y overflow-x-hidden">
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
                                            appointments={appointments}
                                        />
                                        <TimePicker
                                            formData={formData}
                                            setFormData={setFormData}
                                            appointments={appointments}
                                            limit={limit}
                                        />
                                    </div>
                                    <button
                                        className="flex justify-center items-center bg-blue-500 text-white py-2 px-4 rounded-md w-96 xsm:w-[100px] sm:w-[200px] md:w-[300px]"
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
                                    <GuestDetails
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
                            <ConfirmtionG
                                formData={formData}
                                setFormData={setFormData}
                            />
                            <div className="items-center w-[85%] ml-auto mr-auto text-center text-[12px]">
                                <input
                                    type="checkbox"
                                    tabIndex={-1}
                                    className="mr-2 accent-[#123A69] hover:accent-[#123A69]"
                                    style={{ verticalAlign: "middle" }}
                                    onChange={handleCheckboxChange}
                                />
                                <label style={{ verticalAlign: "middle" }}>
                                    I confirm that the above information is
                                    <b> true and correct</b> and
                                    <b>
                                        I consent Rizal Technological University{" "}
                                    </b>
                                    under the standards of Data Protection and
                                    Privacy to
                                    <b> collect and process </b>
                                    the given data.
                                </label>

                                <label style={{ verticalAlign: "middle" }}>
                                    <b>
                                        <br />
                                        <br />
                                        *** Appointment number is important.
                                        Kindly note it***
                                    </b>
                                </label>
                            </div>

                            <div className="flex items-center justify-center w-lvh mt-4">
                                <a
                                    className="py-2 px-8 rounded-md m-5 text-white hover:text-white bg-[#194F90] hover:bg-[#123A69] font-semibold"
                                    href="#basta"
                                >
                                    Back
                                </a>
                                <button
                                    type="submit"
                                    className={`py-2 px-8 rounded-md text-white hover:text-white ${
                                        isConfirmed
                                            ? "bg-[#194F90] hover:bg-[#123A69]"
                                            : "bg-gray-400 cursor-not-allowed"
                                    } font-semibold`}
                                    onClick={setApt}
                                    disabled={!isConfirmed}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                    <dialog ref={modals} className="modal">
                        <div className="flex flex-col justify-center items-center text-white modal-box">
                            <h1> Your appointment number is:</h1>
                            <h1 className="underline"> {succData.aptid}</h1>
                            <PDFDownloadLink
                                document={<PDFFile succData={succData} />}
                                fileName="PaoloBanagloriosoAtEdisotLati_nga_pala.pdf"
                            >
                                {({ loading }) =>
                                    loading ? (
                                        <div>
                                            <Loading />
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            className="btn btn-outline mt-6"
                                        >
                                            Download
                                        </button>
                                    )
                                }
                            </PDFDownloadLink>
                            <div className="text-center">
                                <b>
                                    <br />
                                    *** Appointment number is important. Kindly
                                    note it ***
                                </b>
                            </div>
                        </div>
                    </dialog>
                    <dialog ref={modals1} className="modal">
                        <div className="flex flex-col justify-center items-center text-white modal-box">
                            <h1 className=" text-red-600">
                                Appointment Failed
                            </h1>
                            <h3>
                                You have already have a three(3) ongoing
                                appointment.
                            </h3>
                        </div>
                    </dialog>
                </div>
            </form>
        </>
    );
}

export default GuestSetAppointment;
