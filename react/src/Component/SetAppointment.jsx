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
import Accord from "../Component/Subcomponent/Asset/bg.jpg";

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
    const [step, setStep] = useState(1);

    const nextStep = () => {
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };
    return (
        <>
            <form>
                <div className="w-full h-auto flex justify-center align">
                    <div className="w-full md:w-4/5 h-full">
                        <h2 className="text-2xl text-center font-bold mb-5">
                            Set an Appointment
                        </h2>
                        {/* Progress Indicator */}
                        <div className="mb-4">
                            <div className="w-full bg-gray-300 rounded-full">
                                <div
                                    class=" p-0.5 text-center text-xs font-medium leading-none text-primary-100 rounded-md bg-amber-400"
                                    style={{ width: `${step * 20}%` }}
                                >
                                    {step * 20}%
                                </div>
                            </div>
                        </div>

                        {/* Form Content */}
                        <div className="space-y-4">
                            {/* Step 1 */}
                            {step === 1 && (
                                <div className="step-content flex flex-col justify-center items-center w-full">
                                    <h2 className="text-lg text-center font-semibold">
                                        Step 1: Select Branch
                                    </h2>
                                    <h4>Click the box to select</h4>
                                    <div className="w-full justify-center">
                                        <SelectBranch
                                            formData={formData}
                                            setFormData={setFormData}
                                        />
                                    </div>
                                    <div className="flex w-full justify-evenly">
                                        <button
                                            className=" bg-blue-200 hover:bg-blue-700 hover:text-white border-x-cyan-500 border rounded-lg inline-block px-4 py-2 text-sm font-medium text-gray-700  focus:relative"
                                            onClick={nextStep}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 2 */}
                            {step === 2 && (
                                <div className="step-content flex flex-col justify-center items-center w-full">
                                    <h2 className="text-lg text-center font-semibold">
                                        Step 2: Select Office
                                    </h2>
                                    <h4>Click the box to select</h4>
                                    <div className="flex flex-col sm:flex-row justify-center items-center w-full">
                                        <SelectOffice
                                            formData={formData}
                                            setFormData={setFormData}
                                            office={office}
                                            setOffice={setOffice}
                                            setLimit={setLimit}
                                        />
                                    </div>
                                    <div className="flex w-full justify-evenly mt-64">
                                        <button
                                            className=" bg-slate-200 border border-x-amber-300 rounded-lg inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative"
                                            onClick={prevStep}
                                        >
                                            Previous
                                        </button>
                                        <button
                                            className=" bg-blue-200 hover:bg-blue-700 hover:text-white border-x-cyan-500 borderrounded-lg  rounded-lg inline-block px-4 py-2 text-sm font-medium text-gray-700  focus:relative"
                                            onClick={nextStep}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3 */}
                            {step === 3 && (
                                <div className="step-content flex flex-col justify-center items-center">
                                    <h2 className="text-lg text-center font-semibold">
                                        Step 3: Select Available Time and Date
                                    </h2>
                                    <div className="flex flex-col sm:flex-row justify-center items-center ">
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
                                    <div className="flex w-full justify-evenly">
                                        <button
                                            className=" bg-slate-200 border border-x-amber-300 rounded-lg inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative"
                                            onClick={prevStep}
                                        >
                                            Previous
                                        </button>
                                        <button
                                            className=" bg-slate-200 rounded-lg inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative"
                                            onClick={nextStep}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                            {step === 4 && (
                                <div className="step-content flex flex-col justify-center items-center">
                                    <h2 className="text-lg text-center font-semibold">
                                        Step 4: Input Details
                                    </h2>
                                    <h4></h4>
                                    <div className="w-full">
                                        <InputDetails
                                            formData={formData}
                                            setFormData={setFormData}
                                        />
                                    </div>
                                    <div className="flex w-full justify-evenly">
                                        <button
                                            className=" bg-slate-200 border border-x-amber-300 rounded-lg inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative"
                                            onClick={prevStep}
                                        >
                                            Previous
                                        </button>
                                        <button
                                            className="  rounded-lg inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative"
                                            onClick={nextStep}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 4 */}
                            {step === 5 && (
                                <div className="step-content flex flex-col justify-center items-center w-full">
                                    <h2 className="text-lg text-center font-semibold">
                                        Step 5: Confirm Details
                                    </h2>

                                    <b className=" -mt-12 w-full text-center">
                                        <br />
                                        <br />
                                        *** Appointment number is important.
                                        Kindly note it***
                                    </b>

                                    <div className="w-full lg:w-[647px]">
                                        <Confirmation formData={formData} />
                                        <div className="items-center w-full ml-auto mr-auto text-center text-[12px]">
                                            <input
                                                type="checkbox"
                                                tabIndex={-1}
                                                className="mr-2 accent-[#123A69] hover:accent-[#123A69]"
                                                style={{
                                                    verticalAlign: "middle",
                                                }}
                                                onChange={handleCheckboxChange}
                                            />
                                            <label
                                                style={{
                                                    verticalAlign: "middle",
                                                }}
                                            >
                                                I confirm that the above
                                                information is
                                                <b> true and correct</b> and
                                                <b>
                                                    I consent Rizal
                                                    Technological University{" "}
                                                </b>
                                                under the standards of Data
                                                Protection and Privacy to
                                                <b> collect and process </b>
                                                the given data.
                                            </label>

                                            <label
                                                style={{
                                                    verticalAlign: "middle",
                                                }}
                                            ></label>
                                        </div>
                                    </div>
                                    <div className="flex w-full justify-evenly">
                                        <button
                                            className=" bg-slate-200 border border-x-amber-300 rounded-lg inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative"
                                            onClick={prevStep}
                                        >
                                            Previous
                                        </button>
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
                            )}
                        </div>
                    </div>
                    <dialog ref={modals} className="modal">
                        <div className="flex flex-col justify-center items-center text-white modal-box">
                            <h2> Your appointment number is:</h2>
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
                            <div className="item-center modal-action">
                                <label style={{ verticalAlign: "middle" }}>
                                    <b>
                                        <br />
                                        *** Appointment number is important.
                                        Kindly note it ***
                                    </b>
                                </label>
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

export default SetAppointment;
