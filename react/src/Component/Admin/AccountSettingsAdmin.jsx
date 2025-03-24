import React, { useEffect, useRef, useState } from "react";
import AddAccount from "./Component/AddAccount";
import EditAccount from "./Component/EditAccount";
import { useAuth } from "../../Hooks/useAuth";
import { useDebouncedEffect } from "../../Hooks/useDebouncedEffect";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import the CSS

function AccountSettingsAdmin() {
    // State management
    const [accountsData, setAccountsData] = useState([]);
    const [selectedaccid, setselectedaccid] = useState(null);
    const [selectedAdmName, setSelectedAdmName] = useState("");
    const [showEdit, setShowEdit] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [admname, setadmname] = useState("");

    // Refs and hooks
    const modals = useRef(null);
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const { branch } = useAuth();

    // Fetch data when branch changes (debounced to avoid excessive API calls)
    useDebouncedEffect(
        () => {
            const getData = async () => {
                try {
                    const getRes = await fetch(
                        `${apiBaseUrl}/api/admin/bybranch/${branch}`
                    );
                    const getDataResult = await getRes.json();
                    setAccountsData(getDataResult);
                    setSearchResults(getDataResult); // Initialize search results
                } catch (error) {
                    console.error("Error fetching admin data:", error);
                    toast.error(
                        "Failed to fetch admin data. Please try again."
                    );
                }
            };
            getData();
        },
        [branch],
        500 // Debounce delay
    );

    // Filter search results when admname changes (debounced)
    useDebouncedEffect(
        () => {
            const filteredResults = accountsData.filter((account) =>
                account.admname.toLowerCase().includes(admname.toLowerCase())
            );
            setSearchResults(filteredResults);
        },
        [admname, accountsData],
        300 // Debounce delay
    );

    // Open edit modal
    const toEdit = (e, accID) => {
        e.preventDefault();
        setShowEdit(true);
        setselectedaccid(accID);
        window.location.href = "#edit";
    };

    // Delete account
    const deleteAcc = async (e, id) => {
        e.preventDefault();
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
                // Remove the deleted account from the local state
                setAccountsData((prevData) =>
                    prevData.filter((account) => account.admid !== id)
                );
                modals.current.close();
            } else {
                toast.error("Failed to delete account. Please try again.");
            }
        } catch (error) {
            toast.error("An unexpected error occurred. Please try again.");
        }
    };

    // Open delete confirmation modal
    const openmodal = (admid, admname) => {
        setselectedaccid(admid);
        setSelectedAdmName(admname);
        modals.current.showModal();
    };

    // Callback function to refetch data after adding or editing an account
    const handleSuccess = () => {
        const getData = async () => {
            try {
                const getRes = await fetch(
                    `${apiBaseUrl}/api/admin/bybranch/${branch}`
                );
                const getDataResult = await getRes.json();
                setAccountsData(getDataResult);
                setSearchResults(getDataResult);
            } catch (error) {
                console.error("Error fetching admin data:", error);
                toast.error("Failed to fetch admin data. Please try again.");
            }
        };
        getData();
    };

    return (
        <div className="relative w-full h-full overflow-hidden">
            {/* Main content */}
            <div
                className={`absolute w-full h-full transition-transform duration-500 ${
                    showAdd || showEdit ? "-translate-x-full" : "translate-x-0"
                }`}
            >
                <div className="flex justify-center h-full w-full">
                    <div className="flex flex-col items-center gap-[20px]">
                        {/* Search input */}
                        <input
                            className="text-gray-800 bg-white mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75] w-[300px] xsm:w-[200px] sm:w-[300px] text-md"
                            type="text"
                            placeholder="Enter Admin Name"
                            onChange={(e) => setadmname(e.target.value)}
                        />

                        {/* Add Admin button */}
                        <div className="flex justify-end w-full">
                            <button
                                className="btn bg-[#194F90] hover:bg-[#123A69] text-white rounded-md border-0 inline-block px-8 py-2 text-md font-medium focus:relative"
                                onClick={() => setShowAdd(true)}
                            >
                                + Add Admin Account
                            </button>
                        </div>

                        {/* Admin table */}
                        {searchResults.length !== 0 && (
                            <div className="border border-gray-200">
                                <table className="table-auto shadow-md rounded min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                                    <thead className="ltr:text-center rtl:text-center">
                                        <tr>
                                            <th className="whitespace-nowrap px-4 py-2 font-semibold text-gray-900">
                                                Admin Name
                                            </th>
                                            <th className="whitespace-nowrap px-4 py-2 font-semibold text-gray-900">
                                                Username
                                            </th>
                                            <th className="whitespace-nowrap px-4 py-2 font-semibold text-gray-900">
                                                Assigned Office
                                            </th>
                                            <th className="whitespace-nowrap px-4 py-2 font-semibold text-gray-900">
                                                Tools
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-200 text-center">
                                        {searchResults
                                            .slice(0, 9) // Limit to 9 rows for performance
                                            .map((Account, index) => (
                                                <tr key={index}>
                                                    <td
                                                        className={`whitespace-nowrap text-gray-700 ${
                                                            Account.admid ===
                                                                1 ||
                                                            Account.admid === 2
                                                                ? "px-8 py-5"
                                                                : "px-4 py-2"
                                                        }`}
                                                    >
                                                        {Account.admname}
                                                    </td>
                                                    <td
                                                        className={`whitespace-nowrap text-gray-700 ${
                                                            Account.admid ===
                                                                1 ||
                                                            Account.admid === 2
                                                                ? "px-8 py-5"
                                                                : "px-4 py-2"
                                                        }`}
                                                    >
                                                        {Account.admuser}
                                                    </td>
                                                    <td
                                                        className={`whitespace-nowrap text-gray-700 ${
                                                            Account.admid ===
                                                                1 ||
                                                            Account.admid === 2
                                                                ? "px-8 py-5"
                                                                : "px-4 py-2"
                                                        }`}
                                                    >
                                                        {Account.admrole}
                                                    </td>
                                                    <td
                                                        className={`whitespace-nowrap text-gray-700 ${
                                                            Account.admid ===
                                                                1 ||
                                                            Account.admid === 2
                                                                ? "px-8 py-5"
                                                                : "px-4 py-2"
                                                        }`}
                                                    >
                                                        {/* Edit button */}
                                                        {Account.admid !== 1 &&
                                                            Account.admid !==
                                                                2 && (
                                                                <a
                                                                    onClick={(
                                                                        e
                                                                    ) =>
                                                                        toEdit(
                                                                            e,
                                                                            Account.admid
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
                                                            )}

                                                        {/* Delete button */}
                                                        {Account.admid !== 1 &&
                                                            Account.admid !==
                                                                2 && (
                                                                <button
                                                                    className="ml-4 group relative inline-block overflow-hidden border border-red-600 px-8 py-3 focus:outline-none focus:ring"
                                                                    onClick={() =>
                                                                        openmodal(
                                                                            Account.admid,
                                                                            Account.admname
                                                                        )
                                                                    }
                                                                >
                                                                    <span className="absolute inset-x-0 bottom-0 h-[2px] bg-red-600 transition-all group-hover:h-full group-active:bg-red-500"></span>{" "}
                                                                    <span className="relative text-sm font-medium text-red-600 transition-colors group-hover:text-white">
                                                                        Delete
                                                                    </span>
                                                                </button>
                                                            )}
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Delete confirmation modal */}
                    <dialog ref={modals} className="modal">
                        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] bg-[#194F90] rounded-lg shadow-lg p-4 backdrop:bg-black/50">
                            <div className="modal-box text-white bg-[#194F90]">
                                <h3 className="font-bold text-lg">
                                    Do you really want to delete Account?
                                </h3>
                                <p className="py-4">
                                    Account Name: {selectedAdmName}
                                </p>
                                <div className="modal-action flex justify-center gap-4">
                                    <button
                                        type="button"
                                        className="mt-6 px-6 py-2 border border-white text-white rounded-lg transition duration-100 ease-in-out hover:bg-white hover:text-[#194F90]"
                                        onClick={(e) =>
                                            deleteAcc(e, selectedaccid)
                                        }
                                    >
                                        Confirm
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-6 px-6 py-2 border border-white text-white rounded-lg transition duration-100 ease-in-out hover:bg-white hover:text-[#194F90]"
                                        onClick={() => modals.current.close()}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </dialog>
                </div>
            </div>

            {/* Add Account component */}
            <div
                className={`absolute w-full h-full transition-transform duration-500 ${
                    showAdd ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <AddAccount setShowAdd={setShowAdd} onSuccess={handleSuccess} />
            </div>

            {/* Edit Account component */}
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
