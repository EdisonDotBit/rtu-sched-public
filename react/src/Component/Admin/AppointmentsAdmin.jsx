import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../Hooks/useAuth";

function AppointmentsAdmin() {
    const [aptemail, setAptEmail] = useState("");
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const [aptData, setAptData] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [filterBranch, setFilterBranch] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
    const modalRef1 = useRef(null);
    const modalRef2 = useRef(null);
    const [selectedAppointmentNum, setSelectedAppointmentNum] = useState(null);
    const { role } = useAuth();

    useEffect(() => {
        const getData = async () => {
            let endpoint;

            if (role === "superadmin") {
                endpoint = `${apiBaseUrl}/api/all`; // Assuming this endpoint returns all appointments
            } else {
                endpoint = `${apiBaseUrl}/api/filteredapt/${role}`;
            }

            const getRes = await fetch(endpoint);
            const getDataResult = await getRes.json();
            setAptData(getDataResult);
            setSearchResults(getDataResult);
        };
        getData();
    }, [role, apiBaseUrl]); // Add role as a dependency

    useEffect(() => {
        let filteredResults = aptData.filter((apt) => {
            return apt.aptemail.toLowerCase().includes(aptemail.toLowerCase());
        });

        if (filterStatus) {
            filteredResults = filteredResults.filter((apt) =>
                apt.aptstatus.toLowerCase().includes(filterStatus.toLowerCase())
            );
        }

        if (filterBranch) {
            filteredResults = filteredResults.filter((apt) =>
                apt.aptbranch.toLowerCase().includes(filterBranch.toLowerCase())
            );
        }

        setSearchResults(filteredResults);
    }, [aptemail, aptData, filterStatus, filterBranch]);

    const openModal1 = (aptNum) => {
        setSelectedAppointmentNum(aptNum);
        modalRef1.current.showModal();
    };

    const openModal2 = (aptNum) => {
        setSelectedAppointmentNum(aptNum);
        modalRef2.current.showModal();
    };
    const deleteApt = async (e, id) => {
        e.preventDefault();
        try {
            const deleteRes = await fetch(`${apiBaseUrl}/api/delappt/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (deleteRes.ok) {
                // Remove the deleted appointment from the local state
                setAptData((prevData) =>
                    prevData.filter((apt) => apt.aptid !== id)
                );
                setSearchResults((prevResults) =>
                    prevResults.filter((apt) => apt.aptid !== id)
                );
                alert("Appointment deleted successfully.");
                window.location.reload();
            } else {
                alert("Failed to delete appointment.");
            }
        } catch (error) {
            console.error("Error deleting appointment:", error);
            alert("Error deleting appointment. Please try again later.");
        }
    };
    const upApt = async (e, id) => {
        e.preventDefault();
        try {
            const deleteRes = await fetch(`${apiBaseUrl}/api/updone/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (deleteRes.ok) {
                alert("Appointment update successfully.");
                window.location.reload();
            }
        } catch (error) {
            alert("Error updating appointment. Please try again later.");
        }
    };

    // Sorting function
    const sortData = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });

        const sortedData = [...searchResults].sort((a, b) => {
            if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
            if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
            return 0;
        });
        setSearchResults(sortedData);
    };

    // Function to render sort arrows
    const SortArrow = ({ direction }) => {
        if (direction === "asc") {
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    className="mb-1"
                >
                    <path d="M3 9l4 4 4-4H3z" />
                </svg>
            );
        }
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
                className="mt-2"
            >
                <path d="M3 5l4-4 4 4H3z" />
            </svg>
        );
    };

    return (
        <div className="flex justify-center h-full">
            <div className="flex flex-col items-center gap-[20px]">
                <input
                    className="text-gray-800 bg-white mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75] w-[300px] xsm:w-[200px] sm:w-[300px] text-md"
                    type="text"
                    placeholder="Search Appointment by Email"
                    value={aptemail}
                    onChange={(e) => setAptEmail(e.target.value)}
                />

                <div className="text-sm flex justify-start items-center gap-4 w-full">
                    <div className="flex justify-start items-center gap-4">
                        <p className="text-sm">Sort Branch by:</p>
                        <select
                            value={filterBranch}
                            onChange={(e) => setFilterBranch(e.target.value)}
                            className="text-gray-800 bg-white py-1 px-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75]"
                        >
                            <option value="">All</option>
                            <option value="Boni">Boni</option>
                            <option value="Pasig">Pasig</option>
                        </select>
                    </div>

                    <div className="flex justify-start items-center gap-4">
                        <p className="text-sm">Sort Status by:</p>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="text-gray-800 bg-white py-1 px-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75]"
                        >
                            <option value="">All</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="done">Done</option>
                        </select>
                    </div>
                </div>

                {searchResults.length !== 0 && (
                    <div className="overflow-x-auto overflow-y-auto">
                        <table className="border border-gray-200 min-w-full divide-y-2 divide-gray-200 bg-white">
                            <thead className="ltr:text-center rtl:text-center text-[8.5px] lg:text-[10px]">
                                <tr>
                                    <th
                                        className="whitespace-nowrap px-4 py-2 font-semibold text-gray-900 cursor-pointer"
                                        onClick={() => sortData("aptid")}
                                    >
                                        <div className="flex items-center justify-center">
                                            Appointment <br />
                                            Number
                                            <span className="text-gray-500">
                                                <SortArrow
                                                    direction={
                                                        sortConfig.key ===
                                                        "aptid"
                                                            ? sortConfig.direction
                                                            : null
                                                    }
                                                />
                                            </span>
                                        </div>
                                    </th>
                                    <th
                                        className="whitespace-nowrap px-4 py-2 font-semibold text-gray-900 cursor-pointer"
                                        onClick={() => sortData("apttype")}
                                    >
                                        <div className="flex items-center justify-center">
                                            Type
                                            <span className="text-gray-500">
                                                <SortArrow
                                                    direction={
                                                        sortConfig.key ===
                                                        "apttype"
                                                            ? sortConfig.direction
                                                            : null
                                                    }
                                                />
                                            </span>
                                        </div>
                                    </th>
                                    <th
                                        className="whitespace-nowrap px-4 py-2 font-semibold text-gray-900 cursor-pointer"
                                        onClick={() => sortData("aptname")}
                                    >
                                        <div className="flex items-center justify-center">
                                            Full Name
                                            <span className="text-gray-500">
                                                <SortArrow
                                                    direction={
                                                        sortConfig.key ===
                                                        "aptname"
                                                            ? sortConfig.direction
                                                            : null
                                                    }
                                                />
                                            </span>
                                        </div>
                                    </th>
                                    <th
                                        className="whitespace-nowrap px-4 py-2 font-semibold text-gray-900 cursor-pointer"
                                        onClick={() => sortData("aptbranch")}
                                    >
                                        <div className="flex items-center justify-center">
                                            Branch
                                            <span className="text-gray-500">
                                                <SortArrow
                                                    direction={
                                                        sortConfig.key ===
                                                        "aptbranch"
                                                            ? sortConfig.direction
                                                            : null
                                                    }
                                                />
                                            </span>
                                        </div>
                                    </th>
                                    <th
                                        className="whitespace-nowrap px-4 py-2 font-semibold text-gray-900"
                                        onClick={() => sortData("aptoffice")}
                                    >
                                        <div className="flex items-center justify-center">
                                            Office
                                            <span className="text-gray-500">
                                                <SortArrow
                                                    direction={
                                                        sortConfig.key ===
                                                        "aptoffice"
                                                            ? sortConfig.direction
                                                            : null
                                                    }
                                                />
                                            </span>
                                        </div>
                                    </th>
                                    <th
                                        className="whitespace-nowrap px-4 py-2 font-semibold text-gray-900"
                                        onClick={() => sortData("aptdate")}
                                    >
                                        <div className="flex items-center justify-center">
                                            Date
                                            <span className="text-gray-500">
                                                <SortArrow
                                                    direction={
                                                        sortConfig.key ===
                                                        "aptdate"
                                                            ? sortConfig.direction
                                                            : null
                                                    }
                                                />
                                            </span>
                                        </div>
                                    </th>
                                    <th
                                        className="whitespace-nowrap px-4 py-2 font-semibold text-gray-900"
                                        onClick={() => sortData("apttime")}
                                    >
                                        <div className="flex items-center justify-center">
                                            Time
                                            <span className="text-gray-500">
                                                <SortArrow
                                                    direction={
                                                        sortConfig.key ===
                                                        "apttime"
                                                            ? sortConfig.direction
                                                            : null
                                                    }
                                                />
                                            </span>
                                        </div>
                                    </th>
                                    <th
                                        className="whitespace-nowrap px-4 py-2 font-semibold text-gray-900"
                                        onClick={() => sortData("aptpurpose")}
                                    >
                                        <div className="flex items-center justify-center">
                                            Purpose
                                            <span className="text-gray-500">
                                                <SortArrow
                                                    direction={
                                                        sortConfig.key ===
                                                        "aptpurpose"
                                                            ? sortConfig.direction
                                                            : null
                                                    }
                                                />
                                            </span>
                                        </div>
                                    </th>
                                    <th
                                        className="whitespace-nowrap px-4 py-2 font-semibold text-gray-900"
                                        onClick={() => sortData("aptstudnum")}
                                    >
                                        <div className="flex items-center justify-center">
                                            Student / ID <br />
                                            Number
                                            <span className="text-gray-500">
                                                <SortArrow
                                                    direction={
                                                        sortConfig.key ===
                                                        "aptstudnum"
                                                            ? sortConfig.direction
                                                            : null
                                                    }
                                                />
                                            </span>
                                        </div>
                                    </th>
                                    <th
                                        className="whitespace-nowrap px-4 py-2 font-semibold text-gray-900"
                                        onClick={() => sortData("aptstatus")}
                                    >
                                        <div className="flex items-center justify-center">
                                            Status
                                            <span className="text-gray-500">
                                                <SortArrow
                                                    direction={
                                                        sortConfig.key ===
                                                        "aptstatus"
                                                            ? sortConfig.direction
                                                            : null
                                                    }
                                                />
                                            </span>
                                        </div>
                                    </th>
                                    <th
                                        className="whitespace-nowrap px-4 py-2 font-semibold text-gray-900"
                                        onClick={() => sortData("aptemail")}
                                    >
                                        <div className="flex items-center justify-center">
                                            Email
                                            <span className="text-gray-500">
                                                <SortArrow
                                                    direction={
                                                        sortConfig.key ===
                                                        "aptemail"
                                                            ? sortConfig.direction
                                                            : null
                                                    }
                                                />
                                            </span>
                                        </div>
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200 text-[8.5px] lg:text-[10px] text-center">
                                {searchResults
                                    .slice(0, 20)
                                    .map((apt, index) => (
                                        <tr key={index}>
                                            <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                                {apt.aptid}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                                {apt.apttype}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                                {apt.aptname}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                                {apt.aptbranch}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                                {apt.aptoffice}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                                {apt.aptdate}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                                {apt.apttime}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                                {apt.aptpurpose}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                                {apt.aptstudnum}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                                {apt.aptstatus}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                                {apt.aptemail}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                                <button
                                                    className="text-[9px] group relative inline-block overflow-hidden border border-indigo-600 px-3 py-1 focus:outline-none focus:ring"
                                                    onClick={() =>
                                                        openModal1(apt.aptid)
                                                    }
                                                >
                                                    <span className="absolute inset-x-0 bottom-0 h-[2px] bg-indigo-600 transition-all group-hover:h-full group-active:bg-indigo-500"></span>
                                                    <span className="relative text-[12px] font-medium text-indigo-600 transition-colors group-hover:text-white">
                                                        Done
                                                    </span>
                                                </button>
                                                <button
                                                    className="ml-4 group relative inline-block overflow-hidden border border-red-600 px-3 py-1 focus:outline-none focus:ring"
                                                    onClick={() =>
                                                        openModal2(apt.aptid)
                                                    }
                                                >
                                                    <span className="absolute inset-x-0 bottom-0 h-[2px] bg-red-600 transition-all group-hover:h-full group-active:bg-red-500"></span>
                                                    <span className="relative text-[12px] font-medium text-red-600 transition-colors group-hover:text-white">
                                                        Delete
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
            <dialog ref={modalRef1} className="modal">
                <div className="modal-box text-white bg-[#194F90]">
                    <h3 className="font-bold text-lg">
                        Mark Appointment Ticket as Done?
                    </h3>
                    <p className="py-4">
                        Appointment Number: {selectedAppointmentNum}
                    </p>
                    <div className="modal-action">
                        <button
                            className="btn btn-outline text-white hover:bg-white hover:text-[#194F90]"
                            type="button"
                            onClick={(e) => upApt(e, selectedAppointmentNum)}
                        >
                            Confirm
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline text-white hover:bg-white hover:text-[#194F90]"
                            onClick={() => {
                                modalRef1.current.close();
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </dialog>

            <dialog ref={modalRef2} className="modal">
                <div className="modal-box text-white bg-[#194F90]">
                    <h3 className="font-bold text-lg">
                        Delete Appointment Ticket?
                    </h3>
                    <p className="py-4">
                        Appointment Number: {selectedAppointmentNum}
                    </p>
                    <div className="modal-action">
                        <button
                            type="button"
                            className="btn btn-outline text-white hover:bg-white hover:text-[#194F90]"
                            onClick={(e) =>
                                deleteApt(e, selectedAppointmentNum)
                            }
                        >
                            Confirm
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline text-white hover:bg-white hover:text-[#194F90]"
                            onClick={() => modalRef2.current.close()}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </dialog>
        </div>
    );
}

export default AppointmentsAdmin;
