import React from "react";
import Purpose from "./Purpose";

function InputDetails({ formData, setFormData }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    return (
        <>
            <div className="w-full h-[500px] overflow-y-auto">
                <div className="flex flex-col justify-center">
                    <div>
                        <h1 className="flex justify-center text-2xl m underline">
                            Input Details
                        </h1>
                    </div>
                    <div className="flex flex-col justify-center">
                        <div className="flex justify-center items-center">
                            <Purpose
                                formData={formData}
                                setFormData={setFormData}
                            />
                        </div>
                        <div className="flex flex-col justify-center">
                            <h1 className="flex justify-center text-3xl mb-5">
                                Personal Details
                            </h1>
                            <div className="flex flex-col justify-center w-full items-center">
                                <div className="flex flex-col justify-center items-center w-3/4">
                                    <label
                                        htmlFor="text"
                                        className="mb-4 relative sm:flex sm:justify-center overflow-hidden sm:rounded-md border border-gray-200 px-3 pt-3 shadow-sm sm:focus-within:border-blue-600 sm:focus-within:ring-1 sm:focus-within:ring-blue-600 sm:w-2/3 md:w-8/12 lg:w-1/3"
                                    >
                                        <input
                                            name="studNum"
                                            value={formData.studNum}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="Student Number"
                                            className="mb-4peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                                        />

                                        <span className="absolute start-3 top-3 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs">
                                            Student Number
                                        </span>
                                    </label>
                                    <label
                                        htmlFor="text"
                                        className="mb-4 relative sm:flex sm:justify-center overflow-hidden sm:rounded-md border border-gray-200 px-3 pt-3 shadow-sm sm:focus-within:border-blue-600 sm:focus-within:ring-1 sm:focus-within:ring-blue-600 sm:w-2/3 md:w-8/12 lg:w-1/3"
                                    >
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="Full Name"
                                            className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                                        />

                                        <span className="absolute start-3 top-3 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs">
                                            Full Name
                                        </span>
                                    </label>
                                    <label
                                        htmlFor="text"
                                        className="mb-4 relative sm:flex sm:justify-center overflow-hidden sm:rounded-md border border-gray-200 px-3 pt-3 shadow-sm sm:focus-within:border-blue-600 sm:focus-within:ring-1 sm:focus-within:ring-blue-600 sm:w-2/3 md:w-8/12 lg:w-1/3"
                                    >
                                        <input
                                            name="pnumber"
                                            value={formData.pnumber}
                                            onChange={handleChange}
                                            type="tel"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            placeholder="Contact number"
                                            className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                                        />

                                        <span className="absolute start-3 top-3 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs">
                                            Contact Number
                                        </span>
                                    </label>
                                    <label
                                        htmlFor="text"
                                        className="mb-4 relative sm:flex sm:justify-center overflow-hidden sm:rounded-md border border-gray-200 px-3 pt-3 shadow-sm sm:focus-within:border-blue-600 sm:focus-within:ring-1 sm:focus-within:ring-blue-600 sm:w-2/3 md:w-8/12 lg:w-1/3"
                                    >
                                        <input
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="email"
                                            className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                                        />

                                        <span className="absolute start-3 top-3 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs">
                                            Institute Email
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default InputDetails;
