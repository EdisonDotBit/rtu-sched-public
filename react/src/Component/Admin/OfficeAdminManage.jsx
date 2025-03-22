import { useState, useRef, useEffect } from "react";
import EditOffice from "./Component/EditOffice";
import { useAuth } from "../../Hooks/useAuth";
import { useDebouncedEffect } from "../../Hooks/useDebouncedEffect";
import Calendar from "../Subcomponent/Calendar";
import TimePicker from "../Subcomponent/TimePicker";

function OfficeAdminManage() {
    const [offabbr, setoffabbr] = useState("");
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const { branch, role } = useAuth();
    const [offData, setoffData] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const purposeModal = useRef(null);
    const [selectedOffid, setSelectedOffid] = useState(null);
    const [selectedOffname, setSelectedOffname] = useState("");
    const [showEdit, setShowEdit] = useState(false);
    const [selectedOffice, setSelectedOffice] = useState(null);
    const [purpose, setPurpose] = useState("");
    const dateTimeModal = useRef(null);
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
    const isDateDisabled = disabledDates.includes(formData.aptdate);
    const isTimeDisabled = disabledTimes.includes(formData.apttime);

    useDebouncedEffect(
        () => {
            const getData = async () => {
                const getRes = await fetch(
                    `${apiBaseUrl}/api/office/bybranchrole/${branch}/${role}`
                );
                const getDataResult = await getRes.json();
                setoffData(getDataResult);
                setSearchResults(getDataResult);
            };
            getData();
        },
        [branch, role],
        500
    );

    useEffect(() => {
        const filteredResults = offData.filter((office) => {
            return office.offabbr.toLowerCase().includes(offabbr.toLowerCase());
        });
        setSearchResults(filteredResults);
    }, [offabbr, offData]);

    const toEdit = (e, officeNum) => {
        setShowEdit(true);
        setSelectedOffid(officeNum);
        window.location.href = "#edit";
        e.preventDefault();
    };

    const openPurposeModal = (office, officeName) => {
        setSelectedOffice(office);
        setSelectedOffname(officeName);
        purposeModal.current.showModal();
    };

    const handlePurposeInsert = async (e) => {
        e.preventDefault();
        console.log("Insert Purpose:", purpose);
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
                alert("Purpose inserted successfully");
                window.location.reload();
            } else {
                alert("Failed to insert purpose");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const openDateTimeModal = (office) => {
        setSelectedOffice(office);
        setFormData((prev) => ({
            ...prev,
            aptoffice: office.offabbr,
            aptbranch: office.offbranch,
        }));
        dateTimeModal.current.showModal();
    };

    const fetchDisabledDates = async () => {
        if (!selectedOffice) return; // Ensure the selected office is defined
        try {
            const endpoint = `${apiBaseUrl}/api/office/disabled-dates/${selectedOffice.offabbr}/${branch}`;
            console.log("Fetching disabled dates from:", endpoint);
            const resp = await fetch(endpoint);
            if (!resp.ok) throw new Error(resp.statusText);
            const disabledDates = await resp.json(); // Fetch disabled dates as an array
            console.log("Disabled Dates:", disabledDates);

            // Set the state for disabled dates
            setDisabledDates(disabledDates.map((item) => item.date));
        } catch (error) {
            console.error("Error fetching disabled dates:", error);
        }
    };

    const fetchDisabledSlots = async () => {
        if (!selectedOffice || !formData.aptdate) return; // Ensure office and date are defined
        try {
            const endpoint = `${apiBaseUrl}/api/office/disabled-slots/${selectedOffice.offabbr}/${branch}`;
            console.log("Fetching disabled time slots from:", endpoint);
            const resp = await fetch(endpoint);
            if (!resp.ok) throw new Error(resp.statusText);
            const disabledSlots = await resp.json(); // Fetch disabled slots as an array
            console.log("Disabled Time Slots:", disabledSlots);

            // Filter time slots specific to the currently selected date
            const timeSlotsForDate = disabledSlots
                .filter((item) => item.date === formData.aptdate && item.time)
                .map((item) => item.time);

            // Update the state for disabled time slots
            setDisabledTimes(timeSlotsForDate);
        } catch (error) {
            console.error("Error fetching disabled time slots:", error);
        }
    };

    useDebouncedEffect(
        () => {
            if (selectedOffice) {
                fetchDisabledDates();
            }

            if (selectedOffice && formData.aptdate) {
                fetchDisabledSlots();
            }
        },
        [selectedOffice, formData.aptdate, branch, apiBaseUrl],
        500
    );

    const handleDateToggle = async (date) => {
        const payload = {
            date: date, // Date in "YYYY-MM-DD" format
            time: null, // Null means toggling the entire date
            aptoffice: selectedOffice?.offabbr, // Office abbreviation
            aptbranch: branch, // Branch name
        };

        console.log("Toggling Date with payload:", payload);

        try {
            const res = await fetch(`${apiBaseUrl}/api/office/toggle-date`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                const result = await res.json();
                alert(result.message); // Notify whether the date was disabled or enabled
                fetchDisabledDates(); // Refresh the disabled slots
                setCalendarKey((prevKey) => prevKey + 1);
            } else {
                const errText = await res.text();
                console.error("Toggle Date Failed:", errText);
                alert("Error toggling Date. Please try again.");
            }
        } catch (error) {
            console.error("Error in handleDateToggle:", error);
            alert("An unexpected error occurred while toggling Date");
        }
    };

    const handleTimeToggle = async (date, time) => {
        const payload = {
            date: date, // Date in "YYYY-MM-DD" format
            time: time, // Specific time to toggle
            aptoffice: selectedOffice?.offabbr, // Office abbreviation
            aptbranch: branch, // Branch name
        };

        console.log("Toggling Time with payload:", payload);

        try {
            const res = await fetch(`${apiBaseUrl}/api/office/toggle-slot`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                const result = await res.json();
                alert(result.message); // Notify whether the time was disabled or enabled
                fetchDisabledSlots(); // Refresh the disabled slots
                setTimePickerKey((prevKey) => prevKey + 1);
            } else {
                const errText = await res.text();
                console.error("Toggle Time Failed:", errText);
                alert("Error toggling Time. Please try again.");
            }
        } catch (error) {
            console.error("Error in handleTimeToggle:", error);
            alert("An unexpected error occurred while toggling Time");
        }
    };

    return (
        <div className="relative w-full h-full overflow-hidden">
            <div
                className={`absolute w-full h-full transition-transform duration-500 ${
                    showEdit ? "-translate-x-full" : "translate-x-0"
                }`}
            >
                <div className="flex justify-center  h-full w-full">
                    <div className="flex flex-col items-center gap-[20px]">
                        <input
                            className="text-gray-800 bg-white mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75] w-[300px] xsm:w-[200px] sm:w-[300px] text-md"
                            type="text"
                            placeholder="Enter Office Abbreviation"
                            value={offabbr}
                            onChange={(e) => setoffabbr(e.target.value)}
                        />

                        {searchResults.length !== 0 && (
                            // add overflow-x-auto if list gets long
                            <div className="border border-gray-200">
                                <table className="table-auto  shadow-md rounded min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                                    <thead className="ltr:text-center rtl:text-center">
                                        <tr>
                                            <th className="whitespace-nowrap px-4 py-2 font-semibold text-gray-900">
                                                Office Name
                                            </th>
                                            <th className="whitespace-nowrap px-4 py-2 font-semibold text-gray-900">
                                                Office
                                                <br />
                                                Abbreviation
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
                                                        <a
                                                            onClick={(e) =>
                                                                toEdit(
                                                                    e,
                                                                    office.offid
                                                                )
                                                            }
                                                            href="#edit"
                                                        >
                                                            <button className="group relative inline-block overflow-hidden border border-indigo-600 px-8 py-3 focus:outline-none focus:ring">
                                                                <span className="absolute inset-x-0 bottom-0 h-[2px] bg-indigo-600 transition-all group-hover:h-full group-active:bg-indigo-500"></span>
                                                                <span className="relative text-sm font-medium text-indigo-600 transition-colors group-hover:text-white">
                                                                    Edit
                                                                </span>
                                                            </button>
                                                        </a>

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

                    <dialog ref={purposeModal} className="modal">
                        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] bg-[#194F90] rounded-lg shadow-lg p-4 backdrop:bg-black/50">
                            <div className="modal-box text-white bg-[#194F90]">
                                <h3 className="font-bold text-lg">
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
                                            onClick={() => {
                                                purposeModal.current.close();
                                                window.location.reload();
                                            }}
                                            className="mt-6 px-6 py-2 border border-white text-white rounded-lg transition duration-100 ease-in-out hover:bg-white hover:text-[#194F90]"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </dialog>

                    <dialog ref={dateTimeModal} className="modal">
                        <div className="p-6 fixed rounded-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl min-h-[60vh] lg:min-h-[70vh] overflow-y-auto flex flex-col justify-start items-center text-black bg-gray-50 shadow-lg">
                            <h3 className="font-bold text-lg">
                                Manage Date & Time
                            </h3>
                            <p className="py-2 text-gray-700">
                                Office:{" "}
                                {selectedOffice?.offname ||
                                    "No Office Selected"}
                            </p>

                            {/* Container for Calendar and TimePicker */}
                            <div className="modal-action flex justify-center items-center gap-10">
                                {/* Calendar Section */}
                                <div className="flex flex-col items-center justify-center">
                                    <Calendar
                                        key={calendarKey}
                                        formData={formData}
                                        setFormData={setFormData}
                                        limit={selectedOffice?.offlimit || 10}
                                        appointments={offData}
                                        userRole={role}
                                        disabledDates={disabledDates}
                                    />
                                    {/* Toggle Date Button */}
                                    <button
                                        className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg w-full"
                                        onClick={async () => {
                                            if (formData.aptdate) {
                                                await handleDateToggle(
                                                    formData.aptdate
                                                );
                                            } else {
                                                alert(
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

                                {/* TimePicker Section */}
                                <div className="flex flex-col items-center justify-center">
                                    <TimePicker
                                        key={timePickerKey}
                                        formData={formData}
                                        setFormData={setFormData}
                                        limit={selectedOffice?.offlimit || 10}
                                        appointments={offData}
                                        setTimeSelected={() => {}}
                                        userRole={role}
                                        disabledTimes={disabledTimes}
                                    />
                                    {/* Toggle Time Button */}
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
                                                alert(
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

                            {/* Close Button */}
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

            <div
                className={`absolute w-full h-full transition-transform duration-500 ${
                    showEdit ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {showEdit && (
                    <EditOffice
                        selectedOffid={selectedOffid}
                        setShowEdit={setShowEdit}
                    />
                )}
            </div>
        </div>
    );
}

export default OfficeAdminManage;
