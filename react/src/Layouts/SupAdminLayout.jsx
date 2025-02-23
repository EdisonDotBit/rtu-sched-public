import { useState } from "react";
import { NavLink, Outlet, useLocation, Link } from "react-router-dom";
import Logo from "../Component/Subcomponent/Asset/rtu_logo_v3.png";
import { useAuth } from "../Hooks/useAuth";

function SupAdminLayout() {
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
            <div className="font-[roboto] flex flex-col h-screen font-poppins overflow-x-hidden w-full">
                {/* Header */}
                <header className="flex items-center justify-between bg-[#FFDB75] px-6 py-2 sm:h-16 lg:h-16">
                    {/* Header */}

                    {/* version 2 */}
                    <div className="flex items-center gap-4">
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
                        <div className="flex items-center gap-2">
                            <NavLink to="feedbacks">
                                <img
                                    className="h-auto w-[200px] lg:w-56"
                                    src={Logo}
                                    alt="University Logo"
                                />
                            </NavLink>
                        </div>
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
                </header>

                {/* Main Content */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar */}
                    <aside
                        className={`fixed inset-y-0 left-0 z-30 w-72 sm:w-60 bg-[#194F90] transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
                            isSidebarOpen
                                ? "translate-x-0"
                                : "-translate-x-full"
                        } flex flex-col`}
                    >
                        <div className="flex items-center justify-between gap-2 h-20 bg-[#194F90] text-white px-6 py-4 md:h-24">
                            <div className="flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-10 h-10 sm:w-12 sm:h-12"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                    />
                                </svg>
                                <span className="text-base sm:text-lg text-white font-bold uppercase px-2">
                                    SUPER ADMIN
                                </span>
                            </div>
                            <button
                                className="text-white lg:hidden"
                                onClick={toggleSidebar}
                                _
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    className="w-8 h-8" // Adjust size here
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <nav className="text-sm flex flex-col flex-1 overflow-y-auto">
                            <NavLink
                                to="/rtu/suppa/feedbacks"
                                className={`relative flex items-center px-6 sm:px-8 py-4 sm:py-6 text-white hover:bg-[#123A69] ${
                                    location.pathname === "/rtu/suppa/feedbacks"
                                        ? "bg-[#123A69]"
                                        : ""
                                }`}
                            >
                                <span
                                    className={`absolute left-0 h-full w-1.5 bg-[#FFDB75] ${
                                        location.pathname ===
                                        "/rtu/suppa/feedbacks"
                                            ? "opacity-100"
                                            : "opacity-0"
                                    }`}
                                ></span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    className="w-7 h-7 mr-1"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                                    />
                                </svg>
                                <span className="ml-4">View Feedbacks</span>
                            </NavLink>
                            <NavLink
                                to="/rtu/suppa/appointments"
                                className={`relative flex items-center px-6 sm:px-8 py-4 sm:py-6 text-white hover:bg-[#123A69] ${
                                    location.pathname ===
                                    "/rtu/suppa/appointments"
                                        ? "bg-[#123A69]"
                                        : ""
                                }`}
                            >
                                <span
                                    className={`absolute left-0 h-full w-1.5 bg-[#FFDB75] ${
                                        location.pathname ===
                                        "/rtu/suppa/appointments"
                                            ? "opacity-100"
                                            : "opacity-0"
                                    }`}
                                ></span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-7 h-7 mr-1"
                                >
                                    <path
                                        strokeLinecap="rosund"
                                        strokeLinejoin="round"
                                        d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
                                    />
                                </svg>
                                <span className="ml-4">Appointments</span>
                            </NavLink>
                            <NavLink
                                to="/rtu/suppa/offices"
                                className={`relative flex items-center px-6 sm:px-8 py-4 sm:py-6 text-white hover:bg-[#123A69] ${
                                    location.pathname === "/rtu/suppa/offices"
                                        ? "bg-[#123A69]"
                                        : ""
                                }`}
                            >
                                <span
                                    className={`absolute left-0 h-full w-1.5 bg-[#FFDB75] ${
                                        location.pathname ===
                                        "/rtu/suppa/offices"
                                            ? "opacity-100"
                                            : "opacity-0"
                                    }`}
                                ></span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    className="w-7 h-7 mr-1"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
                                    />
                                </svg>
                                <span className="ml-4">Manage Offices</span>
                            </NavLink>
                            <NavLink
                                to="/rtu/suppa/accounts"
                                className={`relative flex items-center px-6 sm:px-8 py-4 sm:py-6 text-white hover:bg-[#123A69] ${
                                    location.pathname === "/rtu/suppa/accounts"
                                        ? "bg-[#123A69]"
                                        : ""
                                }`}
                            >
                                <span
                                    className={`absolute left-0 h-full w-1.5 bg-[#FFDB75] ${
                                        location.pathname ===
                                        "/rtu/suppa/accounts"
                                            ? "opacity-100"
                                            : "opacity-0"
                                    }`}
                                ></span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    className="w-7 h-7 mr-1"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                                    />
                                </svg>
                                <span className="ml-4">Admin Accounts</span>
                            </NavLink>
                            <NavLink
                                to="/rtu/suppa/manage"
                                className={`relative flex items-center px-6 sm:px-8 py-4 sm:py-6 text-white hover:bg-[#123A69] ${
                                    location.pathname === "/rtu/suppa/manage"
                                        ? "bg-[#123A69]"
                                        : ""
                                }`}
                            >
                                <span
                                    className={`absolute left-0 h-full w-1.5 bg-[#FFDB75] ${
                                        location.pathname ===
                                        "/rtu/suppa/manage"
                                            ? "opacity-100"
                                            : "opacity-0"
                                    }`}
                                ></span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-7 h-7 mr-1"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                                    />
                                </svg>
                                <span className="ml-4">My Account</span>
                            </NavLink>
                        </nav>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1 bg-gray-50 p-6 sm:p-10 rounded-lg overflow-y-auto transition-all duration-300">
                        <Outlet />
                    </main>
                </div>

                {/* Footer */}
                <footer className="h-9 border-t text-center text-xs text-[#3c4043] flex items-center justify-center">
                    <p>
                        Copyright © 2024 - All rights reserved by Rizal
                        Technological University
                    </p>
                </footer>
            </div>
        </>
    );
}

export default SupAdminLayout;
