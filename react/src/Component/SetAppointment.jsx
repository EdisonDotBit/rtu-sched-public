import { useEffect, useRef, useState } from "react";
import SelectOffice from "./Subcomponent/SelectOffice";
import Calendar from "./Subcomponent/Calendar";
import InputDetails from "./Subcomponent/InputDetails";
import Confirmation from "./Subcomponent/Confirmation";
import SelectBranch from "./Subcomponent/SelectBranch";
import axios from "axios";
import TimePicker from "./Subcomponent/TimePicker";
import { useStudentAuth } from "../Hooks/useStudentAuth";

function SetAppointment() {
    const { user } = useStudentAuth();

    const [formData, setFormData] = useState({
        apttype: user ? user.role : "",
        aptbranch: "",
        aptoffice: "",
        aptname: user ? user.full_name : "",
        aptpurpose: "",
        aptstudnum: user ? user.student_number : "",
        aptdate: "",
        aptemail: user ? user.email : "",
        aptpnumber: user ? user.contact_number : "",
        apttime: "",
        aptattach: [],
        aptother: "",
        isConfirmed: false,
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
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData((prevData) => ({
                ...prevData,
                aptname: user.full_name,
                aptstudnum: user.student_number,
                aptemail: user.email,
                aptpnumber: user.contact_number,
            }));
        }
    }, [user]);

    useEffect(() => {
        if (formData.aptbranch) {
            // Only fetch if a branch is selected
            const fetchOffices = async () => {
                try {
                    const response = await axios.get(
                        `${apiBaseUrl}/api/office/all`,
                        { params: { branch: formData.aptbranch } } // Pass branch as query param
                    );
                    setOffice(response.data); // Update office state with filtered data
                } catch (error) {
                    console.error("Error fetching offices:", error);
                }
            };

            fetchOffices();
        }
    }, [formData.aptbranch, apiBaseUrl]);

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

        // Validate Purpose (Required)
        if (
            !formData.aptpurpose ||
            formData.aptpurpose === "--Select Purpose--"
        ) {
            newErrors.aptpurpose = "Please select a purpose.";
        }

        // Validate "Other" Field (Required only if "Other" is selected)
        if (
            formData.aptpurpose &&
            formData.aptpurpose.toLowerCase().includes("other") && // Check if "Other" or "Others" is selected
            (!formData.aptother || formData.aptother.trim() === "")
        ) {
            newErrors.aptother = "Please specify the other purposes here.";
        }

        // Ensure all required fields are filled
        if (!formData.aptstudnum)
            newErrors.aptstudnum = "Student number is required.";
        if (!formData.aptname) newErrors.aptname = "Full name is required.";
        if (!formData.aptpnumber)
            newErrors.aptpnumber = "Contact number is required.";
        if (!formData.aptemail)
            newErrors.aptemail = "Institute email is required.";

        // Check if the form is valid
        const isFormValid = Object.keys(newErrors).length === 0;

        setErrors(newErrors);
        setIsInputFilled(isFormValid);
    }, [formData]);

    const setApt = async (e) => {
        e.preventDefault();

        // Prevent multiple submissions
        if (isSubmitting) return;
        setIsSubmitting(true);

        // Count how many times the student has an appointment in the selected office
        const officeCount = appointments.reduce((count, appointment) => {
            if (
                appointment.aptoffice === formData.aptoffice && // Same Office
                appointment.aptbranch === formData.aptbranch && // Same Branch
                appointment.aptstudnum === formData.aptstudnum // Same Student Number
            ) {
                count++;
            }
            return count;
        }, 0);

        // If student already has an appointment in this office, prevent another booking
        if (officeCount >= 1) {
            openmodal1(); // Show modal to notify student
            setIsSubmitting(false);
            return;
        }

        try {
            const formDataToSend = new FormData();

            // Append all form fields
            Object.keys(formData).forEach((key) => {
                if (key === "aptattach" && Array.isArray(formData[key])) {
                    formData[key].forEach((file) => {
                        formDataToSend.append("aptattach[]", file); // Append each file
                    });
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            });

            console.log("Submitting appointment...", formDataToSend);

            // Send the request once with FormData (for both text & file data)
            const res = await axios.post(
                `${apiBaseUrl}/api/setappt`,
                formDataToSend,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            if (res.status === 200) {
                openmodal(res.data.data); // Show success modal
            }
        } catch (error) {
            console.error("Appointment failed:", error);
            alert("Appointment failed. Please check your details");
        } finally {
            setIsSubmitting(false); // Reset after request completes
        }
    };

    const handleBranchSelect = () => {
        setIsBranchSelected(true);
        setIsOfficeSelected(false); // Reset office selection when changing branches
        setFormData((prevData) => ({
            ...prevData,
            aptoffice: "", // Clear selected office
        }));
    };

    const handleOfficeSelect = () => {
        setIsOfficeSelected(true);
        setFormData((prevData) => ({
            ...prevData,
            aptpurpose: "", // Reset selected purpose when changing office
            aptother: "",
            aptattach: [], // Reset attached files
        }));
    };

    const handleTimeSelect = () => {
        setIsTimeSelected(true);
    };

    const handleCheckboxChange = (e) => {
        setFormData({ ...formData, isConfirmed: e.target.checked });
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
                                    className=" p-0.5 text-center text-xs font-medium leading-none text-primary-100 rounded-md bg-amber-400"
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
                                    <div className="flex w-full justify-evenly mt-12">
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
                                    <h4 className="text-center text-sm min-w-full text-gray-500 mb-4">
                                        Click the box to select date and time
                                    </h4>
                                    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
                                        {/* Container for Calendar and TimePicker */}
                                        <div className="flex flex-col lg:flex-row justify-center items-center gap-8">
                                            {/* Calendar */}
                                            <div className="w-full lg:w-1/2">
                                                <Calendar
                                                    formData={formData}
                                                    setFormData={setFormData}
                                                    limit={limit}
                                                    appointments={appointments}
                                                    userRole={
                                                        user ? user.role : ""
                                                    }
                                                    setIsTimeSelected={
                                                        setIsTimeSelected
                                                    }
                                                />
                                            </div>

                                            {/* TimePicker */}
                                            <div className="w-full lg:w-1/2">
                                                <TimePicker
                                                    formData={formData}
                                                    setFormData={setFormData}
                                                    limit={limit}
                                                    appointments={appointments}
                                                    userRole={
                                                        user ? user.role : ""
                                                    }
                                                    setTimeSelected={
                                                        handleTimeSelect
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Navigation Buttons */}
                                    <div className="flex w-full justify-evenly mt-6">
                                        <button
                                            className="bg-red-700 hover:bg-red-900 text-white rounded-md inline-block px-8 py-2 text-md font-medium focus:relative"
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
                                        Review the following information before
                                        confirming
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
                                                checked={formData.isConfirmed}
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
                                                formData.isConfirmed
                                                    ? "bg-[#194F90] hover:bg-[#123A69]"
                                                    : "bg-gray-400 cursor-not-allowed"
                                            } font-semibold`}
                                            onClick={setApt}
                                            disabled={!formData.isConfirmed}
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
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-[80%] md:w-[500px] bg-[#194F90] rounded-lg shadow-lg p-2 sm:p-4 backdrop:bg-black/50 z-50"
                        onKeyDown={(event) => {
                            if (event.key === "Escape") {
                                event.preventDefault();
                            }
                        }}
                    >
                        <div className="relative flex flex-col justify-center items-center text-white bg-[#194F90] p-4 sm:p-6 w-full">
                            <button
                                className="cursor-pointer absolute top-1 right-1 text-white hover:text-gray-300 transition duration-300 focus:outline-none"
                                onClick={() => modals.current.close()}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 sm:h-6 sm:w-6 text-white"
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
                            <h2 className="text-lg sm:text-xl text-center">
                                Appointment has been Set Successfully
                            </h2>

                            <div className="item-center modal-action text-sm text-center mt-2 sm:mt-4">
                                <label style={{ verticalAlign: "middle" }}>
                                    <b className="text-sm sm:text-base">
                                        <br />
                                        Kindly wait for the office to confirm
                                        your appointment.
                                        <br />
                                        Confirmation will be sent via email.
                                    </b>
                                </label>
                            </div>
                            <h4 className="text-xs mt-4 sm:mt-6">
                                Note: Click the "X" to go back home.
                            </h4>
                        </div>
                    </dialog>

                    <dialog
                        ref={modals1}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-[80%] md:w-[500px] bg-[#194F90] rounded-lg shadow-lg p-2 sm:p-4 backdrop:bg-black/50 z-50"
                        onKeyDown={(event) => {
                            if (event.key === "Escape") {
                                event.preventDefault();
                            }
                        }}
                    >
                        <div className="relative flex flex-col justify-center items-center text-white bg-[#194F90] p-4 sm:p-6 w-full">
                            <button
                                className="absolute top-1 right-1 text-white hover:text-gray-300 transition duration-300 focus:outline-none"
                                onClick={() => modals1.current.close()}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 sm:h-6 sm:w-6 text-white"
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
                                <h1 className="text-red-400 text-lg sm:text-xl">
                                    Appointment Failed
                                </h1>
                                <h3 className="text-sm sm:text-base mt-2">
                                    You already have an ongoing appointment in
                                    this office.
                                </h3>
                                <h4 className="text-gray-200 text-xs mt-2 sm:mt-3">
                                    Note: Accomplish the transaction before
                                    scheduling another appointment.
                                </h4>
                                <h4 className="text-gray-200 text-xs mt-2 sm:mt-3">
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
