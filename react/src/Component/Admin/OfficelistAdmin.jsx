import { useState, useRef, useEffect } from "react";
import AddOffice from "./Component/AddOffice";
import EditOffice from "./Component/EditOffice";

function OfficelistAdmin() {
    const [offabbr, setoffabbr] = useState("");
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const [offData, setoffData] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const modalRef1 = useRef(null);
    const modalRef2 = useRef(null);
    const [selectedOffid, setSelectedOffid] = useState(null);
    const [showEdit, setShowEdit] = useState(false);
    const [showAddOffice, setShowAddOffice] = useState(true);
    useEffect(() => {
        const getData = async () => {
            const getRes = await fetch(`${apiBaseUrl}/api/office/all`);
            const getDataResult = await getRes.json();
            setoffData(getDataResult);
            setSearchResults(getDataResult);
        };
        getData();
    }, []);

    useEffect(() => {
        const filteredResults = offData.filter((office) => {
            return office.offabbr.toLowerCase().includes(offabbr.toLowerCase());
        });
        setSearchResults(filteredResults);
    }, [offabbr, offData]);

    const toEdit = (e, officeNum) => {
        setShowEdit(true);
        setShowAddOffice(false);
        setSelectedOffid(officeNum);
        window.location.href = "#edit";
        e.preventDefault();
    };
    const openmodal = (officeNum) => {
        setSelectedOffid(officeNum);
        modalRef2.current.showModal();
    };

    const deleteOff = async (e, id) => {
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
                // Remove the deleted appointment from the local state
                setoffData((prevData) =>
                    prevData.filter((apt) => apt.aptid !== id)
                );
                setSearchResults((prevResults) =>
                    prevResults.filter((apt) => apt.aptid !== id)
                );
                alert("Appointment deleted successfully.");
            } else {
                alert("Failed to delete appointment.");
            }
        } catch (error) {
            console.error("Error deleting appointment:", error);
            alert("Error deleting appointment. Please try again later.");
        }
    };
    return (
        <>
            <div className="carousel w-full h-full">
                <div className="carousel-item w-full h-full" id="main">
                    <div className="flex justify-center  h-full w-full">
                        <div className="flex flex-col items-center gap-[20px]">
                            <input
                                className="flex justify-center bg-neutral-200 border-r-teal-400 items-center text-center w-[300px] p-[5px]"
                                type="text"
                                placeholder="Enter Office Abbreviation"
                                value={offabbr}
                                onChange={(e) => setoffabbr(e.target.value)}
                            />
                            <div className="flex justify-end w-full">
                                <a href="#add">
                                    <button className="btn bg-amber-300 w-50">
                                        + Add Office
                                    </button>
                                </a>
                            </div>

                            {searchResults.length !== 0 && (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                                        <thead className="ltr:text-center rtl:text-center">
                                            <tr>
                                                <th className=" whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                                    Office ID
                                                </th>
                                                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                                    Office Name
                                                </th>
                                                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                                    Office
                                                    <br />
                                                    Abbreviation
                                                </th>
                                                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                                    Office Limit
                                                </th>
                                                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                                    Tools
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-gray-200">
                                            {searchResults
                                                .slice(0, 9)
                                                .map((office, index) => (
                                                    <tr key={index}>
                                                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                                            {office.offid}
                                                        </td>
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
                                                                        office.offid
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

                        <dialog ref={modalRef2} className="modal">
                            <div className="modal-box">
                                <h3 className="font-bold text-lg">
                                    Do you really really want to delete this
                                    shit?
                                </h3>
                                <p className="py-4">
                                    Appointment Number: {selectedOffid}
                                </p>
                                <div className="modal-action">
                                    <button
                                        type="button"
                                        className="btn"
                                        onClick={(e) =>
                                            deleteOff(e, selectedOffid)
                                        }
                                    >
                                        Confirm
                                    </button>
                                    <button
                                        type="button"
                                        className="btn"
                                        onClick={() => {
                                            modalRef2.current.close();
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
                    <AddOffice />
                </div>
                <div className="carousel-item w-full h-full" id="edit">
                    {showEdit && <EditOffice selectedOffid={selectedOffid} />}
                </div>
            </div>
        </>
    );
}

export default OfficelistAdmin;
