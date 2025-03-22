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
