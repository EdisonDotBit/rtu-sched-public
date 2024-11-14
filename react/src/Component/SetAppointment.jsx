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
    const [appointments, setAppointments] = useState([]);
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const modals = useRef(null);
    const modals1 = useRef(null);
    const [succData, setSuccData] = useState({});
    const [isBranchSelected, setIsBranchSelected] = useState(false);
    const [isOfficeSelected, setIsOfficeSelected] = useState(false);
    const [isTimeSelected, setIsTimeSelected] = useState(false);
    const [isInputFilled, setIsInputFilled] = useState(false);
    const [errors, setErrors] = useState({});
    const [isConfirmed, setIsConfirmed] = useState(false);

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

    useEffect(() => {
        // Perform validation
        const newErrors = {};

        // Validate Purpose
        if (
            !formData.aptpurpose ||
            formData.aptpurpose === "--Select Purpose--"
        ) {
            newErrors.aptpurpose = "Please select a purpose.";
        }

        // Validate Student Number (Format: ####-######)
        if (!formData.aptstudnum) {
            newErrors.aptstudnum = "Student number is required.";
        } else if (!/^[0-9]{4}-[0-9]{6}$/.test(formData.aptstudnum)) {
            newErrors.aptstudnum =
                "Student number must follow the format ####-######.";
        }

        // Validate Name (Ensure it's not empty and has at least 10 characters)
        if (!formData.aptname) {
            newErrors.aptname = "Full name is required.";
        } else if (formData.aptname.length < 10) {
            newErrors.aptname = "Full name must be at least 10 characters.";
        }

        // Validate Contact Number (Ensure it's valid and 11 digits)
        if (!formData.aptpnumber) {
            newErrors.aptpnumber = "Contact number is required.";
        } else if (
            formData.aptpnumber &&
            !/^[0-9]{11}$/.test(formData.aptpnumber)
        ) {
            newErrors.aptpnumber = "Contact number must be 11 digits long.";
        }

        // Validate Email (Ensure it's not empty and ends with @rtu.edu.ph)
        if (!formData.aptemail) {
            newErrors.aptemail = "Institute email is required.";
        } else if (!/^\d{4}-\d{6}@rtu\.edu\.ph$/.test(formData.aptemail)) {
            newErrors.aptemail =
                "Institute Email must be in the format ####-######@rtu.edu.ph.";
        }

        // Check if the form is valid
        const isFormValid = Object.keys(newErrors).length === 0;

        setErrors(newErrors);
        setIsInputFilled(isFormValid);
    }, [formData]);

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

    const handleBranchSelect = () => {
        setIsBranchSelected(true);
    };

    const handleOfficeSelect = () => {
        setIsOfficeSelected(true);
    };

    const handleTimeSelect = () => {
        setIsTimeSelected(true);
    };

    const handleCheckboxChange = (e) => {
        setIsConfirmed(e.target.checked);
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
                <div className="w-full h-auto flex justify-center align text-[#3c4043]">
                    <div className="w-full md:w-4/5 h-full">
                        <h1 className="text-center text-3xl font-semibold text-gray-800 mb-5">
                            Set an Appointment
                        </h1>
                        {/* Progress Indicator */}
                        <div className="mb-8">
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
                                    <h4 className="text-center text-sm min-w-full  text-gray-500 mb-4">
                                        Click the box to select
                                    </h4>
                                    <div className="w-full justify-center">
                                        <SelectBranch
                                            formData={formData}
                                            setFormData={setFormData}
                                            setBranchSelected={
                                                handleBranchSelect
                                            }
                                        />
                                    </div>
                                    <div className="flex w-full justify-evenly">
                                        <button
                                            className={`py-2 px-8 rounded-md text-white hover:text-white ${
                                                isBranchSelected
                                                    ? "bg-[#194F90] hover:bg-[#123A69]"
                                                    : "bg-gray-400 cursor-not-allowed"
                                            } font-medium`}
                                            onClick={nextStep}
                                            disabled={!isBranchSelected}
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
                                    <h4 className="text-center text-sm min-w-full  text-gray-500 mb-4">
                                        Click the box to select
                                    </h4>
                                    <div className="flex flex-col sm:flex-row justify-center items-center w-full">
                                        <SelectOffice
                                            formData={formData}
                                            setFormData={setFormData}
                                            office={office}
                                            setOffice={setOffice}
                                            setLimit={setLimit}
                                            setOfficeSelected={
                                                handleOfficeSelect
                                            }
                                        />
                                    </div>
                                    <div className="flex w-full justify-evenly mt-28">
                                        <button
                                            className=" bg-red-700 hover:bg-red-900 text-white rounded-md inline-block px-8 py-2 text-md font-medium focus:relative"
                                            onClick={prevStep}
                                        >
                                            Previous
                                        </button>
                                        <button
                                            className={`py-2 px-8 rounded-md text-white hover:text-white ${
                                                isOfficeSelected
                                                    ? "bg-[#194F90] hover:bg-[#123A69]"
                                                    : "bg-gray-400 cursor-not-allowed"
                                            } font-medium`}
                                            onClick={nextStep}
                                            disabled={!isOfficeSelected}
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
                                    <h4 className="text-center text-sm min-w-full  text-gray-500 mb-4">
                                        Click the box to select date and time
                                    </h4>
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
                                            setTimeSelected={handleTimeSelect}
                                        />
                                    </div>
                                    <div className="flex w-full justify-evenly">
                                        <button
                                            className=" bg-red-700 hover:bg-red-900 text-white rounded-md inline-block px-8 py-2 text-md font-medium focus:relative"
                                            onClick={prevStep}
                                        >
                                            Previous
                                        </button>
                                        <button
                                            className={`py-2 px-8 rounded-md text-white hover:text-white ${
                                                isTimeSelected
                                                    ? "bg-[#194F90] hover:bg-[#123A69]"
                                                    : "bg-gray-400 cursor-not-allowed"
                                            } font-medium`}
                                            onClick={nextStep}
                                            disabled={!isTimeSelected}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 4 */}
                            {step === 4 && (
                                <div className="step-content flex flex-col justify-center items-center">
                                    <h2 className="text-lg text-center font-semibold">
                                        Step 4: Input Details
                                    </h2>
                                    <h4 className="text-center text-sm min-w-full  text-gray-500 mb-4">
                                        Click the dropdown to select purpose and
                                        fill up the following information
                                    </h4>
                                    <div className="w-full mb-10">
                                        <InputDetails
                                            formData={formData}
                                            setFormData={setFormData}
                                            errors={errors}
                                        />
                                    </div>
                                    <div className="flex w-full justify-evenly">
                                        <button
                                            className="bg-red-700 hover:bg-red-900 text-white rounded-md inline-block px-8 py-2 text-md font-medium focus:relative"
                                            onClick={prevStep}
                                        >
                                            Previous
                                        </button>
                                        <button
                                            className={`py-2 px-8 rounded-md text-white hover:text-white ${
                                                isInputFilled
                                                    ? "bg-[#194F90] hover:bg-[#123A69]"
                                                    : "bg-gray-400 cursor-not-allowed"
                                            } font-medium`}
                                            onClick={nextStep}
                                            disabled={!isInputFilled}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 5 */}
                            {step === 5 && (
                                <div className="step-content flex flex-col justify-center items-center w-full">
                                    <h2 className="text-lg text-center font-semibold">
                                        Step 5: Confirm Details
                                    </h2>

                                    <h4 className="text-center text-sm min-w-full  text-gray-500 mb-4">
                                        Review the following information.
                                        Appointment number is important. Kindly
                                        note it.
                                    </h4>

                                    <div className="w-full lg:w-[800px]">
                                        <Confirmation formData={formData} />
                                        <div className="mb-4 items-center w-full ml-auto mr-auto text-center text-[12px]">
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
                                                <b>
                                                    {" "}
                                                    true and correct
                                                </b> and{" "}
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
                                            className="bg-red-700 hover:bg-red-900 text-white rounded-md inline-block px-8 py-2 text-md font-medium focus:relative"
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

                    <dialog
                        ref={modals}
                        className="modal"
                        onKeyDown={(event) => {
                            if (event.key === "Escape") {
                                event.preventDefault();
                            }
                        }}
                    >
                        <div className="modal-box flex flex-col justify-center items-center text-white bg-[#194F90]">
                            <h2> Your appointment number is:</h2>
                            <h1 className="underline"> {succData.aptid}</h1>
                            <PDFDownloadLink
                                document={<PDFFile succData={succData} />}
                                fileName="RTU-Appointment-Receipt.pdf"
                            >
                                {({ loading }) =>
                                    loading ? (
                                        <div>
                                            <Loading />
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            className="btn btn-outline text-white hover:bg-white hover:text-[#194F90] mt-6"
                                            onClick={() => {
                                                setTimeout(() => {
                                                    window.location.reload();
                                                }, 500);
                                            }}
                                        >
                                            Download
                                        </button>
                                    )
                                }
                            </PDFDownloadLink>
                            <div className="item-center modal-action text-sm">
                                <label style={{ verticalAlign: "middle" }}>
                                    <b>
                                        <br />
                                        **Reminder that appointment number is
                                        important**
                                    </b>
                                </label>
                            </div>
                            <h4 className="text-xs mt-2">
                                Note: clicking download reloads the page.
                            </h4>
                        </div>
                    </dialog>

                    <dialog
                        ref={modals1}
                        className="modal"
                        onKeyDown={(event) => {
                            if (event.key === "Escape") {
                                event.preventDefault();
                            }
                        }}
                    >
                        <div className="modal-box relative flex flex-col justify-center items-center text-white bg-[#194F90]">
                            {/* Close button with SVG */}
                            <button
                                className="absolute top-2 right-2 p-2 transition duration-300 focus:outline-none"
                                onClick={() => modals1.current.close()}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>

                            <div className="text-center">
                                <h1 className="text-red-400">
                                    Appointment Failed
                                </h1>
                                <h3 className="text-md">
                                    You already have three (3) ongoing
                                    appointments.
                                </h3>
                                <h4 className="text-gray-200 text-xs mt-2">
                                    Note: Accomplish those transactions before
                                    scheduling another appointment.
                                </h4>
                                <h4 className="text-gray-200 text-xs mt-2">
                                    Closing this modal reloads the page.
                                </h4>
                            </div>
                        </div>
                    </dialog>
                </div>
            </form>
        </>
    );
}

export default SetAppointment;
