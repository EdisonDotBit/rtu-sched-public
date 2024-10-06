import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import Qwe from "../Component/Subcomponent/Asset/logo.png";

function StudentLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const modals = useRef(null);
    const location = useLocation();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const openModal = () => {
        modals.current.showModal();
    };

    useEffect(() => {
        openModal();
    }, []);

    return (
        <div className="flex flex-col h-screen overflow-hidden font-roboto">
            {/* Header */}
            <div className="flex items-center justify-between h-20 bg-white border-b border-gray-200 px-2">
                <div className="flex items-center px-4">
                    <button
                        className="text-gray-500 focus:outline-none hover:text-[#123A69] lg:hidden"
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
                    <div className="flex items-center gap-3">
                        <img
                            className="h-auto w-16"
                            src={Qwe}
                            alt="University Logo"
                        />
                        <span className="text-2xl font-bold text-[#194F90]">
                            ONLINE APPOINTMENT
                        </span>
                    </div>
                </div>
                <div className="flex items-center pr-4">
                    <NavLink to="../guest">
                        <button className="text-gray-500 hover:text-[#123A69]">
                            Change to Guest
                        </button>
                    </NavLink>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div
                    className={`lg:flex flex-col w-64 bg-[#194F90] ${
                        isSidebarOpen ? "" : "hidden"
                    }`}
                >
                    <div className="flex items-center gap-2 h-[100px] bg-[#194F90] text-white px-6 py-6">
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
                        <span className="text-white font-bold uppercase">
                            STUDENT
                        </span>
                    </div>
                    <nav className="flex flex-col flex-1 overflow-y-auto">
                        <NavLink
                            to="/student/set-appointment"
                            className={`relative flex items-center px-8 py-6 text-white hover:text-white hover:bg-[#123A69] ${
                                location.pathname === "/student/set-appointment"
                                    ? "bg-[#123A69]"
                                    : ""
                            }`}
                        >
                            <span
                                className={`absolute left-0 h-full w-1 bg-[#FEE000] ${
                                    location.pathname ===
                                    "/student/set-appointment"
                                        ? "opacity-100"
                                        : "opacity-0"
                                }`}
                            ></span>
                            Set Appointment
                        </NavLink>
                        <NavLink
                            to="/student/view-appointment"
                            className={`relative flex items-center px-8 py-6 text-white hover:bg-[#123A69] ${
                                location.pathname ===
                                "/student/view-appointment"
                                    ? "bg-[#123A69]"
                                    : ""
                            }`}
                        >
                            <span
                                className={`absolute left-0 h-full w-1 bg-[#FEE000] ${
                                    location.pathname ===
                                    "/student/view-appointment"
                                        ? "opacity-100"
                                        : "opacity-0"
                                }`}
                            ></span>
                            View Appointment
                        </NavLink>
                    </nav>

                    <NavLink
                        to="/feedback"
                        className="text-center mb-7 underline text-blue-200"
                    >
                        Send Feedback
                    </NavLink>
                </div>

                {/* Main Content Area */}
                <div className="flex flex-col flex-1">
                    <div className="p-10 bg-white rounded-lg flex-1 overflow-y-auto">
                        <Outlet />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="h-9 border-t text-center text-sm text-[#3c4043] flex items-center justify-center">
                <p>
                    Copyright © 2024 - All rights reserved by Rizal
                    Technological University
                </p>
            </footer>

            {/* Modal */}
            <dialog ref={modals} className="modal">
                <div className="flex flex-col justify-center items-center text-white modal-box">
                    <h3 className="font-bold text-lg">
                        Welcome to Rizal Technological University!
                    </h3>
                    <p>**For New Student and Alumni, please select Guest**</p>
                    <div className="modal-action">
                        <NavLink to="../guest">
                            <button type="button" className="btn btn-outline">
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
    );
}

export default StudentLayout;
