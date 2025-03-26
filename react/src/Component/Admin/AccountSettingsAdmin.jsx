import React, { useState, useRef, useCallback, useMemo } from "react";
import AddAccount from "./Component/AddAccount";
import EditAccount from "./Component/EditAccount";
import { useAuth } from "../../Hooks/useAuth";
import { useDebouncedEffect } from "../../Hooks/useDebouncedEffect";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AccountSettingsAdmin() {
    const [accountsData, setAccountsData] = useState([]);
    const [selectedaccid, setselectedaccid] = useState(null);
    const [selectedAdmName, setSelectedAdmName] = useState("");
    const [showEdit, setShowEdit] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [admname, setadmname] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const modals = useRef(null);
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const { branch } = useAuth();

    // Fetch data
    const fetchAccountsData = useCallback(async () => {
        setIsLoading(true);
        try {
            const getRes = await fetch(
                `${apiBaseUrl}/api/admin/bybranch/${branch}`
            );
            const getDataResult = await getRes.json();
            setAccountsData(getDataResult);
        } catch (error) {
            console.error("Error fetching admin data:", error);
            toast.error("Failed to fetch admin data. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [apiBaseUrl, branch]);

    useDebouncedEffect(
        () => {
            fetchAccountsData();
        },
        [fetchAccountsData],
        500
    );

    // Filter search results
    const searchResults = useMemo(() => {
        return accountsData.filter((account) =>
            account.admname.toLowerCase().includes(admname.toLowerCase())
        );
    }, [admname, accountsData]);

    // Open edit modal
    const toEdit = useCallback((e, accID) => {
        e.preventDefault();
        setShowEdit(true);
        setselectedaccid(accID);
        window.location.href = "#edit";
    }, []);

    // Delete account
    const deleteAcc = useCallback(
        async (e, id) => {
            e.preventDefault();
            setIsLoading(true);
            try {
                const deleteRes = await fetch(
                    `${apiBaseUrl}/api/admin/delete/${id}`,
                    {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                if (deleteRes.ok) {
                    toast.success("Account deleted successfully.");
                    setAccountsData((prevData) =>
                        prevData.filter((account) => account.admid !== id)
                    );
                    modals.current.close();
                } else {
                    toast.error("Failed to delete account. Please try again.");
                }
            } catch (error) {
                toast.error("An unexpected error occurred. Please try again.");
            } finally {
                setIsLoading(false);
            }
        },
        [apiBaseUrl]
    );

    // Open delete confirmation modal
    const openmodal = useCallback((admid, admname) => {
        setselectedaccid(admid);
        setSelectedAdmName(admname);
        modals.current.showModal();
    }, []);

    // Callback function to refetch data
    const handleSuccess = useCallback(() => {
        fetchAccountsData();
    }, [fetchAccountsData]);

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
                            Admin Account Management
                        </h1>
                        <p className="text-gray-600">
                            Manage admin accounts for {branch} branch
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
                                    placeholder="Search by admin name..."
                                    value={admname}
                                    onChange={(e) => setadmname(e.target.value)}
                                    aria-label="Search Admin Name"
                                />
                            </div>
                            <button
                                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                onClick={() => setShowAdd(true)}
                                aria-label="Add Admin Account"
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
                                Add Admin
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
                                    No admin accounts found
                                </h3>
                                <p className="mt-1 text-gray-500">
                                    Try adjusting your search or add a new admin
                                    account
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
                                                Admin Name
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Username
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Assigned Office
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
                                        {searchResults.map((account, index) => (
                                            <tr
                                                key={index}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {account.admname}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {account.admuser}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {account.admrole}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                                                    <div className="flex justify-end space-x-2">
                                                        {/* Show disabled buttons for special accounts */}
                                                        {[1, 2].includes(
                                                            account.admid
                                                        ) ? (
                                                            <>
                                                                <button
                                                                    disabled
                                                                    className="text-gray-400 bg-gray-100 px-3 py-1.5 rounded-md text-sm font-medium cursor-not-allowed"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    disabled
                                                                    className="text-gray-400 bg-gray-100 px-3 py-1.5 rounded-md text-sm font-medium cursor-not-allowed"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    onClick={(
                                                                        e
                                                                    ) =>
                                                                        toEdit(
                                                                            e,
                                                                            account.admid
                                                                        )
                                                                    }
                                                                    className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        openmodal(
                                                                            account.admid,
                                                                            account.admname
                                                                        )
                                                                    }
                                                                    className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </>
                                                        )}
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
                            Are you sure you want to delete this admin account?
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
                                            {selectedAdmName}
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
                            onClick={(e) => deleteAcc(e, selectedaccid)}
                            disabled={isLoading}
                        >
                            {isLoading ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                </div>
            </dialog>

            {/* Add Account Panel */}
            <div
                className={`absolute w-full h-full transition-transform duration-500 ${
                    showAdd ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <AddAccount setShowAdd={setShowAdd} onSuccess={handleSuccess} />
            </div>

            {/* Edit Account Panel */}
            <div
                className={`absolute w-full h-full transition-transform duration-500 ${
                    showEdit ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {showEdit && (
                    <EditAccount
                        selectedaccid={selectedaccid}
                        setShowEdit={setShowEdit}
                        onSuccess={handleSuccess}
                    />
                )}
            </div>
        </div>
    );
}

export default AccountSettingsAdmin;
