import { useEffect, useRef, useState } from "react";
import Calendar from "./Calendar";
import TimePicker from "./TimePicker";
import axios from "axios";
import PDFFile from "../PDFFile";
import { PDFDownloadLink } from "@react-pdf/renderer";
function DetailsInfo({ aptData, appointments }) {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const [formData, setFormData] = useState({});
    const modalRef1 = useRef(null);
    const modalRef2 = useRef(null);
    const [limit, setLimit] = useState();
    const [isTimeSelected, setIsTimeSelected] = useState(false);

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
                    aptbranch: aptData.aptbranch,
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
                alert("Appointment update successful. Page will reload.");
                window.location.reload();
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
                alert("Appointment deleted successfully. Page will reload");
                window.location.reload();
            } else {
                alert("Failed to delete appointment.");
            }
        } catch (error) {
            console.error("Error deleting appointment:", error);
            alert("Error deleting appointment. Please try again later.");
        }
    };

    const handleTimeSelect = () => {
        setIsTimeSelected(true);
    };

    return (
        <div className="flex flex-col flex-1 w-full h-auto justify-center">
            {/* Personal Information Section */}
            <div className="bg-white flow-root rounded-lg border border-gray-100 shadow-sm mb-4">
                <dl className="divide-y divide-gray-100 text-sm w-full lg:w-[800px]">
                    {/* Personal Information Header */}
                    <div className="grid grid-cols-1 p-2 bg-[#194F90] text-white rounded-t-md">
                        <dt className="font-bold text-white text-[16px] text-center md:text-left">
                            PERSONAL INFORMATION
                        </dt>
                    </div>

                    {/* Personal Information Rows */}
                    <div className="grid grid-cols-1 p-2 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-semibold text-[#3B3838] md:ml-10 text-center md:text-left">
                            Student or ID Number / Type
                        </dt>
                        <dd className="text-gray-700 sm:col-span-2 text-center sm:text-left">
                            {aptData.aptstudnum ? aptData.aptstudnum : "N/A"}
                        </dd>
                    </div>

                    <div className="grid grid-cols-1 p-2 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-semibold text-[#3B3838] md:ml-10 text-center md:text-left">
                            Full Name
                        </dt>
                        <dd className="text-gray-700 sm:col-span-2 text-center sm:text-left">
                            {aptData.aptname ? aptData.aptname : "N/A"}
                        </dd>
                    </div>

                    <div className="grid grid-cols-1 p-2 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-semibold text-[#3B3838] md:ml-10 text-center md:text-left">
                            Contact Number
                        </dt>
                        <dd className="text-gray-700 sm:col-span-2 text-center sm:text-left">
                            {aptData.aptpnumber ? aptData.aptpnumber : "N/A"}
                        </dd>
                    </div>
                    <div className="grid grid-cols-1 p-2 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-semibold text-[#3B3838] md:ml-10 text-center md:text-left">
                            Email Address
                        </dt>
                        <dd className="text-gray-700 sm:col-span-2 text-center sm:text-left">
                            {aptData.aptemail ? aptData.aptemail : "N/A"}
                        </dd>
                    </div>
                </dl>
            </div>

            {/* Appointment Information Section */}
            <div className="flow-root rounded-lg border border-gray-100 shadow-sm mb-4">
                <dl className="divide-y divide-gray-100 text-sm w-full lg:w-[800px]">
                    {/* Appointment Information Header */}
                    <div className="grid grid-cols-1 p-2 bg-[#194F90] text-white rounded-t-md">
                        <dt className="font-bold text-white text-[16px] text-center md:text-left">
                            APPOINTMENT INFORMATION
                        </dt>
                    </div>

                    {/* Appointment Information Rows */}
                    <div className="grid grid-cols-1 p-2 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-semibold text-[#3B3838] md:ml-10 text-center md:text-left">
                            Account Type
                        </dt>
                        <dd className="text-gray-700 sm:col-span-2 text-center sm:text-left">
                            {aptData.apttype ? aptData.apttype : "N/A"}
                        </dd>
                    </div>

                    <div className="grid grid-cols-1 p-2 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-semibold text-[#3B3838] md:ml-10 text-center md:text-left">
                            RTU Branch
                        </dt>
                        <dd className="text-gray-700 sm:col-span-2 text-center sm:text-left">
                            {aptData.aptbranch ? aptData.aptbranch : "N/A"}
                        </dd>
                    </div>

                    <div className="grid grid-cols-1 p-2 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-semibold text-[#3B3838] md:ml-10 text-center md:text-left">
                            Office Name
                        </dt>
                        <dd className="text-gray-700 sm:col-span-2 text-center sm:text-left">
                            {aptData.aptoffice ? aptData.aptoffice : "N/A"}
                        </dd>
                    </div>

                    <div className="grid grid-cols-1 p-2 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-semibold text-[#3B3838] md:ml-10 text-center md:text-left">
                            Purpose
                        </dt>
                        <dd className="text-gray-700 sm:col-span-2 text-center sm:text-left">
                            {aptData.aptpurpose ? aptData.aptpurpose : "N/A"}
                        </dd>
                    </div>
                    <div className="grid grid-cols-1 p-2 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-semibold text-[#3B3838] md:ml-10 text-center md:text-left">
                            Date
                        </dt>
                        <dd className="text-gray-700 sm:col-span-2 text-center sm:text-left">
                            {aptData.aptdate ? aptData.aptdate : "N/A"}
                        </dd>
                    </div>
                    <div className="grid grid-cols-1 p-2 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-semibold text-[#3B3838] md:ml-10 text-center md:text-left">
                            Time
                        </dt>
                        <dd className="text-gray-700 sm:col-span-2 text-center sm:text-left">
                            {aptData.apttime ? aptData.apttime : "N/A"}
                        </dd>
                    </div>
                    <div className="grid grid-cols-1 p-2 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-semibold text-[#3B3838] md:ml-10 text-center md:text-left">
                            Appointment Number
                        </dt>
                        <dd className="text-gray-700 sm:col-span-2 text-center sm:text-left">
                            {aptData.aptid ? aptData.aptid : "N/A"}
                        </dd>
                    </div>
                </dl>
            </div>

            <div className="flex justify-evenly mb-4">
                <button
                    className="flex justify-center items-center bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-md w-1/3 mr-2"
                    onClick={() => openModal2(aptData)}
                >
                    Delete
                </button>
                <PDFDownloadLink
                    document={<PDFFile succData={aptData} />}
                    fileName="RTU-Appointment-Receipt.pdf"
                >
                    {({ loading }) =>
                        loading ? (
                            <button className="flex justify-center items-center bg-blue-500 text-white py-2 px-4 rounded-md w-full ml-2 ">
                                Loading Download...
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="flex justify-center items-center bg-blue-500 hover:bg-blue-800 text-white py-2 px-8 rounded-md w-full"
                            >
                                Print
                            </button>
                        )
                    }
                </PDFDownloadLink>
                <button
                    className="flex justify-center items-center bg-blue-500 hover:bg-blue-800 text-white py-2 px-4 rounded-md w-1/3 ml-2"
                    onClick={() => openModal1(formData)}
                >
                    Reschedule
                </button>
            </div>

            <dialog ref={modalRef1} className="modal">
                <div className="modal-box w-full max-w-3xl min-h-[50vh] sm:min-h-[60vh] lg:min-h-[70vh] overflow-y-auto flex flex-col justify-start items-center text-white bg-gray-100">
                    <h1 className="font-bold text-3xl text-black mb-6">
                        Reschedule Appointment
                    </h1>

                    <div className="w-full flex flex-col sm:flex-row justify-center items-center">
                        <Calendar
                            formData={formData}
                            setFormData={setFormData}
                            limit={limit}
                            appointments={appointments}
                        />
                        <TimePicker
                            formData={formData}
                            setFormData={setFormData}
                            limit={limit}
                            appointments={appointments}
                            setTimeSelected={handleTimeSelect}
                        />
                    </div>

                    <div className="modal-action">
                        <button
                            className={`px-4 text-sm font-semibold border-none rounded-md ${
                                isTimeSelected
                                    ? "bg-[#194F90] hover:bg-[#123A69]"
                                    : "bg-gray-400 cursor-not-allowed"
                            } font-medium`}
                            type="button"
                            onClick={(e) => handleReSched(e, aptData.aptid)}
                            disabled={!isTimeSelected}
                        >
                            Confirm
                        </button>

                        <button
                            type="button"
                            className="btn border-none bg-[#194F90] text-white hover:bg-[#123A69]"
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
                <div className="modal-box flex flex-col items-center justify-center text-white bg-[#194F90]">
                    <h3 className="font-bold text-lg">
                        Do you want to delete this appointment?
                    </h3>
                    <p className="py-4">Appointment Number: {aptData.aptid}</p>
                    <div className="modal-action gap-4">
                        <button
                            type="button"
                            className="btn btn-outline text-white hover:bg-white hover:text-[#194F90]"
                            onClick={(e) => handleDelete(e, aptData.aptid)}
                        >
                            Confirm
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline text-white hover:bg-white hover:text-[#194F90]"
                            onClick={() => {
                                modalRef2.current.close();
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
