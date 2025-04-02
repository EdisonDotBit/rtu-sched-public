import { useEffect, useRef, useState } from "react";
import SelectOffice from "./Subcomponent/SelectOffice";
import Calendar from "./Subcomponent/Calendar";
import GuestDetails from "./Subcomponent/GuestDetails";
import ConfirmationG from "./Subcomponent/ConfirmationG";
import SelectBranch from "./Subcomponent/SelectBranch";
import axios from "axios";
import TimePicker from "./Subcomponent/TimePicker";

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
            const fetchOffices = async () => {
                try {
                    const response = await axios.get(
                        `${apiBaseUrl}/api/office/all`,
                        { params: { branch: formData.aptbranch } }
                    );
                    setOffice(response.data);
                } catch (error) {
                    console.error("Error fetching offices:", error);
                }
            };
            fetchOffices();
        }
    }, [formData.aptbranch, apiBaseUrl]);

    useEffect(() => {
        const getData = async () => {
            const getRes = await fetch(
                `${apiBaseUrl}/api/allongoingandconfirmed`
            );
            const getDataResult = await getRes.json();
            setAppointments(getDataResult);
        };
        getData();
    }, []);

    useEffect(() => {
        const newErrors = {};
        if (
            !formData.aptpurpose ||
            formData.aptpurpose === "--Select Purpose--"
        ) {
            newErrors.aptpurpose = "Please select a purpose.";
        }
        if (
            formData.aptpurpose &&
            formData.aptpurpose.toLowerCase().includes("other") &&
            (!formData.aptother || formData.aptother.trim() === "")
        ) {
            newErrors.aptother = "Please specify the other purposes here.";
        }
        if (!formData.aptstudnum) {
            newErrors.aptstudnum = "ID number and type is required.";
        } else if (!/^\d+ \/ [a-zA-Z0-9\s.]+$/.test(formData.aptstudnum)) {
            newErrors.aptstudnum =
                "ID Number must follow the format: ID Number / Type.";
        }
        if (!formData.aptname) {
            newErrors.aptname = "Full name is required.";
        } else if (formData.aptname.length < 10) {
            newErrors.aptname = "Full name must be at least 10 characters.";
        }
        if (!formData.aptpnumber) {
            newErrors.aptpnumber = "Contact number is required.";
        } else if (
            formData.aptpnumber &&
            !/^[0-9]{11}$/.test(formData.aptpnumber)
        ) {
            newErrors.aptpnumber = "Contact number must be 11 digits long.";
        }
        if (!formData.aptemail) {
            newErrors.aptemail = "Email is required.";
        } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.aptemail)) {
            newErrors.aptemail = "Please use a valid Gmail address.";
        }

        setErrors(newErrors);
        setIsInputFilled(Object.keys(newErrors).length === 0);
    }, [formData]);

    const setApt = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        const officeCount = appointments.reduce((count, appointment) => {
            if (
                appointment.aptoffice === formData.aptoffice &&
                appointment.aptbranch === formData.aptbranch &&
                appointment.aptemail === formData.aptemail
            ) {
                count++;
            }
            return count;
        }, 0);

        if (officeCount >= 1) {
            openmodal1();
            setIsSubmitting(false);
            return;
        }

        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach((key) => {
                if (key === "aptattach" && Array.isArray(formData[key])) {
                    formData[key].forEach((file) => {
                        formDataToSend.append("aptattach[]", file);
                    });
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            });

            const res = await axios.post(
                `${apiBaseUrl}/api/setappt`,
                formDataToSend,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (res.status === 200) {
                openmodal(res.data.data);
            }
        } catch (error) {
            console.error("Appointment failed:", error);
            alert("Appointment failed. Please check your details");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBranchSelect = () => {
        setIsBranchSelected(true);
        setIsOfficeSelected(false);
        setFormData((prevData) => ({ ...prevData, aptoffice: "" }));
    };

    const handleOfficeSelect = () => {
        setIsOfficeSelected(true);
        setFormData((prevData) => ({
            ...prevData,
            aptpurpose: "",
            aptother: "",
            aptattach: [],
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
        <form className="w-full py-6 sm:py-6 sm:px-12 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold text-gray-800">
                    Set an Appointment
                </h1>
                <p className="text-gray-600">
                    Schedule your visit to RTU offices
                </p>
            </div>

            {/* Main Content */}
            <div>
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                            Step {step} of 5
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                            {step * 20}% complete
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${step * 20}%` }}
                        ></div>
                    </div>
                </div>

                {/* Form Steps */}
                <div className="space-y-6">
                    {/* Step 1: Select Branch */}
                    {step === 1 && (
                        <div>
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    Select Branch
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Choose your preferred RTU campus location
                                </p>
                            </div>

                            <div className="w-full">
                                <SelectBranch
                                    formData={formData}
                                    setFormData={setFormData}
                                    setBranchSelected={handleBranchSelect}
                                />
                            </div>

                            <div className="flex justify-center mt-8">
                                <button
                                    className={`px-6 py-2 rounded-lg text-white font-medium transition-colors ${
                                        isBranchSelected
                                            ? "bg-blue-600 hover:bg-blue-700"
                                            : "bg-gray-400 cursor-not-allowed"
                                    }`}
                                    onClick={nextStep}
                                    disabled={!isBranchSelected}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Select Office */}
                    {step === 2 && (
                        <div>
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    Select Office
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Choose the office you need to visit
                                </p>
                            </div>

                            <div className="w-full">
                                <SelectOffice
                                    formData={formData}
                                    setFormData={setFormData}
                                    office={office}
                                    setOffice={setOffice}
                                    setLimit={setLimit}
                                    setOfficeSelected={handleOfficeSelect}
                                />
                            </div>

                            <div className="flex justify-center mt-8 gap-8">
                                <button
                                    className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                                    onClick={prevStep}
                                >
                                    Back
                                </button>
                                <button
                                    className={`px-6 py-2 rounded-lg text-white font-medium transition-colors ${
                                        isOfficeSelected
                                            ? "bg-blue-600 hover:bg-blue-700"
                                            : "bg-gray-400 cursor-not-allowed"
                                    }`}
                                    onClick={nextStep}
                                    disabled={!isOfficeSelected}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Select Date & Time */}
                    {step === 3 && (
                        <div>
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    Select Date & Time
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Choose your preferred appointment schedule
                                </p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-gray-50 sm:p-4 rounded-lg">
                                    <Calendar
                                        formData={formData}
                                        setFormData={setFormData}
                                        limit={limit}
                                        appointments={appointments}
                                        userRole={formData.apttype}
                                        setIsTimeSelected={setIsTimeSelected}
                                    />
                                </div>
                                <div className="bg-gray-50 sm:p-4 rounded-lg">
                                    <TimePicker
                                        formData={formData}
                                        setFormData={setFormData}
                                        limit={limit}
                                        appointments={appointments}
                                        userRole={formData.apttype}
                                        setTimeSelected={handleTimeSelect}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-center mt-8 gap-8">
                                <button
                                    className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                                    onClick={prevStep}
                                >
                                    Back
                                </button>
                                <button
                                    className={`px-6 py-2 rounded-lg text-white font-medium transition-colors ${
                                        isTimeSelected
                                            ? "bg-blue-600 hover:bg-blue-700"
                                            : "bg-gray-400 cursor-not-allowed"
                                    }`}
                                    onClick={nextStep}
                                    disabled={!isTimeSelected}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Input Details */}
                    {step === 4 && (
                        <div>
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    Appointment Details
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Provide additional information for your
                                    appointment
                                </p>
                            </div>

                            <div className="w-full">
                                <GuestDetails
                                    formData={formData}
                                    setFormData={setFormData}
                                    errors={errors}
                                />
                            </div>

                            <div className="flex justify-center mt-8 gap-8">
                                <button
                                    className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                                    onClick={prevStep}
                                >
                                    Back
                                </button>
                                <button
                                    className={`px-6 py-2 rounded-lg text-white font-medium transition-colors ${
                                        isInputFilled
                                            ? "bg-blue-600 hover:bg-blue-700"
                                            : "bg-gray-400 cursor-not-allowed"
                                    }`}
                                    onClick={nextStep}
                                    disabled={!isInputFilled}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 5: Confirmation */}
                    {step === 5 && (
                        <div>
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    Confirm Appointment
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Review your appointment details before
                                    submission
                                </p>
                            </div>

                            <div className="w-full">
                                <ConfirmationG formData={formData} />

                                <div className="mt-2 flex items-start">
                                    <input
                                        type="checkbox"
                                        id="confirmation-checkbox"
                                        className="mt-1 mr-3 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                        checked={formData.isConfirmed}
                                        onChange={handleCheckboxChange}
                                    />
                                    <label
                                        htmlFor="confirmation-checkbox"
                                        className="text-sm text-gray-700"
                                    >
                                        I confirm that the above information is{" "}
                                        <b>true and correct</b> and{" "}
                                        <b>
                                            I consent Rizal Technological
                                            University
                                        </b>{" "}
                                        under the standards of Data Protection
                                        and Privacy to{" "}
                                        <b>collect and process</b> the given
                                        data.
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-center mt-8 gap-8">
                                <button
                                    className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                                    onClick={prevStep}
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    className={`px-6 py-2 rounded-lg text-white font-medium transition-colors ${
                                        formData.isConfirmed
                                            ? "bg-blue-600 hover:bg-blue-700"
                                            : "bg-gray-400 cursor-not-allowed"
                                    }`}
                                    onClick={setApt}
                                    disabled={
                                        !formData.isConfirmed || isSubmitting
                                    }
                                >
                                    {isSubmitting ? "Submitting..." : "Confirm"}
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
                onKeyDown={(e) => e.key === "Escape" && e.preventDefault()}
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
                        {succData && (
                            <div className="mb-4">
                                <p className="text-lg font-semibold text-gray-800">
                                    Your Appointment Number:
                                </p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {succData.aptid}
                                </p>
                            </div>
                        )}
                        <p className="text-sm text-gray-500 mb-6">
                            Please take note of the appointment number.
                        </p>
                        <p className="text-gray-700 mb-4">
                            Your appointment has been scheduled successfully!
                        </p>
                        <p className="text-sm text-gray-500 mb-6">
                            Kindly wait for the office to confirm your
                            appointment. Confirmation will be sent via email.
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
                onKeyDown={(e) => e.key === "Escape" && e.preventDefault()}
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
                            You already have an ongoing appointment in this
                            office.
                        </p>
                        <p className="text-sm text-gray-500 mb-6">
                            Please complete your current transaction first.
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
        </form>
    );
}

export default GuestSetAppointment;
