import React, { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import Qwe from "../Component/Subcomponent/Asset/rtu-logo.png";

function GuestLayout() {
import { NavLink, Outlet, useLocation } from "react-router-dom";
import Qwe from "../Component/Subcomponent/Asset/rtu-logo.png";

function StudentLayout() {
    // State to track whether the sidebar is open or closed
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    // Get the current location
    const location = useLocation();

    // Function to toggle the sidebar state
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
            <div className="flex h-screen bg-gray-100">
                {/* Sidebar */}
                <div
                    className={`sm: md:flex flex-col w-64 bg-gray-800 ${
                        isSidebarOpen ? "" : "hidden"
                    }`}
                >
                    <div className="flex items-center justify-center h-16 bg-gray-900">
                        <span className="text-white font-bold uppercase">
                            RTU Online Appointment
                        </span>
                    </div>
                    <div className="flex flex-col flex-1 overflow-y-auto">
                        <nav className="flex-1 px-2 py-4 bg-gray-800">
                            <a
                                href="#"
                                className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 mr-2"
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
                                Dashboard
                            </a>
                            <a
                                href="#"
                                className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 mr-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                                Set Appointment
                            </a>
                            <a
                                href="#"
                                className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 mr-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M13 10V3L4 14h7v7l9-11h-7z"
                                    />
                                </svg>
                                View Appointment
                            </a>
                        </nav>
                    </div>
                </div>

                    {/* Header */}
                    <div className="flex flex-col flex-1">
                        <div className="flex items-center justify-between h-16 bg-white border-b border-gray-200">
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
                                <img className="w-[200px]" src={Qwe} alt="" />
                            </div>
                            <div className="flex items-center pr-4">
                                <button className="flex items-center text-gray-500 hover:text-[#123A69] focus:outline-none">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-8 h-8"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        {/* Main content */}
                        <div className="p-4 bg-white rounded-lg m-4 overflow-y-auto flex-1">
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
            </div>
        </>
    );
}

export default StudentLayout;
