import { useEffect, useState, useRef } from "react";

function AppointmentsAdmin() {
    const [aptemail, setAptEmail] = useState("");
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const [aptData, setAptData] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const modalRef1 = useRef(null);
    const modalRef2 = useRef(null);
    const [selectedAppointmentNum, setSelectedAppointmentNum] = useState(null);

    useEffect(() => {
        const getData = async () => {
            const getRes = await fetch(`${apiBaseUrl}/api/all`);
            const getDataResult = await getRes.json();
            setAptData(getDataResult);
            setSearchResults(getDataResult);
        };
        getData();
    }, []);

    useEffect(() => {
        const filteredResults = aptData.filter((apt) => {
            return apt.aptemail.toLowerCase().includes(aptemail.toLowerCase());
        });
        setSearchResults(filteredResults);
    }, [aptemail, aptData]);

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
            }
        } catch (error) {
            alert("Error updating appointment. Please try again later.");
        }
    };

    return (
        <div className="flex justify-center  h-full">
            <div className="flex flex-col items-center gap-[20px]">
                <input
                    className="flex justify-center items-center text-center w-[300px] p-[5px]"
                    type="text"
                    placeholder="Enter email address"
                    value={aptemail}
                    onChange={(e) => setAptEmail(e.target.value)}
                />
                {searchResults.length !== 0 && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                            <thead className="ltr:text-center rtl:text-center">
                                <tr>
                                    <th className=" whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                        Appointment
                                        <br />
                                        Number
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                        Type
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                        Full name
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                        Branch
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                        Office
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                        Purpose
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                        ID <br />
                                        Number / Type
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                        Status
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                        Email
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200">
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
                                                    className="group relative inline-block overflow-hidden border border-indigo-600 px-8 py-3 focus:outline-none focus:ring"
                                                    onClick={() =>
                                                        openModal1(apt.aptid)
                                                    }
                                                >
                                                    <span className="absolute inset-x-0 bottom-0 h-[2px] bg-indigo-600 transition-all group-hover:h-full group-active:bg-indigo-500"></span>
                                                    <span className="relative text-sm font-medium text-indigo-600 transition-colors group-hover:text-white">
                                                        Done
                                                    </span>
                                                </button>
                                                <button
                                                    className="ml-4 group relative inline-block overflow-hidden border border-red-600 px-8 py-3 focus:outline-none focus:ring"
                                                    onClick={() =>
                                                        openModal2(apt.aptid)
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
            <dialog ref={modalRef1} className="modal">
                <div className="modal-box border-cyan-400 bg-slate-300">
                    <h3 className="font-bold text-lg">Modal 1 Content</h3>
                    <p className="py-4">
                        Appointment Number: {selectedAppointmentNum}
                    </p>
                    <div className="modal-action">
                        <button
                            className="btn"
                            type="button"
                            onClick={(e) => upApt(e, selectedAppointmentNum)}
                        >
                            Confirm
                        </button>
                        <button
                            type="button"
                            className="btn"
                            onClick={() => {
                                modalRef1.current.close();
                                window.location.reload();
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </dialog>

            <dialog ref={modalRef2} className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Modal 2 Content</h3>
                    <p className="py-4">
                        Appointment Number: {selectedAppointmentNum}
                    </p>
                    <div className="modal-action">
                        <button
                            type="button"
                            className="btn"
                            onClick={(e) =>
                                deleteApt(e, selectedAppointmentNum)
                            }
                        >
                            Confirm
                        </button>
                        <button
                            type="button"
                            className="btn"
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
