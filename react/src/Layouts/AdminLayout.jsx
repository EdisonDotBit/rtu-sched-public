import React, { useState } from "react";
import { NavLink, Outlet, useLocation, Link } from "react-router-dom";
import Qwe from "../Component/Subcomponent/Asset/rtu-logo.png";
import { useAuth } from "../Hooks/useAuth";

function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const { logout } = useAuth();
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    const handleLogout = () => {
        logout();
    };

    return (
        <>
            <div className="flex flex-col h-screen font-poppins overflow-x-hidden w-full">
                <div className="flex flex-1 bg-gray-100">
                    {/* Sidebar */}
                    <div
                        className={`md:flex flex-col w-64 bg-[#194F90] ${
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
                                Admin
                            </span>
                        </div>
                        <div className="flex flex-col flex-1 overflow-y-auto">
                            <nav className="flex-1 bg-[#194F90]">
                                <NavLink
                                    to="/ewqqwe/admin/feedback"
                                    className={`flex items-center px-4 py-6 text-white hover:text-white hover:bg-[#123A69] ${
                                        location.pathname ===
                                        "/ewqqwe/admin/feedback"
                                            ? "bg-[#123A69]"
                                            : ""
                                    }`}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke-width="1.5"
                                        stroke="currentColor"
                                        class="w-6 h-6 mr-2"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                                        />
                                    </svg>
                                    Feedbacks
                                </NavLink>
                                <NavLink
                                    to="/ewqqwe/admin/appointments"
                                    className={`flex items-center px-4 py-6 text-white hover:text-white hover:bg-[#123A69] ${
                                        location.pathname ===
                                        "/ewqqwe/admin/appointments"
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
                                    Appointment
                                </NavLink>
                                <NavLink
                                    to="/ewqqwe/admin/manage"
                                    className={`flex items-center px-4 py-6 text-white hover:text-white hover:bg-[#123A69] ${
                                        location.pathname ===
                                        "/ewqqwe/admin/manage"
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
                                        className="w-6 h-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                                        />
                                    </svg>
                                    Manage My Account
                                </NavLink>
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
                                <button
                                    className="flex items-center text-gray-500 hover:text-[#123A69] focus:outline-none"
                                    onClick={handleLogout}
                                >
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
                        Copyright © 2024 - All rights reserved by Rizal
                        Technological University
                    </p>
                </footer>
            </div>
        </>
    );
}

export default AdminLayout;
