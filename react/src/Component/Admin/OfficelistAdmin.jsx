import { useState, useRef, useCallback, useMemo } from "react";
import AddOffice from "./Component/AddOffice";
import EditOffice from "./Component/EditOffice";
import { useAuth } from "../../Hooks/useAuth";
import { useDebouncedEffect } from "../../Hooks/useDebouncedEffect";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function OfficelistAdmin() {
    const [offabbr, setoffabbr] = useState("");
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const { branch } = useAuth();
    const [offData, setoffData] = useState([]);
    const [selectedOffid, setSelectedOffid] = useState(null);
    const [selectedOffname, setSelectedOffname] = useState("");
    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const modals = useRef(null);

    // Fetch office data
    const fetchOfficeData = useCallback(async () => {
        setIsLoading(true);
        try {
            const getRes = await fetch(
                `${apiBaseUrl}/api/office/bybranch/${branch}`
            );
            const getDataResult = await getRes.json();
            setoffData(getDataResult);
        } catch (error) {
            console.error("Error fetching office data:", error);
            toast.error("Failed to fetch office data. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }, [apiBaseUrl, branch]);

    useDebouncedEffect(
        () => {
            fetchOfficeData();
        },
        [fetchOfficeData],
        500
    );

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

    // Open delete confirmation modal
    const openmodal = useCallback((officeNum, officeName) => {
        setSelectedOffid(officeNum);
        setSelectedOffname(officeName);
        modals.current.showModal();
    }, []);

    // Delete office
    const deleteOff = useCallback(
        async (e, id) => {
            e.preventDefault();
            try {
                const deleteRes = await fetch(
                    `${apiBaseUrl}/api/office/delete/${id}`,
                    {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                if (deleteRes.ok) {
                    setoffData((prevData) =>
                        prevData.filter((office) => office.offid !== id)
                    );
                    toast.success("Office deleted successfully.");
                    modals.current.close();
                } else {
                    toast.error("Failed to delete office. Please try again.");
                }
            } catch (error) {
                console.error("Error deleting office:", error);
                toast.error(
                    "An unexpected error occurred. Please try again later."
                );
            }
        },
        [apiBaseUrl]
    );

    // Callback function to refetch data after adding or editing an office
    const handleSuccess = () => {
        fetchOfficeData();
    };

    return (
        <div className="relative w-full h-full overflow-hidden bg-gray-50">
            {/* Main Content */}
            <div
                className={`absolute w-full h-full transition-transform duration-500 ${
                    showAdd || showEdit ? "-translate-x-full" : "translate-x-0"
                }`}
            >
                <div className="p-6 max-w-7xl mx-auto h-full flex flex-col">
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
                            <button
                                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                onClick={() => setShowAdd(true)}
                                aria-label="Add Office"
                            >
                                <svg
                                    className="w-5 h-5 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                    />
                                </svg>
                                Add Office
                            </button>
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
                                    Try adjusting your search or add a new
                                    office.
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
                                                                openmodal(
                                                                    office.offid,
                                                                    office.offname
                                                                )
                                                            }
                                                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200"
                                                            aria-label={`Delete ${office.offname}`}
                                                        >
                                                            Delete
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
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <dialog
                ref={modals}
                className="modal top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop:bg-gray-900/50 backdrop:backdrop-blur-sm"
                aria-labelledby="delete-modal-title"
                aria-modal="true"
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
                            onClick={() => modals.current.close()}
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
                            Are you sure you want to delete this office?
                        </p>
                        <div className="bg-red-50 border-l-4 border-red-400 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-5 w-5 text-red-400"
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
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">
                                        Deleting{" "}
                                        <span className="font-medium">
                                            {selectedOffname}
                                        </span>{" "}
                                        cannot be undone.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            className="px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            onClick={() => modals.current.close()}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="px-4 py-2 border border-transparent text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            onClick={(e) => deleteOff(e, selectedOffid)}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </dialog>

            {/* Add Office Panel */}
            <div
                className={`absolute w-full h-full transition-transform duration-500 ${
                    showAdd ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <AddOffice setShowAdd={setShowAdd} onSuccess={handleSuccess} />
            </div>

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

export default OfficelistAdmin;
