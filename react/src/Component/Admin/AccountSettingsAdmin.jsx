import React, { useEffect, useRef, useState } from "react";
import AddAccount from "./Component/AddAccount";
import EditAccount from "./Component/EditAccount";

function AccountSettingsAdmin() {
    const [accountsData, setAccountsData] = useState([]);
    const [selectedaccid, setselectedaccid] = useState(null);
    const modals = useRef(null);
    const [showEdit, setShowEdit] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [admname, setadmname] = useState("");
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const getData = async () => {
            const getRes = await fetch(`${apiBaseUrl}/api/admin/all`);
            const getDataResult = await getRes.json();
            setSearchResults(getDataResult);
        };
        getData();
    }, []);

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
            }
        } catch (error) {
            alert("Error deleting an account. Please try again later.");
        }
    };
    const openmodal = (admid) => {
        setselectedaccid(admid);
        modals.current.showModal();
    };
    return (
        <div className="carousel w-full h-full">
            <div className="carousel-item w-full h-full" id="main">
                <div className="flex justify-center  h-full w-full">
                    <div className="flex flex-col items-center gap-[20px]">
                        <input
                            className="flex justify-center bg-neutral-200 border-r-teal-400 items-center text-center w-[300px] p-[5px]"
                            type="text"
                            placeholder="Enter the Full Name"
                            onChange={(e) => setadmname(e.target.value)}
                        />
                        <div className="flex justify-end w-full">
                            <a href="#add">
                                <button className="btn bg-amber-300 w-50">
                                    + Add Admin Account
                                </button>
                            </a>
                        </div>

                        {searchResults.length !== 0 && (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                                    <thead className="ltr:text-center rtl:text-center">
                                        <tr>
                                            <th className=" whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                                Employee Number
                                            </th>
                                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                                Full name
                                            </th>
                                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                                Username
                                            </th>
                                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                                Tools
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-200">
                                        {searchResults
                                            .slice(0, 9)
                                            .map((Account, index) => (
                                                <tr key={index}>
                                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                                        {Account.admempnum}
                                                    </td>
                                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                                        {Account.admname}
                                                    </td>
                                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                                        {Account.admuser}
                                                    </td>
                                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                                        <a
                                                            onClick={(e) =>
                                                                toEdit(
                                                                    e,
                                                                    Account.admid
                                                                )
                                                            }
                                                            href="#edit"
                                                        >
                                                            <button className="group relative inline-block overflow-hidden border border-indigo-600 px-8 py-3 focus:outline-none focus:ring">
                                                                <span className="absolute inset-x-0 bottom-0 h-[2px] bg-slate-400 transition-all group-hover:h-full group-active:bg-slate-500"></span>
                                                                <span className="relative text-sm font-medium text-indigo-600 transition-colors group-hover:text-white">
                                                                    Edit
                                                                </span>
                                                            </button>
                                                        </a>

                                                        <button
                                                            className="ml-4 group relative inline-block overflow-hidden border border-red-600 px-8 py-3 focus:outline-none focus:ring"
                                                            onClick={() =>
                                                                openmodal(
                                                                    Account.admid
                                                                )
                                                            }
                                                        >
                                                            <span className="absolute inset-x-0 bottom-0 h-[2px] bg-red-600 transition-all group-hover:h-full group-active:bg-red-500"></span>
                                                            <span className="relative text-sm font-medium text-red-600 transition-colors group-hover:text-white">
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

                    <dialog ref={modals} className="modal">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">
                                Do you really really want to delete this shit?
                            </h3>
                            <p className="py-4">
                                Account username: {selectedaccid}
                            </p>
                            <div className="modal-action">
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={(e) => deleteAcc(e, selectedaccid)}
                                >
                                    Confirm
                                </button>
                                <button
                                    type="button"
                                    className="btn"
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
