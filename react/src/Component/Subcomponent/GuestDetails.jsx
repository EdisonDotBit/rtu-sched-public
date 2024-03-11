import React from "react";
import Purpose from "./Purpose";

function GuestDetails({ formData, setFormData }) {
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
                            Guest Details
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
                                    <label className="m-3 input input-bordered flex items-center gap-2 bg-transparent text-gray-700 border-gray-200 sm:w-2/3 md:w-8/12 lg:w-1/3">
                                        Full Name :
                                        <input
                                            name="aptname"
                                            value={formData.aptname}
                                            onChange={handleChange}
                                            type="text"
                                            zx
                                            placeholder=""
                                        />
                                    </label>
                                    <label className="m-3 input input-bordered flex items-center gap-2 bg-transparent text-gray-700 border-gray-200 sm:w-2/3 md:w-8/12 lg:w-1/3">
                                        Contact Number :
                                        <input
                                            name="aptpnumber"
                                            value={formData.aptpnumber}
                                            onChange={handleChange}
                                            type="tel"
                                            placeholder="911"
                                        />
                                    </label>
                                    <label className="m-3 input input-bordered flex items-center gap-2 bg-transparent text-gray-700 border-gray-200 sm:w-2/3 md:w-8/12 lg:w-1/3">
                                        Institute Email :
                                        <input
                                            name="aptemail"
                                            value={formData.aptaptemail}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="pao.uwu@gmail.com"
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

export default GuestDetails;
