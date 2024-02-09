import React from "react";

function Header() {
    return (
        <header className="bg-white w-screen">
            <div className="mx-auto">
                <div className="flex h-18 items-center justify-between border-b-2 px-6 py-1">
                    <div className="md:flex md:items-center md:gap-12">
                        <a className="block text-[#194F90]" href="/">
                            <img
                                src=".\src\Component\Subcomponent\Asset\rtu-logo.png"
                                className="max-w-none h-auto w-[300px]"
                                alt=""
                            />
                        </a>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="sm:flex sm:gap-4 text-[#194F90]">
                            <a href="">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    class="w-12 h-10"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                                    />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
