import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import EditOffice from "./Component/EditOffice";
import { useAuth } from "../../Hooks/useAuth";
import { useDebouncedEffect } from "../../Hooks/useDebouncedEffect";
import Calendar from "../Subcomponent/Calendar";
import TimePicker from "../Subcomponent/TimePicker";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import the CSS

function OfficeAdminManage() {
    const [offabbr, setoffabbr] = useState("");
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const { branch, role } = useAuth();
    const [offData, setoffData] = useState([]);
    const [selectedOffid, setSelectedOffid] = useState(null);
    const [selectedOffname, setSelectedOffname] = useState("");
    const [showEdit, setShowEdit] = useState(false);
    const [selectedOffice, setSelectedOffice] = useState(null);
    const [purpose, setPurpose] = useState("");
    const [disabledDates, setDisabledDates] = useState([]);
    const [disabledTimes, setDisabledTimes] = useState([]);
    const [calendarKey, setCalendarKey] = useState(0);
    const [timePickerKey, setTimePickerKey] = useState(0);
    const [formData, setFormData] = useState({
        aptoffice: "",
        aptbranch: branch,
        aptdate: "",
        apttime: "",
    });
    const [isTimeSelected, setIsTimeSelected] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Loading state

    const purposeModal = useRef(null);
    const dateTimeModal = useRef(null);

    const isDateDisabled = disabledDates.includes(formData.aptdate);
    const isTimeDisabled = disabledTimes.includes(formData.apttime);

    // Fetch office data
    const fetchOfficeData = useCallback(async () => {
        try {
            const getRes = await fetch(
                `${apiBaseUrl}/api/office/bybranchrole/${branch}/${role}`
            );
            const getDataResult = await getRes.json();
            setoffData(getDataResult);
        } catch (error) {
            console.error("Error fetching office data:", error);
            toast.error("Failed to fetch office data. Please try again later.");
        }
    }, [apiBaseUrl, branch, role]);

    useDebouncedEffect(
        () => {
            fetchOfficeData();
        },
        [fetchOfficeData],
        500
    );

    // Callback function to refetch data after adding or editing an office
    const handleSuccess = useCallback(() => {
        fetchOfficeData(); // Refetch the office data
    }, [fetchOfficeData]);

    // Memoized search results
    const searchResults = useMemo(() => {
        return offData.filter((office) =>
            office.offabbr.toLowerCase().includes(offabbr.toLowerCase())
        );
    }, [offabbr, offData]);

    // Open edit modal
    const toEdit = useCallback((e, officeNum) => {
        setShowEdit(true);
        setSelectedOffid(officeNum);
        window.location.href = "#edit";
        e.preventDefault();
    }, []);

    // Open purpose modal
    const openPurposeModal = useCallback((office, officeName) => {
        setSelectedOffice(office);
        setSelectedOffname(officeName);
        purposeModal.current.showModal();
    }, []);

    // Handle purpose insertion
    const handlePurposeInsert = useCallback(
        async (e) => {
            e.preventDefault();
            setIsLoading(true); // Set loading state
            try {
                const response = await fetch(
                    `${apiBaseUrl}/api/office/addPurpose`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            officeId: selectedOffice.offid,
                            purpose,
                        }),
                    }
                );
                if (response.ok) {
                    toast.success("Purpose inserted successfully.");
                    setPurpose(""); // Clear input
                    purposeModal.current.close();
                    handleSuccess(); // Refetch data
                } else {
                    toast.error("Failed to insert purpose.");
                }
            } catch (error) {
                console.error("Error:", error);
                toast.error("An unexpected error occurred. Please try again.");
            } finally {
                setIsLoading(false); // Reset loading state
            }
        },
        [apiBaseUrl, purpose, selectedOffice, handleSuccess]
    );

    // Open date/time modal
    const openDateTimeModal = useCallback((office) => {
        setSelectedOffice(office);
        setFormData((prev) => ({
            ...prev,
            aptoffice: office.offabbr,
            aptbranch: office.offbranch,
        }));
        dateTimeModal.current.showModal();
    }, []);

    // Fetch disabled dates and slots
    const fetchDisabledData = useCallback(async () => {
        if (!selectedOffice) return;

        try {
            const [datesRes, slotsRes] = await Promise.all([
                fetch(
                    `${apiBaseUrl}/api/office/disabled-dates/${selectedOffice.offabbr}/${branch}`
                ),
                formData.aptdate &&
                    fetch(
                        `${apiBaseUrl}/api/office/disabled-slots/${selectedOffice.offabbr}/${branch}`
                    ),
            ]);

            if (datesRes.ok) {
                const datesData = await datesRes.json();
                setDisabledDates(datesData.map((item) => item.date));
            }

            if (slotsRes?.ok) {
                const slotsData = await slotsRes.json();
                const timeSlotsForDate = slotsData
                    .filter(
                        (item) => item.date === formData.aptdate && item.time
                    )
                    .map((item) => item.time);
                setDisabledTimes(timeSlotsForDate);
            }
        } catch (error) {
            console.error("Error fetching disabled data:", error);
            toast.error("Failed to fetch disabled data. Please try again.");
        }
    }, [apiBaseUrl, branch, selectedOffice, formData.aptdate]);

    useDebouncedEffect(
        () => {
            fetchDisabledData();
        },
        [fetchDisabledData],
        500
    );

    // Reusable toggle function
    const toggleDateTime = useCallback(
        async (endpoint, payload) => {
            setIsLoading(true); // Set loading state
            try {
                const res = await fetch(`${apiBaseUrl}${endpoint}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                if (res.ok) {
                    const result = await res.json();
                    toast.success(result.message);
                    fetchDisabledData();
                    if (endpoint.includes("toggle-date")) {
                        setCalendarKey((prevKey) => prevKey + 1); // Force Calendar re-render
                    } else {
                        setTimePickerKey((prevKey) => prevKey + 1); // Force TimePicker re-render
                    }
                } else {
                    const errText = await res.text();
                    console.error("Toggle Failed:", errText);
                    toast.error("Error toggling. Please try again.");
                }
            } catch (error) {
                console.error("Error:", error);
                toast.error("An unexpected error occurred.");
            } finally {
                setIsLoading(false); // Reset loading state
            }
        },
        [apiBaseUrl, fetchDisabledData]
    );

    // Handle date toggle
    const handleDateToggle = useCallback(
        async (date) => {
            const payload = {
                date: date,
                time: null,
                aptoffice: selectedOffice?.offabbr,
                aptbranch: branch,
            };
            await toggleDateTime("/api/office/toggle-date", payload);
        },
        [branch, selectedOffice, toggleDateTime]
    );

    // Handle time toggle
    const handleTimeToggle = useCallback(
        async (date, time) => {
            const payload = {
                date: date,
                time: time,
                aptoffice: selectedOffice?.offabbr,
                aptbranch: branch,
            };
            await toggleDateTime("/api/office/toggle-slot", payload);
        },
        [branch, selectedOffice, toggleDateTime]
    );

    return (
        <div className="relative w-full h-full overflow-hidden">
            {/* Main Content */}
            <div
                className={`absolute w-full h-full transition-transform duration-500 ${
                    showEdit ? "-translate-x-full" : "translate-x-0"
                }`}
            >
                <div className="flex justify-center h-full w-full">
                    <div className="flex flex-col items-center gap-[20px]">
                        <input
                            className="text-gray-800 bg-white mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75] w-[300px] xsm:w-[200px] sm:w-[300px] text-md"
                            type="text"
                            placeholder="Enter Office Abbreviation"
                            value={offabbr}
                            onChange={(e) => setoffabbr(e.target.value)}
                        />

                        {searchResults.length !== 0 && (
                            <div className="border border-gray-200">
                                <table className="table-auto shadow-md rounded min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                                    <thead className="ltr:text-center rtl:text-center">
                                        <tr>
                                            <th className="whitespace-nowrap px-4 py-2 font-semibold text-gray-900">
                                                Office Name
                                            </th>
                                            <th className="whitespace-nowrap px-4 py-2 font-semibold text-gray-900">
                                                Office Abbreviation
                                            </th>
                                            <th className="whitespace-nowrap px-4 py-2 font-semibold text-gray-900">
                                                Office Limit
                                            </th>
                                            <th className="whitespace-nowrap px-4 py-2 font-semibold text-gray-900">
                                                Branch
                                            </th>
                                            <th className="whitespace-nowrap px-4 py-2 font-semibold text-gray-900">
                                                Tools
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-200 text-center">
                                        {searchResults
                                            .slice(0, 9)
                                            .map((office, index) => (
                                                <tr key={index}>
                                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                                        {office.offname}
                                                    </td>
                                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                                        {office.offabbr}
                                                    </td>
                                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                                        {office.offlimit}
                                                    </td>
                                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                                        {office.offbranch}
                                                    </td>
                                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                                        <button
                                                            className="group relative inline-block overflow-hidden border border-indigo-600 px-8 py-3 focus:outline-none focus:ring"
                                                            onClick={(e) =>
                                                                toEdit(
                                                                    e,
                                                                    office.offid
                                                                )
                                                            }
                                                        >
                                                            <span className="absolute inset-x-0 bottom-0 h-[2px] bg-indigo-600 transition-all group-hover:h-full group-active:bg-indigo-500"></span>
                                                            <span className="relative text-sm font-medium text-indigo-600 transition-colors group-hover:text-white">
                                                                Edit
                                                            </span>
                                                        </button>

                                                        <button
                                                            className="ml-4 group relative inline-block overflow-hidden border border-green-600 px-8 py-3 focus:outline-none focus:ring"
                                                            onClick={() =>
                                                                openPurposeModal(
                                                                    office,
                                                                    office.offname
                                                                )
                                                            }
                                                        >
                                                            <span className="absolute inset-x-0 bottom-0 h-[2px] bg-green-600 transition-all group-hover:h-full group-active:bg-red-500"></span>
                                                            <span className="relative text-sm font-medium text-green-600 transition-colors group-hover:text-white">
                                                                Purpose
                                                            </span>
                                                        </button>

                                                        <button
                                                            className="ml-4 group relative inline-block overflow-hidden border border-blue-600 px-8 py-3 focus:outline-none focus:ring"
                                                            onClick={() =>
                                                                openDateTimeModal(
                                                                    office
                                                                )
                                                            }
                                                        >
                                                            <span className="absolute inset-x-0 bottom-0 h-[2px] bg-blue-600 transition-all group-hover:h-full group-active:bg-blue-500"></span>
                                                            <span className="relative text-sm font-medium text-blue-600 transition-colors group-hover:text-white">
                                                                Date & Time
                                                            </span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <dialog
                        ref={purposeModal}
                        className="modal"
                        aria-labelledby="purpose-modal-title"
                    >
                        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] bg-[#194F90] rounded-lg shadow-lg p-4 backdrop:bg-black/50">
                            <div className="modal-box text-white bg-[#194F90]">
                                <h3
                                    id="purpose-modal-title"
                                    className="font-bold text-lg"
                                >
                                    Insert Purpose
                                </h3>
                                <p className="py-4">
                                    Office Name: {selectedOffname}
                                </p>

                                <form onSubmit={handlePurposeInsert}>
                                    <input
                                        type="text"
                                        value={purpose}
                                        onChange={(e) =>
                                            setPurpose(e.target.value)
                                        }
                                        placeholder="Enter purpose"
                                        className="text-gray-800 bg-white w-full mt-1 py-2 px-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75] mb-4"
                                    />
                                    <div className="modal-action flex justify-center gap-4">
                                        <button
                                            type="submit"
                                            className="mt-6 px-6 py-2 border border-white text-white rounded-lg transition duration-100 ease-in-out hover:bg-white hover:text-[#194F90]"
                                        >
                                            Insert
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                purposeModal.current.close()
                                            }
                                            className="mt-6 px-6 py-2 border border-white text-white rounded-lg transition duration-100 ease-in-out hover:bg-white hover:text-[#194F90]"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </dialog>

                    <dialog
                        ref={dateTimeModal}
                        className="modal"
                        aria-labelledby="datetime-modal-title"
                    >
                        <div className="p-6 fixed rounded-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl min-h-[60vh] lg:min-h-[70vh] overflow-y-auto flex flex-col justify-start items-center text-black bg-gray-50 shadow-lg">
                            <h3
                                id="datetime-modal-title"
                                className="font-bold text-lg"
                            >
                                Manage Date & Time
                            </h3>
                            <p className="py-2 text-gray-700">
                                Office:{" "}
                                {selectedOffice?.offname ||
                                    "No Office Selected"}
                            </p>

                            <div className="modal-action flex justify-center items-center gap-10">
                                <div className="flex flex-col items-center justify-center">
                                    <Calendar
                                        key={calendarKey} // Force re-render on date toggle
                                        formData={formData}
                                        setFormData={setFormData}
                                        limit={selectedOffice?.offlimit || 10}
                                        appointments={offData}
                                        userRole={role}
                                        disabledDates={disabledDates}
                                        setIsTimeSelected={setIsTimeSelected}
                                    />
                                    <button
                                        className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg w-full"
                                        onClick={async () => {
                                            if (formData.aptdate) {
                                                await handleDateToggle(
                                                    formData.aptdate
                                                );
                                            } else {
                                                toast.error(
                                                    "Please select a date to toggle."
                                                );
                                            }
                                        }}
                                    >
                                        {isDateDisabled
                                            ? "Enable Date"
                                            : "Disable Date"}
                                    </button>
                                </div>

                                <div className="flex flex-col items-center justify-center">
                                    <TimePicker
                                        key={timePickerKey} // Force re-render on time toggle
                                        formData={formData}
                                        setFormData={setFormData}
                                        limit={selectedOffice?.offlimit || 10}
                                        appointments={offData}
                                        setTimeSelected={() => {}}
                                        userRole={role}
                                        disabledTimes={disabledTimes}
                                    />
                                    <button
                                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg w-full"
                                        onClick={async () => {
                                            if (
                                                formData.aptdate &&
                                                formData.apttime
                                            ) {
                                                await handleTimeToggle(
                                                    formData.aptdate,
                                                    formData.apttime
                                                );
                                            } else {
                                                toast.error(
                                                    "Please select a date and time to toggle."
                                                );
                                            }
                                        }}
                                    >
                                        {isTimeDisabled
                                            ? "Enable Time"
                                            : "Disable Time"}
                                    </button>
                                </div>
                            </div>

                            <button
                                className="mt-6 px-4 py-2 bg-red-600 text-white rounded-lg"
                                onClick={() => dateTimeModal.current.close()}
                            >
                                Close
                            </button>
                        </div>
                    </dialog>
                </div>
            </div>

            {/* Edit Office Modal */}
            <div
                className={`absolute w-full h-full transition-transform duration-500 ${
                    showEdit ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {showEdit && (
                    <EditOffice
                        selectedOffid={selectedOffid}
                        setShowEdit={setShowEdit}
                        onSuccess={handleSuccess} // Pass onSuccess callback
                    />
                )}
            </div>
        </div>
    );
}

export default OfficeAdminManage;
