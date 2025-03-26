import { useEffect, useRef, useState } from "react";
import SelectOffice from "./Subcomponent/SelectOffice";
import Calendar from "./Subcomponent/Calendar";
import SelectBranch from "./Subcomponent/SelectBranch";
import axios from "axios";
import TimePicker from "./Subcomponent/TimePicker";
import GuestDetails from "./Subcomponent/GuestDetails";
import ConfirmationG from "./Subcomponent/ConfirmationG";

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

        // Validate Purpose
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

        // Validate Student Number (Format: ####-######)
        if (!formData.aptstudnum) {
            newErrors.aptstudnum = "ID number and type is required.";
        } else if (!/^\d+ \/ [a-zA-Z0-9\s.]+$/.test(formData.aptstudnum)) {
            newErrors.aptstudnum =
                "ID Number must follow the format: ID Number / Type.";
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

        // Validate Email (Ensure it's not empty and ends with gmail or yahoo.com)
        if (!formData.aptemail) {
            newErrors.aptemail = "Personal email is required.";
        } else if (
            !/^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com)$/.test(
                formData.aptemail
            )
        ) {
            newErrors.aptemail =
                "Personal email must be in gmail or yahoo format.";
        }

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
                appointment.aptoffice === formData.aptoffice &&
                appointment.aptbranch === formData.aptbranch && // Same Branch
                appointment.aptemail === formData.aptemail // Ensure it's the same guest email
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
                                    <div className="flex w-full justify-evenly mt-6">
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
                                    <div className="flex w-full justify-evenly mt-6">
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
                                                    userRole={formData.apttype}
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
                                                    appointments={appointments}
                                                    limit={limit}
                                                    setTimeSelected={
                                                        handleTimeSelect
                                                    }
                                                    userRole={formData.apttype}
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
                                    <div className="w-full">
                                        <GuestDetails
                                            formData={formData}
                                            setFormData={setFormData}
                                            errors={errors}
                                        />
                                    </div>
                                    <div className="flex w-full justify-evenly mt-6">
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
                                        <ConfirmationG formData={formData} />
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

                    {/* Success Modal */}
                    <dialog
                        ref={modals}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-xl shadow-lg p-4 sm:p-6 backdrop:bg-gray-900/50 z-50 border-none"
                        onKeyDown={(e) =>
                            e.key === "Escape" && e.preventDefault()
                        }
                    >
                        <div className="relative">
                            <button
                                onClick={() => modals.current?.close()}
                                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                                aria-label="Close dialog"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>

                            <div className="text-center">
                                <div className="mx-auto bg-green-100 p-3 rounded-full w-max mb-4">
                                    <svg
                                        className="w-8 h-8 text-green-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    Appointment Scheduled
                                </h3>
                                <p className="text-gray-700 mb-4">
                                    Your appointment has been scheduled
                                    successfully!
                                </p>
                                <p className="text-sm text-gray-500 mb-6">
                                    Kindly wait for the office to confirm your
                                    appointment. Confirmation will be sent via
                                    email.
                                </p>

                                <button
                                    onClick={() => modals.current?.close()}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </dialog>

                    {/* Conflict Modal */}
                    <dialog
                        ref={modals1}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[500px] bg-white rounded-xl shadow-lg p-4 sm:p-6 backdrop:bg-black/50 z-50 border-none"
                        onKeyDown={(e) =>
                            e.key === "Escape" && e.preventDefault()
                        }
                    >
                        <div className="relative">
                            <button
                                onClick={() => modals1.current.close()}
                                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition"
                                aria-label="Close dialog"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>

                            <div className="text-center">
                                <div className="mx-auto bg-red-100 p-3 rounded-full w-max mb-4">
                                    <svg
                                        className="w-8 h-8 text-red-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                        />
                                    </svg>
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    Appointment Conflict
                                </h3>
                                <p className="text-gray-700 mb-4">
                                    You already have an ongoing appointment in
                                    this office.
                                </p>
                                <p className="text-sm text-gray-500 mb-6">
                                    Please complete your current transaction
                                    first.
                                </p>

                                <button
                                    onClick={() => modals1.current.close()}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </dialog>
                </div>
            </form>
        </>
    );
}

export default GuestSetAppointment;
