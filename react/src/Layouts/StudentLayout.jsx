import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import Qwe from "../Component/Subcomponent/Asset/rtu-logo.png";

function StudentLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const modals = useRef(null);
    const location = useLocation();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    const openmodal = () => {
        modals.current.showModal();
    };
    useEffect(() => {
        openmodal();
    }, []);
    return (
        <>
            <div className="flex flex-col h-screen font-poppins overflow-x-hidden w-full">
                <div className="flex flex-1 bg-gray-100">
                    {/* Sidebar */}
                    <div
                        className={`flex flex-col w-64 bg-[#194F90] ${
                            isSidebarOpen ? "" : "hidden"
                        }`}
                    >
                        <div className="flex items-center justify-center gap-2 h-[100px] bg-[#194F90] text-white">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-12 h-12"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                />
                            </svg>
                            <span className="text-white font-bold uppercase mr-2">
                                STUDENT
                            </span>
                        </div>
                        <div className="flex flex-col flex-1 overflow-y-auto">
                            <nav className="flex-1 bg-[#194F90]">
                                <NavLink
                                    to="/student/set-appointment"
                                    className={`flex items-center px-4 py-6 text-white hover:text-white hover:bg-[#123A69] xsm:text-xs sm:text-sm md:text-base ${
                                        location.pathname ===
                                        "/student/set-appointment"
                                            ? "bg-[#123A69]"
                                            : ""
                                    }`}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-6 h-6 mr-2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
                                        />
                                    </svg>
                                    Set Appointment
                                </NavLink>
                                <NavLink
                                    to="/student/view-appointment"
                                    className={`flex items-center px-4 py-6 text-white hover:text-white hover:bg-[#123A69] xsm:text-xs sm:text-sm md:text-base ${
                                        location.pathname ===
                                        "/student/view-appointment"
                                            ? "bg-[#123A69]"
                                            : ""
                                    }`}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-6 h-6 mr-2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"
                                        />
                                    </svg>
                                    View Appointment
                                </NavLink>
                            </nav>
                            <NavLink
                                to="/feedback"
                                className="text-center mb-7 underline text-blue-200 "
                            >
                                Send Feedback
                            </NavLink>
                        </div>
                    </div>

                    {/* Header */}
                    <div className="flex flex-col flex-1">
                        <div className="flex items-center justify-between h-16 bg-white border-b border-gray-200 xsm:w-screen md:w-full">
                            <div className="flex items-center px-4">
                                <button
                                    className="text-gray-500 focus:outline-none hover:text-[#123A69] md:hidden"
                                    onClick={toggleSidebar}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <div>
                                <img
                                    className="xsm:w-[150px] md:w-[200px]"
                                    src={Qwe}
                                    alt=""
                                />
                            </div>
                            <div className="flex items-center pr-4">
                                <NavLink to="../guest">
                                    <button className=" container flex items-center text-gray-500 hover:text-[#123A69] focus:outline-none">
                                        Change to Guest
                                    </button>
                                </NavLink>
                            </div>
                        </div>
                        {/* Main content */}
                        <div className="p-4 bg-white rounded-lg overflow-y-auto flex-1 w-auto xsm:w-screen sm:w-full md:m-4">
                            <Outlet />
                        </div>
                    </div>
                </div>
                <footer className="footer flex text-center justify-center text-sm items-center h-12 border-t w-screen px-6 py-1">
                    <p>
                        Copyright © 2024 - All right reserved by Rizal
                        Technological University
                    </p>
                </footer>
                <dialog ref={modals} className="modal">
                    <div className="flex flex-col justify-center items-center text-white modal-box">
                        <h3 className="font-bold text-lg">
                            Welcome to Rizal Technological University!
                        </h3>
                        <p>*For New Student and Alumni, please select Guest</p>
                        <div className="item-center modal-action">
                            <NavLink to="../guest">
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                >
                                    Guest
                                </button>
                            </NavLink>
                            <button
                                type="button"
                                className="btn btn-outline"
                                onClick={() => {
                                    modals.current.close();
                                }}
                            >
                                Student
                            </button>
                        </div>
                    </div>
                </dialog>
            </div>
        </>
    );
}

export default StudentLayout;
