import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import Logo from "../Component/Subcomponent/Asset/rtu_logo_v3.png";

function GuestLayout() {
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
        const modalShown = sessionStorage.getItem("modalShown");

        // If it's the first visit, show the modal
        if (!modalShown) {
            openModal();
            sessionStorage.setItem("modalShown", "true"); // Mark that the modal has been shown
        }
    }, []);

    return (
        <>
            <div className="flex flex-col h-screen overflow-hidden font-roboto">
                {/* Header */}
                <header className="flex items-center justify-between bg-[#FFDB75] px-6 py-2 sm:h-16 lg:h-16">
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
                            <NavLink to="../guest">
                                <img
                                    className="h-auto w-[200px] lg:w-56"
                                    src={Logo}
                                    alt="University Logo"
                                />
                            </NavLink>
                        </div>
                    </div>
                    <div className="flex items-center pr-4">
                        <NavLink to="../student">
                            <button className="text-sm text-gray-500 hover:text-[#123A69]">
                                Change to Student
                            </button>
                        </NavLink>
                    </div>
                </header>

                {/* Main Content */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar */}
                    <aside
                        className={`fixed inset-y-0 left-0 z-30 w-72 md:w-72 bg-[#194F90] transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
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
                                    GUEST
                                </span>
                            </div>
                            <button
                                className="text-white lg:hidden"
                                onClick={toggleSidebar}
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
                        <nav className="flex flex-col flex-1 overflow-y-auto">
                            <NavLink
                                to="/guest/set-appointment"
                                className={`relative flex items-center px-6 sm:px-8 py-4 sm:py-6 text-white hover:bg-[#123A69] ${
                                    location.pathname ===
                                    "/guest/set-appointment"
                                        ? "bg-[#123A69]"
                                        : ""
                                }`}
                            >
                                <span
                                    className={`absolute left-0 h-full w-1.5 bg-[#FFDB75] ${
                                        location.pathname ===
                                        "/guest/set-appointment"
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
                                    className="w-8 h-8 mr-1"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
                                    />
                                </svg>
                                <span className="ml-3">Set Appointment</span>
                            </NavLink>
                            <NavLink
                                to="/guest/view-appointment"
                                className={`relative flex items-center px-6 sm:px-8 py-4 sm:py-6 text-white hover:bg-[#123A69] ${
                                    location.pathname ===
                                    "/guest/view-appointment"
                                        ? "bg-[#123A69]"
                                        : ""
                                }`}
                            >
                                <span
                                    className={`absolute left-0 h-full w-1.5 bg-[#FFDB75] ${
                                        location.pathname ===
                                        "/guest/view-appointment"
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
                                    className="w-8 h-8 mr-1"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"
                                    />
                                </svg>
                                <span className="ml-3">View Appointment</span>
                            </NavLink>
                        </nav>

                        {/* Spacer to push Send Feedback to the bottom */}
                        <div className="flex-grow"></div>

                        {/* Send Feedback Link moved here */}
                        <NavLink
                            to="/feedback"
                            className="text-center mb-6 text-sm underline text-blue-200"
                            onClick={(e) => {
                                e.preventDefault(); // Prevents default navigation
                                window.open("/feedback", "_blank"); // Opens the link in a new tab
                            }}
                        >
                            Send Feedback
                        </NavLink>
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

                {/* Modal */}
                <dialog
                    ref={modals}
                    className="modal"
                    onKeyDown={(event) => {
                        if (event.key === "Escape") {
                            event.preventDefault();
                        }
                    }}
                >
                    <div className="modal-box flex flex-col justify-center items-center text-white bg-[#194F90]">
                        <h3 className="font-bold text-lg">
                            Welcome to Rizal Technological University!
                        </h3>
                        <p>
                            **For New Student and Alumni, please select Guest**
                        </p>
                        <div className="modal-action">
                            <button
                                type="button"
                                className="btn btn-outline text-white hover:bg-white hover:text-[#194F90]"
                                onClick={() => {
                                    modals.current.close();
                                }}
                            >
                                Guest
                            </button>
                            <NavLink to="../student">
                                <button
                                    type="button"
                                    className="btn btn-outline text-white hover:bg-white hover:text-[#194F90]"
                                    onClick={() => {
                                        modals.current.close();
                                    }}
                                >
                                    Student
                                </button>
                            </NavLink>
                        </div>
                    </div>
                </dialog>
            </div>
        </>
    );
}

export default GuestLayout;
