import { useEffect, useRef, useState } from "react";
import Calendar from "./Calendar";
import axios from "axios";
import PDFFile from "../PDFFile";
import { PDFDownloadLink } from "@react-pdf/renderer";
function DetailsInfo({ aptData, appointments }) {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const [formData, setFormData] = useState({});
    const modalRef1 = useRef(null);
    const modalRef2 = useRef(null);
    const [limit, setLimit] = useState();
    const openModal1 = () => {
        modalRef1.current.showModal();
    };
    const openModal2 = () => {
        modalRef2.current.showModal();
    };

    useEffect(() => {
        const getData = async () => {
            const getRes = await fetch(
                `${apiBaseUrl}/api/office/find/${aptData.aptoffice}`
            );
            if (getRes.status === 200) {
                const getDataResult = await getRes.json();
                setLimit(getDataResult.data.offlimit);
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    aptoffice: aptData.aptoffice,
                }));
            }
        };
        getData();
    }, [aptData]);

    const handleReSched = async (e, id) => {
        e.preventDefault();
        try {
            const updateRes = await axios.put(
                `${apiBaseUrl}/api/resched/${id}`,
                formData
            );
            if (updateRes.status === 200) {
                alert("Appointment update successful.");
                // Optionally, you can reload the page or update the UI here
            } else {
                alert("Failed to update appointment.");
            }
        } catch (error) {
            console.error("Error updating appointment:", error);
            alert("Error updating appointment. Please try again later.");
        }
    };

    const handleDelete = async (e, id) => {
        e.preventDefault();
        try {
            const deleteRes = await axios.delete(
                `${apiBaseUrl}/api/delappt/${id}`
            );
            if (deleteRes.status === 200) {
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
        <div>
            <div className="flow-root rounded-lg border border-gray-100 py-3 shadow-sm mb-4 w-full">
                <dl className="-my-3 divide-y divide-gray-100 text-sm w-2/3 md:w-full">
                    <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-1 sm:gap-4">
                        <dt className="font-bold text-[#EAB800] text-[16px]">
                            <h1>PERSONAL INFORMATION</h1>
                        </dt>
                    </div>
                    <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-semibold text-[#3B3838] ml-10">
                            Student Number
                        </dt>
                        <dd className="text-gray-700 sm:col-span-2 justify-self-center">
                            {aptData.aptstudnum ? aptData.aptstudnum : "N/A"}
                        </dd>
                    </div>
                    <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-semibold text-[#3B3838] ml-10">
                            Full Name
                        </dt>
                        <dd className="text-gray-700 sm:col-span-2 justify-self-center">
                            {aptData.aptname ? aptData.aptname : "N/A"}
                        </dd>
                    </div>
                    <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-semibold text-[#3B3838] ml-10">
                            Contact Number
                        </dt>
                        <dd className="text-gray-700 sm:col-span-2 justify-self-center">
                            {aptData.aptpnumber ? aptData.aptpnumber : "N/A"}
                        </dd>
                    </div>
                    <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-semibold text-[#3B3838] ml-10">
                            Email Address
                        </dt>
                        <dd className="text-gray-700 sm:col-span-2 justify-self-center">
                            {aptData.aptemail ? aptData.aptemail : "N/A"}
                        </dd>
                    </div>
                </dl>
            </div>
            <div className="flow-root rounded-lg border border-gray-100 py-3 shadow-sm mb-4 ">
                <dl className="-my-3 divide-y divide-gray-100 text-sm">
                    <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-1 sm:gap-4">
                        <dt className="font-bold text-[#EAB800] text-[16px]">
                            <h1>APPOINTMENT INFORMATION</h1>
                        </dt>
                    </div>
                    <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-semibold text-[#3B3838] ml-10">
                            RTU Branch
                        </dt>
                        <dd className="text-gray-700 sm:col-span-2 justify-self-center text-center">
                            {aptData.aptbranch ? aptData.aptbranch : "N/A"}
                        </dd>
                    </div>
                    <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-semibold text-[#3B3838] ml-10">
                            Office Name
                        </dt>
                        <dd className="text-gray-700 sm:col-span-2 justify-self-center text-center">
                            {aptData.aptoffice ? aptData.aptoffice : "N/A"}
                        </dd>
                    </div>
                    <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-semibold text-[#3B3838] ml-10">
                            Purpose
                        </dt>
                        <dd className="text-gray-700 sm:col-span-2 justify-self-center text-center">
                            {aptData.aptpurpose ? aptData.aptpurpose : "N/A"}
                        </dd>
                    </div>
                    <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-semibold text-[#3B3838] ml-10">
                            Date
                        </dt>
                        <dd className="text-gray-700 sm:col-span-2 justify-self-center text-center">
                            {aptData.aptdate ? aptData.aptdate : "N/A"}
                        </dd>
                    </div>
                    <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-semibold text-[#3B3838] ml-10">
                            Time
                        </dt>
                        <dd className="text-gray-700 sm:col-span-2 justify-self-center text-center">
                            {aptData.apttime ? aptData.apttime : "N/A"}
                        </dd>
                    </div>
                    <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-semibold text-[#3B3838] ml-10">
                            Appointment Number
                        </dt>
                        <dd className="text-gray-700 sm:col-span-2 justify-self-center text-center">
                            {aptData.aptid ? aptData.aptid : "N/A"}
                        </dd>
                    </div>
                </dl>
            </div>

            <div className="flex justify-evenly">
                <button
                    className="flex justify-center items-center bg-red-500 text-white py-2 px-4 rounded-md w-1/3 mr-2"
                    onClick={() => openModal2(aptData)}
                >
                    Delete
                </button>
                <PDFDownloadLink
                    document={<PDFFile succData={aptData} />}
                    fileName="PaoloBanagloriosoAtEdisotLati_nga_pala.pdf"
                >
                    {({ loading }) =>
                        loading ? (
                            <button className="flex justify-center items-center bg-blue-500 text-white py-2 px-4 rounded-md w-full ml-2 ">
                                Loading...
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="flex justify-center items-center bg-blue-500 text-white py-2 px-4 rounded-md w-full ml-2"
                            >
                                Print
                            </button>
                        )
                    }
                </PDFDownloadLink>
                <button
                    className="flex justify-center items-center bg-blue-500 text-white py-2 px-4 rounded-md w-1/3 ml-2"
                    onClick={() => openModal1(formData)}
                >
                    Reschedule
                </button>
            </div>
            <dialog ref={modalRef1} className="modal">
                <div className="modal-box text-white bg-gray-800">
                    <h3 className="font-bold text-lg">Pick a date</h3>

                    <Calendar
                        formData={formData}
                        setFormData={setFormData}
                        limit={limit}
                        appointments={appointments}
                    />
                    <div className="modal-action">
                        <button
                            className="btn"
                            type="button"
                            onClick={(e) => handleReSched(e, aptData.aptid)}
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
                <div className="modal-box text-white bg-gray-800">
                    <h3 className="font-bold text-lg">
                        Do you really really really want to delete this shit?
                    </h3>
                    <p className="py-4">Appointment Number: {aptData.aptid}</p>
                    <div className="modal-action">
                        <button
                            type="button"
                            className="btn"
                            onClick={(e) => handleDelete(e, aptData.aptid)}
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
        </div>
    );
}

export default DetailsInfo;
