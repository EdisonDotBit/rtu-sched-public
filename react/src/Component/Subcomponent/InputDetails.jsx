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
            <div className="w-full h-auto">
                <div className="flex flex-col justify-center">
                    <div>
                        <h1 className="flex justify-center text-2xl m underline">
                            Student Details
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
                                <div className="flex flex-col justify-center items-center xsm:w-full sm:w-3/4">
                                    <label className="m-3 input input-bordered flex items-center gap-2 bg-transparent text-gray-700 border-gray-400 xsm:text-xs sm:w-2/3 md:w-8/12 lg:w-1/2">
                                        Student Number:
                                        <input
                                            className="w- focus:border-blue-600 "
                                            name="aptstudnum"
                                            value={formData.aptstudnum}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="####-######"
                                            onInput={(e) => {
                                                e.target.value =
                                                    e.target.value.replace(
                                                        /[^0-9\-]/g,
                                                        ""
                                                    );
                                            }}
                                        />
                                    </label>
                                    <label className="m-3 input input-bordered flex items-center gap-2 bg-transparent text-gray-700 border-gray-400 xsm:text-xs  sm:w-2/3 md:w-8/12 lg:w-1/2">
                                        Full Name:
                                        <input
                                            className="w-2/3"
                                            name="aptname"
                                            value={formData.aptname}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="e.g. Juan A. Dela Cruz"
                                        />
                                    </label>
                                    <label className="m-3 input input-bordered flex items-center gap-2 bg-transparent text-gray-700 border-gray-400 xsm:text-xs  sm:w-2/3 md:w-8/12 lg:w-1/2
                                    ">
                                        Contact Number:
                                        <input
                                            name="aptpnumber"
                                            className="w-2/3"
                                            value={formData.aptpnumber}
                                            onChange={handleChange}
                                            type="tel"
                                            placeholder="09#########"
                                            onInput={(e) => {
                                                e.target.value =
                                                    e.target.value.replace(
                                                        /[^0-9/+]/g,
                                                        ""
                                                    );
                                            }}
                                        />
                                    </label>
                                    <label className="m-3 input input-bordered flex items-center gap-2 bg-transparent text-gray-700 border-gray-400 xsm:text-xs  sm:w-2/3 md:w-8/12 lg:w-1/2
                                    ">
                                        Institute Email:
                                        <input
                                            name="aptemail"
                                            className="w-2/3"
                                            value={formData.aptaptemail}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="email@gmail.com"
                                        />
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
