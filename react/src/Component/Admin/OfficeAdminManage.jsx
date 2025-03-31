import { useState, useRef, useCallback, useMemo, useEffect } from "react";
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
    const [isTimeSelected, setIsTimeSelected] = useState(false);

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
                setPurposeToDelete(null);
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
                        <p className="text-gray-600">Manage office details</p>
                    </div>

                    <OfficeList
                        offabbr={offabbr}
                        setoffabbr={setoffabbr}
                        searchResults={searchResults}
                        isLoading={isLoading}
                        toEdit={toEdit}
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
