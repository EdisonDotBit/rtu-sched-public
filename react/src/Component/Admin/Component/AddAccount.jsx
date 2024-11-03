import React, { useState } from "react";
import axios from "axios";

function AddAccount() {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const [formData, setFormData] = useState({
        admname: "",
        admempnum: "",
        admuser: "",
        admpass: "",
        admrole: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const createAcc = async (e) => {
        e.preventDefault();
        console.log(formData);

        try {
            const res = await axios.post(
                `${apiBaseUrl}/api/admin/add`,
                formData
            );

            if (res.status === 200) {
                alert(res.data.messages);
            }
        } catch (error) {
            alert(error.response.data.error);
        }
    };

    return (
        <>
            <div className="w-full h-[500px] overflow-y-auto">
                <div className="flex flex-col justify-center">
                    <div>
                        <h1 className="flex justify-center text-2xl underline text-black mb-6">
                            Add Account Form
                        </h1>
                        <h1 className="flex justify-center text-xl text-black">
                            Input Account Details
                        </h1>
                    </div>
                    <div className="flex flex-col justify-center">
                        <div className="flex justify-center items-center"></div>
                        <div className="flex flex-col justify-center">
                            <h1 className="flex justify-center text-3xl mb-5"></h1>
                            <div className="flex flex-col justify-center w-full items-center">
                                <div className="flex flex-col justify-center items-center w-3/4">
                                    <label className="m-3 input input-bordered flex items-center gap-2 bg-gray-200 text-black border-black sm:w-2/3 md:w-8/12 lg:w-1/3">
                                        Full Name :
                                        <input
                                            name="admname"
                                            value={formData.admname}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="Banaglorios Nga Pala"
                                            className="grow"
                                        />
                                    </label>
                                    <label className="m-3 input input-bordered flex items-center gap-2 bg-gray-200 text-black border-black sm:w-2/3 md:w-8/12 lg:w-1/3">
                                        Employee Number:
                                        <input
                                            name="admempnum"
                                            value={formData.admempnum}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="SA-D-B0-1"
                                            className="grow"
                                        />
                                    </label>
                                    <label className="m-3 focus:border-transparent input input-bordered flex items-center gap-2 bg-gray-200 text-black border-black sm:w-2/3 md:w-8/12 lg:w-1/3">
                                        Username :
                                        <input
                                            name="admuser"
                                            value={formData.admuser}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="mapagmahalzero2"
                                            className="grow focus:border-blue-400"
                                        />
                                    </label>
                                    <label className="m-3 focus:border-transparent input input-bordered flex items-center gap-2 bg-gray-200 text-black border-black sm:w-2/3 md:w-8/12 lg:w-1/3">
                                        Password :
                                        <input
                                            name="admpass"
                                            value={formData.admpass}
                                            onChange={handleChange}
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Bakal Pass"
                                            className="grow focus:border-blue-400"
                                        />
                                        <button
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                        >
                                            {showPassword ? "Hide" : "Show"}{" "}
                                        </button>
                                    </label>
                                    <label className="m-3 focus:border-transparent input input-bordered flex items-center gap-2 bg-gray-200 text-black border-black sm:w-2/3 md:w-8/12 lg:w-1/3">
                                        Select Role :
                                        <input
                                            name="admrole"
                                            value={formData.admrole}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="mapagmahalzero2"
                                            className="grow focus:border-blue-400"
                                        />
                                    </label>

                                    <div className="flex ">
                                        <a href="#main">
                                            <button className="btn btn-square bg-transparent text-black mr-5">
                                                Back
                                            </button>
                                        </a>
                                        <button
                                            type="button"
                                            className="btn btn-outline bg-yellow-500 text-black"
                                            onClick={createAcc}
                                        >
                                            Add Account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AddAccount;
