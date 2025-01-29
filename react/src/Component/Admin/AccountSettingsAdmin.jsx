import React, { useEffect, useRef, useState } from "react";
import AddAccount from "./Component/AddAccount";
import EditAccount from "./Component/EditAccount";
import { useAuth } from "../../Hooks/useAuth";

function AccountSettingsAdmin() {
    const [accountsData, setAccountsData] = useState([]);
    const [selectedaccid, setselectedaccid] = useState(null);
    const [selectedAdmName, setSelectedAdmName] = useState("");
    const modals = useRef(null);
    const [showEdit, setShowEdit] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [admname, setadmname] = useState("");
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const { branch } = useAuth();

    useEffect(() => {
        const getData = async () => {
            const getRes = await fetch(
                `${apiBaseUrl}/api/admin/bybranch/${branch}`
            );
            const getDataResult = await getRes.json();
            setAccountsData(getDataResult);
            setSearchResults(getDataResult);
        };
        getData();
    }, [branch]);

    useEffect(() => {
        const filteredResults = accountsData.filter((account) => {
            return account.admname
                .toLowerCase()
                .includes(admname.toLowerCase());
        });
        setSearchResults(filteredResults);
    }, [admname, accountsData]);

    const toEdit = (e, accID) => {
        setShowEdit(true);
        setselectedaccid(accID);
        window.location.href = "#edit";
        e.preventDefault();
    };

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
                alert("Account deleted successfully.");
                window.location.reload();
            }
        } catch (error) {
            alert("Error deleting an account. Please try again later.");
        }
    };
    const openmodal = (admid, admname) => {
        setselectedaccid(admid);
        setSelectedAdmName(admname);
        modals.current.showModal();
    };
    return (
        <div className="carousel w-full h-full">
            <div className="carousel-item w-full h-full" id="main">
                <div className="flex justify-center  h-full w-full">
                    <div className="flex flex-col items-center gap-[20px]">
                        <input
                            className="text-gray-800 bg-white mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75] w-[300px] xsm:w-[200px] sm:w-[300px] text-md"
                            type="text"
                            placeholder="Enter Admin Name"
                            onChange={(e) => setadmname(e.target.value)}
                        />
                        <div className="flex justify-end w-full">
                            <a href="#add">
                                <button className="btn bg-[#194F90] hover:bg-[#123A69] text-white rounded-md border-0 inline-block px-8 py-2 text-md font-medium focus:relative">
                                    + Add Admin Account
                                </button>
                            </a>
                        </div>

                        {searchResults.length !== 0 && (
                            // add overflow-x-auto if list gets long
                            <div className="border border-gray-200">
                                <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
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
                                            .slice(0, 9)
                                            .map((Account, index) => (
                                                <tr key={index}>
                                                    <td
                                                        className={`whitespace-nowrap text-gray-700 ${
                                                            Account.admid === 1
                                                                ? "px-8 py-5"
                                                                : "px-4 py-2"
                                                        }`}
                                                    >
                                                        {Account.admname}
                                                    </td>
                                                    <td
                                                        className={`whitespace-nowrap text-gray-700 ${
                                                            Account.admid === 1
                                                                ? "px-8 py-5"
                                                                : "px-4 py-2"
                                                        }`}
                                                    >
                                                        {Account.admuser}
                                                    </td>
                                                    <td
                                                        className={`whitespace-nowrap text-gray-700 ${
                                                            Account.admid === 1
                                                                ? "px-8 py-5"
                                                                : "px-4 py-2"
                                                        }`}
                                                    >
                                                        {Account.admrole}
                                                    </td>

                                                    <td
                                                        className={`whitespace-nowrap text-gray-700 ${
                                                            Account.admid === 1
                                                                ? "px-8 py-5"
                                                                : "px-4 py-2"
                                                        }`}
                                                    >
                                                        <a
                                                            onClick={(e) =>
                                                                toEdit(
                                                                    e,
                                                                    Account.admid
                                                                )
                                                            }
                                                            href="#edit"
                                                        >
                                                            {Account.admid !==
                                                                1 && (
                                                                <button className="group relative inline-block overflow-hidden border border-indigo-600 px-8 py-3 focus:outline-none focus:ring">
                                                                    <span className="absolute inset-x-0 bottom-0 h-[2px] bg-indigo-600 transition-all group-hover:h-full group-active:bg-indigo-500"></span>
                                                                    <span className="relative text-sm font-medium text-indigo-600 transition-colors group-hover:text-white">
                                                                        Edit
                                                                    </span>
                                                                </button>
                                                            )}
                                                        </a>

                                                        {Account.admid !==
                                                            1 && (
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

                    <dialog ref={modals} className="modal">
                        <div className="modal-box text-white bg-[#194F90]">
                            <h3 className="font-bold text-lg">
                                Do you really want to delete Account?
                            </h3>
                            <p className="py-4">
                                Account Name: {selectedAdmName}
                            </p>
                            <div className="modal-action">
                                <button
                                    type="button"
                                    className="btn btn-outline text-white hover:bg-white hover:text-[#194F90]"
                                    onClick={(e) => deleteAcc(e, selectedaccid)}
                                >
                                    Confirm
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline text-white hover:bg-white hover:text-[#194F90]"
                                    onClick={() => {
                                        modals.current.close();
                                        window.location.reload();
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </dialog>
                </div>
            </div>
            <div className="carousel-item w-full h-[700px]" id="add">
                <AddAccount />
            </div>

            <div className="carousel-item w-full h-full" id="edit">
                {showEdit && <EditAccount selectedaccid={selectedaccid} />}
            </div>
        </div>
    );
}

export default AccountSettingsAdmin;
