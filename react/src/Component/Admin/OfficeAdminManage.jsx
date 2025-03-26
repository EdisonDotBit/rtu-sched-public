import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import EditOffice from "./Component/EditOffice";
import { useAuth } from "../../Hooks/useAuth";
import { useDebouncedEffect } from "../../Hooks/useDebouncedEffect";
import Calendar from "../Subcomponent/Calendar";
import TimePicker from "../Subcomponent/TimePicker";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    const [isLoading, setIsLoading] = useState(false);
    const [purposes, setPurposes] = useState([]);
    const [instruction, setInstruction] = useState("");
    const [selectedPurpose, setSelectedPurpose] = useState(null);
    const [purposeToDelete, setPurposeToDelete] = useState(null);

    const purposeModal = useRef(null);
    const dateTimeModal = useRef(null);
    const instructionModal = useRef(null);
    const deleteModal = useRef(null);

    const isDateDisabled = disabledDates.includes(formData.aptdate);
    const isTimeDisabled = disabledTimes.includes(formData.apttime);

    // Fetch office data
    const fetchOfficeData = useCallback(async () => {
        setIsLoading(true);
        try {
            const getRes = await fetch(
                `${apiBaseUrl}/api/office/bybranchrole/${branch}/${role}`
            );
            const getDataResult = await getRes.json();
            setoffData(getDataResult);
            // Set the first office as selected by default
            if (getDataResult.length > 0 && !selectedOffice) {
                setSelectedOffice(getDataResult[0]);
            }
        } catch (error) {
            console.error("Error fetching office data:", error);
            toast.error("Failed to fetch office data. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }, [apiBaseUrl, branch, role, selectedOffice]);

    const fetchPurposes = useCallback(async () => {
        if (!selectedOffice || !selectedOffice.offabbr) {
            console.error(
                "Selected office is missing or invalid:",
                selectedOffice
            );
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(
                `${apiBaseUrl}/api/office/purposes/${selectedOffice.offabbr}/${branch}`
            );

            if (!res.ok) {
                throw new Error(`Error fetching purposes: ${res.status}`);
            }

            const data = await res.json();
            console.log("Fetched purposes:", data);
            setPurposes(data);
        } catch (error) {
            console.error("Error fetching purposes:", error);
            toast.error("Failed to fetch purposes. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }, [apiBaseUrl, branch, selectedOffice]);

    useDebouncedEffect(
        () => {
            fetchOfficeData();
        },
        [fetchOfficeData],
        500
    );

    useEffect(() => {
        if (selectedOffice) {
            fetchPurposes();
        }
    }, [selectedOffice, fetchPurposes]);

    const handleSuccess = useCallback(() => {
        fetchOfficeData();
        if (selectedOffice) {
            fetchPurposes();
        }
    }, [fetchOfficeData, fetchPurposes, selectedOffice]);

    const searchResults = useMemo(() => {
        return offData.filter((office) =>
            office.offabbr.toLowerCase().includes(offabbr.toLowerCase())
        );
    }, [offabbr, offData]);

    const toEdit = useCallback((e, officeNum) => {
        setShowEdit(true);
        setSelectedOffid(officeNum);
        window.location.href = "#edit";
        e.preventDefault();
    }, []);

    const openPurposeModal = useCallback((office, officeName) => {
        setSelectedOffice(office);
        setSelectedOffname(officeName);
        purposeModal.current.showModal();
    }, []);

    const openInstructionModal = useCallback((purposeItem) => {
        setSelectedPurpose(purposeItem);
        setInstruction(purposeItem.instruction || "");
        instructionModal.current.showModal();
    }, []);

    const handlePurposeInsert = useCallback(
        async (e) => {
            e.preventDefault();
            setIsLoading(true);
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
                    setPurpose("");
                    purposeModal.current.close();
                    handleSuccess();
                } else {
                    toast.error("Failed to insert purpose.");
                }
            } catch (error) {
                console.error("Error:", error);
                toast.error("An unexpected error occurred. Please try again.");
            } finally {
                setIsLoading(false);
            }
        },
        [apiBaseUrl, purpose, selectedOffice, handleSuccess]
    );

    const handleInstructionSave = useCallback(
        async (e) => {
            e.preventDefault();
            setIsLoading(true);
            try {
                const response = await fetch(
                    `${apiBaseUrl}/api/office/updateInstruction`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            purposeId: selectedPurpose.id,
                            instruction,
                        }),
                    }
                );
                if (response.ok) {
                    toast.success("Instruction saved successfully.");
                    instructionModal.current.close();
                    handleSuccess();
                } else {
                    toast.error("Failed to save instruction.");
                }
            } catch (error) {
                console.error("Error:", error);
                toast.error("An unexpected error occurred. Please try again.");
            } finally {
                setIsLoading(false);
            }
        },
        [apiBaseUrl, instruction, selectedPurpose, handleSuccess]
    );

    const deletePurpose = useCallback(
        async (purposeId) => {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `${apiBaseUrl}/api/office/deletePurpose/${purposeId}`,
                    {
                        method: "DELETE",
                    }
                );
                if (response.ok) {
                    toast.success("Purpose deleted successfully.");
                    handleSuccess();
                } else {
                    toast.error("Failed to delete purpose.");
                }
            } catch (error) {
                console.error("Error:", error);
                toast.error("An unexpected error occurred. Please try again.");
            } finally {
                setIsLoading(false);
                setPurposeToDelete(null); // Reset after deletion
            }
        },
        [apiBaseUrl, handleSuccess]
    );

    const confirmDelete = (purposeItem) => {
        setPurposeToDelete(purposeItem);
        deleteModal.current.showModal();
    };

    const openDateTimeModal = useCallback((office) => {
        setSelectedOffice(office);
        setFormData((prev) => ({
            ...prev,
            aptoffice: office.offabbr,
            aptbranch: office.offbranch,
        }));
        dateTimeModal.current.showModal();
    }, []);

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

    const toggleDateTime = useCallback(
        async (endpoint, payload) => {
            setIsLoading(true);
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
                        setCalendarKey((prevKey) => prevKey + 1);
                    } else {
                        setTimePickerKey((prevKey) => prevKey + 1);
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
                setIsLoading(false);
            }
        },
        [apiBaseUrl, fetchDisabledData]
    );

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
        <div className="relative w-full h-full overflow-hidden bg-gray-50">
            {/* Main Content */}
            <div
                className={`absolute w-full h-full transition-transform duration-500 ${
                    showEdit ? "-translate-x-full" : "translate-x-0"
                }`}
            >
                <div className="p-6 max-w-7xl mx-auto h-full flex flex-col overflow-y-auto">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-800">
                            Office Management
                        </h1>
                        <p className="text-gray-600">
                            Manage offices for {branch} branch
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 flex flex-col">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div className="relative flex-grow max-w-md">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg
                                        className="h-5 w-5 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-400"
                                    type="text"
                                    placeholder="Search by office abbreviation..."
                                    value={offabbr}
                                    onChange={(e) => setoffabbr(e.target.value)}
                                    aria-label="Search Office Abbreviation"
                                />
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center items-center py-12 flex-grow">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : searchResults.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg flex-grow flex flex-col justify-center">
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <h3 className="mt-2 text-lg font-medium text-gray-900">
                                    No offices found
                                </h3>
                                <p className="mt-1 text-gray-500">
                                    Try adjusting your search
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto flex-grow">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Office Name
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Abbreviation
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Limit
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Branch
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {searchResults.map((office, index) => (
                                            <tr
                                                key={index}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {office.offname}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {office.offabbr}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {office.offlimit}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {office.offbranch}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                                                    <div className="flex justify-end space-x-2">
                                                        <button
                                                            onClick={(e) =>
                                                                toEdit(
                                                                    e,
                                                                    office.offid
                                                                )
                                                            }
                                                            className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200"
                                                            aria-label={`Edit ${office.offname}`}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                openDateTimeModal(
                                                                    office
                                                                )
                                                            }
                                                            className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200"
                                                            aria-label={`Manage date/time for ${office.offname}`}
                                                        >
                                                            Date & Time
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Purposes Table - Always visible */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div className="w-full md:w-auto">
                                <label
                                    htmlFor="office-select"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Office Name
                                </label>
                                <select
                                    id="office-select"
                                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                    value={selectedOffice?.offid || ""}
                                    onChange={(e) => {
                                        const officeId = e.target.value;
                                        const office = offData.find(
                                            (o) => o.offid === officeId
                                        );
                                        setSelectedOffice(office);
                                    }}
                                >
                                    {offData.map((office) => (
                                        <option
                                            key={office.offid}
                                            value={office.offid}
                                        >
                                            {office.offname} ({office.offabbr})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {selectedOffice && (
                                <button
                                    onClick={() =>
                                        openPurposeModal(
                                            selectedOffice,
                                            selectedOffice.offname
                                        )
                                    }
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors self-end md:self-auto"
                                >
                                    Add Purpose
                                </button>
                            )}
                        </div>

                        {!selectedOffice ? (
                            <div className="text-center py-8 bg-gray-50 rounded-lg">
                                <p className="text-gray-600">
                                    Please select an office to view purposes
                                </p>
                            </div>
                        ) : purposes.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-lg">
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <p className="mt-2 text-gray-600">
                                    No purposes added yet
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Purpose
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Instruction
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {purposes.map((purposeItem, index) => (
                                            <tr
                                                key={index}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {purposeItem.purpose}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {purposeItem.instruction ? (
                                                        <button
                                                            onClick={() =>
                                                                openInstructionModal(
                                                                    purposeItem
                                                                )
                                                            }
                                                            className="text-blue-600 hover:text-blue-800 flex items-center"
                                                        >
                                                            <svg
                                                                className="h-5 w-5 mr-1"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                />
                                                            </svg>
                                                            View Instruction
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() =>
                                                                openInstructionModal(
                                                                    purposeItem
                                                                )
                                                            }
                                                            className="text-gray-500 hover:text-gray-700 flex items-center"
                                                        >
                                                            <svg
                                                                className="h-5 w-5 mr-1"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                                                />
                                                            </svg>
                                                            Add Instruction
                                                        </button>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() =>
                                                            confirmDelete(
                                                                purposeItem
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-900"
                                                        disabled={isLoading}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Purpose Modal */}
            <dialog
                ref={purposeModal}
                className="modal top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop:bg-gray-900/50 backdrop:backdrop-blur-sm"
                aria-labelledby="purpose-modal-title"
            >
                <div className="modal-box max-w-md bg-white rounded-xl shadow-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3
                            id="purpose-modal-title"
                            className="text-lg font-bold text-gray-900"
                        >
                            Insert Purpose
                        </h3>
                        <button
                            onClick={() => purposeModal.current.close()}
                            className="text-gray-400 hover:text-gray-500"
                            aria-label="Close modal"
                        >
                            <svg
                                className="h-6 w-6"
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
                    </div>
                    <div className="mb-6">
                        <p className="text-gray-600 mb-2">
                            Office: {selectedOffname}
                        </p>
                        <form onSubmit={handlePurposeInsert}>
                            <input
                                type="text"
                                value={purpose}
                                onChange={(e) => setPurpose(e.target.value)}
                                placeholder="Enter purpose"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                                required
                            />
                        </form>
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            className="px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            onClick={() => purposeModal.current.close()}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 border border-transparent text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={handlePurposeInsert}
                            disabled={isLoading}
                        >
                            {isLoading ? "Inserting..." : "Insert"}
                        </button>
                    </div>
                </div>
            </dialog>

            {/* Delete Confirmation Modal */}
            <dialog
                ref={deleteModal}
                className="modal top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop:bg-gray-900/50 backdrop:backdrop-blur-sm"
                aria-labelledby="delete-modal-title"
            >
                <div className="modal-box max-w-md bg-white rounded-xl shadow-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3
                            id="delete-modal-title"
                            className="text-lg font-bold text-gray-900"
                        >
                            Confirm Deletion
                        </h3>
                        <button
                            onClick={() => deleteModal.current.close()}
                            className="text-gray-400 hover:text-gray-500"
                            aria-label="Close modal"
                        >
                            <svg
                                className="h-6 w-6"
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
                    </div>
                    <div className="mb-6">
                        <p className="text-gray-600 mb-2">
                            Are you sure you want to delete the purpose:{" "}
                            <strong>{purposeToDelete?.purpose}</strong>?
                        </p>
                        <p className="text-gray-500 text-sm">
                            This action cannot be undone.
                        </p>
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            className="px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            onClick={() => {
                                deleteModal.current.close();
                                setPurposeToDelete(null);
                            }}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="px-4 py-2 border border-transparent text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            onClick={() => {
                                deletePurpose(purposeToDelete.id);
                                deleteModal.current.close();
                            }}
                            disabled={isLoading}
                        >
                            {isLoading ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                </div>
            </dialog>

            {/* Instruction Modal */}
            <dialog
                ref={instructionModal}
                className="modal top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop:bg-gray-900/50 backdrop:backdrop-blur-sm"
                aria-labelledby="instruction-modal-title"
            >
                <div className="modal-box max-w-2xl bg-white rounded-xl shadow-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3
                            id="instruction-modal-title"
                            className="text-lg font-bold text-gray-900"
                        >
                            {selectedPurpose?.instruction
                                ? "Edit Instruction"
                                : "Add Instruction"}
                        </h3>
                        <button
                            onClick={() => instructionModal.current.close()}
                            className="text-gray-400 hover:text-gray-500"
                            aria-label="Close modal"
                        >
                            <svg
                                className="h-6 w-6"
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
                    </div>
                    <div className="mb-6">
                        <p className="text-gray-600 mb-2">
                            Purpose: {selectedPurpose?.purpose}
                        </p>
                        <form onSubmit={handleInstructionSave}>
                            <textarea
                                value={instruction}
                                onChange={(e) => setInstruction(e.target.value)}
                                placeholder="Enter detailed instructions for this purpose..."
                                className="w-full h-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                                required
                            />
                        </form>
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            className="px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            onClick={() => instructionModal.current.close()}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 border border-transparent text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={handleInstructionSave}
                            disabled={isLoading}
                        >
                            {isLoading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
            </dialog>

            {/* Date/Time Modal */}
            <dialog
                ref={dateTimeModal}
                className="modal top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop:bg-gray-900/50 backdrop:backdrop-blur-sm"
                aria-labelledby="datetime-modal-title"
            >
                <div className="modal-box max-w-4xl bg-white rounded-xl shadow-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3
                            id="datetime-modal-title"
                            className="text-lg font-bold text-gray-900"
                        >
                            Manage Date & Time
                        </h3>
                        <button
                            onClick={() => dateTimeModal.current.close()}
                            className="text-gray-400 hover:text-gray-500"
                            aria-label="Close modal"
                        >
                            <svg
                                className="h-6 w-6"
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
                    </div>
                    <p className="text-gray-600 mb-6">
                        Office:{" "}
                        {selectedOffice?.offname || "No Office Selected"}
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="flex flex-col items-center">
                            <Calendar
                                key={calendarKey}
                                formData={formData}
                                setFormData={setFormData}
                                limit={selectedOffice?.offlimit || 10}
                                appointments={offData}
                                userRole={role}
                                disabledDates={disabledDates}
                            />
                            <button
                                className="mt-4 px-4 py-2 w-full bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
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
                                disabled={isLoading || !formData.aptdate}
                            >
                                {isLoading
                                    ? "Processing..."
                                    : isDateDisabled
                                    ? "Enable Date"
                                    : "Disable Date"}
                            </button>
                        </div>

                        <div className="flex flex-col items-center">
                            <TimePicker
                                key={timePickerKey}
                                formData={formData}
                                setFormData={setFormData}
                                limit={selectedOffice?.offlimit || 10}
                                appointments={offData}
                                userRole={role}
                                disabledTimes={disabledTimes}
                            />
                            <button
                                className="mt-4 px-4 py-2 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
                                onClick={async () => {
                                    if (formData.aptdate && formData.apttime) {
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
                                disabled={
                                    isLoading ||
                                    !formData.aptdate ||
                                    !formData.apttime
                                }
                            >
                                {isLoading
                                    ? "Processing..."
                                    : isTimeDisabled
                                    ? "Enable Time"
                                    : "Disable Time"}
                            </button>
                        </div>
                    </div>
                </div>
            </dialog>

            {/* Edit Office Panel */}
            <div
                className={`absolute w-full h-full transition-transform duration-500 ${
                    showEdit ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {showEdit && (
                    <EditOffice
                        selectedOffid={selectedOffid}
                        setShowEdit={setShowEdit}
                        onSuccess={handleSuccess}
                    />
                )}
            </div>
        </div>
    );
}

export default OfficeAdminManage;
