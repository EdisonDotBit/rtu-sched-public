import { useState, useRef, useCallback, useEffect } from "react";
import EditOffice from "./Component/EditOffice";
import { useAuth } from "../../Hooks/useAuth";
import { useDebouncedEffect } from "../../Hooks/useDebouncedEffect";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OfficeList from "./Component/OfficeAdmin/OfficeList";
import PurposeList from "./Component/OfficeAdmin/PurposeList";
import PurposeModal from "./Component/OfficeAdmin/PurposeModal";
import InstructionModal from "./Component/OfficeAdmin/InstructionModal";
import DeleteModal from "./Component/OfficeAdmin/DeleteModal";
import DateTimeModal from "./Component/OfficeAdmin/DateTimeModal";
import EditLimitModal from "./Component/OfficeAdmin/EditLimitModal";

function OfficeAdminManage() {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const { branch, role } = useAuth();

    // State management
    const [offabbr, setoffabbr] = useState("");
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
    const [isLoading, setIsLoading] = useState(false);
    const [purposes, setPurposes] = useState([]);
    const [instruction, setInstruction] = useState("");
    const [selectedPurpose, setSelectedPurpose] = useState(null);
    const [purposeToDelete, setPurposeToDelete] = useState(null);

    const [formData, setFormData] = useState({
        aptoffice: "",
        aptbranch: branch,
        aptdate: "",
        apttime: "",
    });

    // Refs for modals
    const purposeModal = useRef(null);
    const dateTimeModal = useRef(null);
    const instructionModal = useRef(null);
    const deleteModal = useRef(null);
    const editLimitModalRef = useRef(null);

    // Derived state
    const isDateDisabled = disabledDates.includes(formData.aptdate);
    const isTimeDisabled = disabledTimes.includes(formData.apttime);
    const [isTimeSelected, setIsTimeSelected] = useState(false);

    // Memoized filtered offices
    const searchResults = offData.filter((office) =>
        office.offabbr.toLowerCase().includes(offabbr.toLowerCase())
    );

    // API fetch functions with abort controller
    const fetchData = useCallback(async (url, errorMessage, signal) => {
        try {
            const response = await fetch(url, { signal });
            if (!response.ok) {
                throw new Error(errorMessage);
            }
            return await response.json();
        } catch (error) {
            if (error.name !== "AbortError") {
                console.error(error);
                toast.error(error.message);
            }
            throw error;
        }
    }, []);

    // Main data fetching effect - runs once on mount and when branch/role changes
    useEffect(() => {
        const controller = new AbortController();

        const loadInitialData = async () => {
            setIsLoading(true);
            try {
                const data = await fetchData(
                    `${apiBaseUrl}/api/office/bybranchrole/${branch}/${role}`,
                    "Failed to fetch office data",
                    controller.signal
                );

                setoffData(data);

                // Set first office as selected if none is selected
                if (data.length > 0 && !selectedOffice) {
                    setSelectedOffice(data[0]);
                }
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Initial data loading error:", error);
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();

        return () => controller.abort();
    }, [apiBaseUrl, branch, role, fetchData]);

    // Fetch purposes when selected office changes
    useEffect(() => {
        if (!selectedOffice?.offabbr) return;

        const controller = new AbortController();

        const loadPurposes = async () => {
            setIsLoading(true);
            try {
                const data = await fetchData(
                    `${apiBaseUrl}/api/office/purposes/${selectedOffice.offabbr}/${branch}`,
                    "Failed to fetch purposes",
                    controller.signal
                );
                setPurposes(data);
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Purpose loading error:", error);
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadPurposes();

        return () => controller.abort();
    }, [apiBaseUrl, branch, selectedOffice, fetchData]);

    // Fetch disabled dates and times when selected office or date changes
    useDebouncedEffect(
        () => {
            if (!selectedOffice) return;

            const controller = new AbortController();

            const loadDisabledData = async () => {
                try {
                    const [datesData, slotsData] = await Promise.all([
                        fetchData(
                            `${apiBaseUrl}/api/office/disabled-dates/${selectedOffice.offabbr}/${branch}`,
                            "Failed to fetch disabled dates",
                            controller.signal
                        ),
                        formData.aptdate
                            ? fetchData(
                                  `${apiBaseUrl}/api/office/disabled-slots/${selectedOffice.offabbr}/${branch}`,
                                  "Failed to fetch disabled slots",
                                  controller.signal
                              )
                            : Promise.resolve([]),
                    ]);

                    setDisabledDates(datesData.map((item) => item.date));

                    if (formData.aptdate) {
                        const timeSlotsForDate = slotsData
                            .filter(
                                (item) =>
                                    item.date === formData.aptdate && item.time
                            )
                            .map((item) => item.time);
                        setDisabledTimes(timeSlotsForDate);
                    }
                } catch (error) {
                    if (error.name !== "AbortError") {
                        console.error("Disabled data loading error:", error);
                    }
                }
            };

            loadDisabledData();

            return () => controller.abort();
        },
        [apiBaseUrl, branch, selectedOffice, formData.aptdate, fetchData],
        500
    );

    // Success handler
    const handleSuccess = useCallback(() => {
        // Reset relevant states and refetch necessary data
        setPurpose("");
        setInstruction("");
        setSelectedPurpose(null);

        // Refetch purposes if we have a selected office
        if (selectedOffice) {
            fetchData(
                `${apiBaseUrl}/api/office/purposes/${selectedOffice.offabbr}/${branch}`,
                "Failed to refresh purposes"
            ).then(setPurposes);
        }

        // Always refresh office data
        fetchData(
            `${apiBaseUrl}/api/office/bybranchrole/${branch}/${role}`,
            "Failed to refresh office data"
        ).then(setoffData);
    }, [apiBaseUrl, branch, role, selectedOffice, fetchData]);

    // Modal handlers
    const openEditLimitModal = useCallback((office) => {
        setSelectedOffice((prev) =>
            prev?.offid === office.offid ? prev : office
        );
        editLimitModalRef.current.showModal();
    }, []);

    const openPurposeModal = useCallback((office, officeName) => {
        setSelectedOffice((prev) =>
            prev?.offid === office.offid ? prev : office
        );
        setSelectedOffname(officeName);
        purposeModal.current.showModal();
    }, []);

    const openInstructionModal = useCallback((purposeItem) => {
        setSelectedPurpose(purposeItem);
        setInstruction(purposeItem.instruction || "");
        instructionModal.current.showModal();
    }, []);

    const openDateTimeModal = useCallback((office) => {
        setSelectedOffice((prev) => {
            if (prev?.offid === office.offid) return prev;
            return office;
        });
        setFormData((prev) => ({
            ...prev,
            aptoffice: office.offabbr,
            aptbranch: office.offbranch,
        }));
        dateTimeModal.current.showModal();
    }, []);

    // CRUD operations
    const handleLimitUpdate = useCallback(
        async (newLimit) => {
            if (!selectedOffice || !newLimit || newLimit <= 0) {
                toast.error("Please enter a valid limit");
                return;
            }

            setIsLoading(true);
            try {
                const response = await fetch(
                    `${apiBaseUrl}/api/office/update-limit/${selectedOffice.offid}`,
                    {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ offlimit: Number(newLimit) }),
                    }
                );

                if (response.ok) {
                    toast.success("Office limit updated successfully");
                    editLimitModalRef.current.close();
                    handleSuccess();
                } else {
                    throw new Error("Failed to update office limit");
                }
            } catch (error) {
                console.error("Error:", error);
                toast.error(error.message);
            } finally {
                setIsLoading(false);
            }
        },
        [apiBaseUrl, selectedOffice, handleSuccess]
    );

    const handlePurposeInsert = useCallback(
        async (e) => {
            e.preventDefault();
            if (!purpose.trim()) {
                toast.error("Purpose cannot be empty");
                return;
            }

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
                    throw new Error("Failed to insert purpose.");
                }
            } catch (error) {
                console.error("Error:", error);
                toast.error(error.message);
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
                            instruction: instruction || null,
                        }),
                    }
                );

                if (response.ok) {
                    toast.success("Instruction saved successfully.");
                    instructionModal.current.close();
                    handleSuccess();
                } else {
                    throw new Error("Failed to save instruction.");
                }
            } catch (error) {
                console.error("Error:", error);
                toast.error(error.message);
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
                    throw new Error("Failed to delete purpose.");
                }
            } catch (error) {
                console.error("Error:", error);
                toast.error(error.message);
            } finally {
                setIsLoading(false);
                setPurposeToDelete(null);
            }
        },
        [apiBaseUrl, handleSuccess]
    );

    const confirmDelete = (purposeItem) => {
        setPurposeToDelete(purposeItem);
        deleteModal.current.showModal();
    };

    // Toggle functions
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
                    // Refresh disabled data
                    const [datesData, slotsData] = await Promise.all([
                        fetchData(
                            `${apiBaseUrl}/api/office/disabled-dates/${selectedOffice.offabbr}/${branch}`,
                            "Failed to fetch disabled dates"
                        ),
                        formData.aptdate
                            ? fetchData(
                                  `${apiBaseUrl}/api/office/disabled-slots/${selectedOffice.offabbr}/${branch}`,
                                  "Failed to fetch disabled slots"
                              )
                            : Promise.resolve([]),
                    ]);

                    setDisabledDates(datesData.map((item) => item.date));

                    if (formData.aptdate) {
                        const timeSlotsForDate = slotsData
                            .filter(
                                (item) =>
                                    item.date === formData.aptdate && item.time
                            )
                            .map((item) => item.time);
                        setDisabledTimes(timeSlotsForDate);
                    }

                    if (endpoint.includes("toggle-date")) {
                        setCalendarKey((prev) => prev + 1);
                    } else {
                        setTimePickerKey((prev) => prev + 1);
                    }
                } else {
                    throw new Error("Error toggling. Please try again.");
                }
            } catch (error) {
                console.error("Error:", error);
                toast.error(error.message);
            } finally {
                setIsLoading(false);
            }
        },
        [apiBaseUrl, branch, selectedOffice, formData.aptdate, fetchData]
    );

    const handleDateToggle = useCallback(
        async (date) => {
            await toggleDateTime("/api/office/toggle-date", {
                date,
                time: null,
                aptoffice: selectedOffice?.offabbr,
                aptbranch: branch,
            });
        },
        [branch, selectedOffice, toggleDateTime]
    );

    const handleTimeToggle = useCallback(
        async (date, time) => {
            await toggleDateTime("/api/office/toggle-slot", {
                date,
                time,
                aptoffice: selectedOffice?.offabbr,
                aptbranch: branch,
            });
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
                        <p className="text-gray-600">Manage office details</p>
                    </div>

                    <OfficeList
                        offabbr={offabbr}
                        setoffabbr={setoffabbr}
                        searchResults={searchResults}
                        isLoading={isLoading}
                        openEditLimitModal={openEditLimitModal}
                        openDateTimeModal={openDateTimeModal}
                    />

                    <PurposeList
                        offData={offData}
                        selectedOffice={selectedOffice}
                        setSelectedOffice={setSelectedOffice}
                        purposes={purposes}
                        openPurposeModal={openPurposeModal}
                        openInstructionModal={openInstructionModal}
                        confirmDelete={confirmDelete}
                        isLoading={isLoading}
                    />
                </div>
            </div>

            {/* Modals */}
            <EditLimitModal
                editLimitModal={editLimitModalRef}
                selectedOffice={selectedOffice}
                handleLimitUpdate={handleLimitUpdate}
                isLoading={isLoading}
            />
            <PurposeModal
                purposeModal={purposeModal}
                selectedOffname={selectedOffname}
                purpose={purpose}
                setPurpose={setPurpose}
                handlePurposeInsert={handlePurposeInsert}
                isLoading={isLoading}
            />
            <DeleteModal
                deleteModal={deleteModal}
                purposeToDelete={purposeToDelete}
                deletePurpose={deletePurpose}
                isLoading={isLoading}
            />
            <InstructionModal
                instructionModal={instructionModal}
                selectedPurpose={selectedPurpose}
                instruction={instruction}
                setInstruction={setInstruction}
                handleInstructionSave={handleInstructionSave}
                isLoading={isLoading}
            />
            <DateTimeModal
                dateTimeModal={dateTimeModal}
                selectedOffice={selectedOffice}
                formData={formData}
                setFormData={setFormData}
                disabledDates={disabledDates}
                disabledTimes={disabledTimes}
                calendarKey={calendarKey}
                timePickerKey={timePickerKey}
                role={role}
                offData={offData}
                isDateDisabled={isDateDisabled}
                isTimeDisabled={isTimeDisabled}
                handleDateToggle={handleDateToggle}
                handleTimeToggle={handleTimeToggle}
                setIsTimeSelected={setIsTimeSelected}
                isLoading={isLoading}
            />

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
