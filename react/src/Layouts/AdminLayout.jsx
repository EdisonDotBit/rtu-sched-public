import React, { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import Logo from "../Component/Subcomponent/Asset/rtu_logo_v3.png";
import { useAuth } from "../Hooks/useAuth";

function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const { logout } = useAuth();

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const handleLogout = () => logout();

    const navItems = [
        {
            path: "/rtu/admin/dashboard",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z"
                    />
                </svg>
            ),
            label: "Dashboard",
        },
        {
            path: "/rtu/admin/appointments",
            icon: (
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
                        d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
                    />
                </svg>
            ),
            label: "Appointments",
        },
        {
            path: "/rtu/admin/office",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
                    />
                </svg>
            ),
            label: "Office",
        },
        {
            path: "/rtu/admin/feedback",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                    />
                </svg>
            ),
            label: "Feedbacks",
        },
        {
            path: "/rtu/admin/manage",
            icon: (
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
            ),
            label: "My Account",
        },
    ];

    return (
        <div className="font-poppins flex flex-col h-screen overflow-hidden w-full bg-gray-50">
            {/* Header */}
            <header className="flex items-center justify-between bg-[#FFDB75] px-4 sm:px-6 py-2 h-14 sm:h-16 shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        className="text-gray-700 focus:outline-none hover:text-[#123A69] transition-colors lg:hidden"
                        onClick={toggleSidebar}
                        aria-label="Toggle sidebar"
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
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                    <NavLink
                        to="/rtu/admin/dashboard"
                        className="flex items-center transition-transform hover:scale-[1.02] focus:outline-none"
                        aria-label="Dashboard"
                    >
                        <img
                            className="h-auto w-32 sm:w-36 md:w-40"
                            src={Logo}
                            alt="University Logo"
                        />
                    </NavLink>
                </div>
                <button
                    className="cursor-pointer flex items-center text-gray-700 hover:text-[#123A69] focus:outline-none transition-colors group"
                    onClick={handleLogout}
                    aria-label="Logout"
                >
                    <div className="flex items-center gap-2">
                        <span className="hidden md:inline text-sm font-medium group-hover:text-[#123A69]">
                            Logout
                        </span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6 transition-transform group-hover:translate-x-0.5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                            />
                        </svg>
                    </div>
                </button>
            </header>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside
                    className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#194F90] shadow-xl transform transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 ${
                        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } flex flex-col`}
                >
                    <div className="flex items-center justify-between h-20 bg-[#194F90] text-white px-6 py-4 border-b border-[#2a5fa3]">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#FFDB75] p-2 rounded-full">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="#194F90"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                    />
                                </svg>
                            </div>
                            <span className="text-lg font-bold uppercase truncate">
                                {localStorage
                                    .getItem("role")
                                    ?.replace(/['"]+/g, "") || "Admin"}
                            </span>
                        </div>
                        <button
                            className="text-white hover:text-[#FFDB75] lg:hidden transition-colors"
                            onClick={toggleSidebar}
                            aria-label="Close sidebar"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                    <nav className="flex flex-col flex-1 overflow-y-auto">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `relative flex items-center px-6 py-4 text-white hover:bg-[#123A69] transition-colors ${
                                        isActive ? "bg-[#123A69]" : ""
                                    }`
                                }
                                end
                                aria-current={
                                    location.pathname === item.path
                                        ? "page"
                                        : undefined
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <span
                                            className={`absolute left-0 h-full w-1.5 bg-[#FFDB75] transition-opacity ${
                                                isActive
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            }`}
                                        ></span>
                                        <span className="mr-4">
                                            {item.icon}
                                        </span>
                                        <span className="text-sm font-medium">
                                            {item.label}
                                        </span>
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 bg-gray-50 p-4 sm:p-6 md:p-8 overflow-y-auto scroll-smooth">
                    <Outlet />
                </main>
            </div>

            {/* Footer */}
            <footer className="bg-white h-10 border-t border-gray-200 text-center text-xs text-gray-600 flex items-center justify-center">
                <p>Copyright © 2024 - All rights reserved by RTU</p>
            </footer>
        </div>
    );
}

export default AdminLayout;
