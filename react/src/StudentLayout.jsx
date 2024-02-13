import React from "react";
import Footer from "./component/subcomponent/footer";

function StudentLayout() {
    return (
        <>
            <div className="flex flex-col h-lvh">
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
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="w-12 h-12"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                />
                            </svg>
                            <span className="text-white font-bold uppercase mr-2">
                                STUDENT ACCOUNT
                            </span>
                        </div>
                        <div className="flex flex-col flex-1 overflow-y-auto">
                            <nav className="flex-1 bg-[#194F90]">
                                <a
                                    href="#"
                                    className="flex items-center px-4 py-6 text-white hover:text-white bg-[#123A69]"
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
                                            d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
                                        />
                                    </svg>
                                    Dashboard
                                </a>
                                <a
                                    href="#"
                                    className="flex items-center px-4 py-6 text-white hover:text-white hover:bg-[#123A69]"
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
                                </a>
                                <a
                                    href="#"
                                    className="flex items-center px-4 py-6 text-white hover:text-white hover:bg-[#123A69]"
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
                                </a>
                            </nav>
                        </div>
                    </div>

                    {/* Main content */}
                    <div className="flex flex-col flex-1 overflow-y-auto">
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
                                <img
                                    className="w-[200px]"
                                    src="./src/Component/Subcomponent/Asset/rtu-logo.png"
                                    alt=""
                                />
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
                        <div className="p-4 bg-white flex-1 rounded-lg m-4">
                            <div className="flex justify-between bg-[#194F90] text-white h-[50px] xl:text-xl sm:text-base">
                                <button className="bg-[#123A69] flex-1 hover:text-white hover:bg-[#123A69]">
                                    RTU Branch
                                </button>

                                <button className="hover:text-white flex-1 hover:bg-[#123A69]">
                                    Select Office
                                </button>

                                <button className="hover:text-white flex-1 hover:bg-[#123A69]">
                                    Purpose, Date & Time
                                </button>

                                <button className="hover:text-white flex-1 flex-1hover:bg-[#123A69]">
                                    Confirmation
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <footer className="footer flex text-center justify-center text-sm items-center h-12 border-t w-screen px-6 py-1">
                    <p>
                        {" "}
                        Copyright © 2024 - All right reserved by Rizal
                        Technological University
                    </p>
                </footer>
            </div>
        </>
    );
}

export default StudentLayout;
