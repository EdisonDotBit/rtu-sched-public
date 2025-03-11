import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../Hooks/useAuth";

function AddAccount({ setShowAdd }) {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const { branch } = useAuth();
    const [formData, setFormData] = useState({
        admname: "",
        admuser: "",
        admpass: "",
        admrole: "",
        admbranch: branch,
    });

    const [offData, setoffData] = useState([]);

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
                setShowAdd(false);
                window.location.reload();
            }
        } catch (error) {
            alert(error.response.data.error);
        }
    };

    useEffect(() => {
        const getData = async () => {
            const getRes = await fetch(
                `${apiBaseUrl}/api/office/bybranch/${branch}`
            );
            const getDataResult = await getRes.json();
            setoffData(getDataResult);
        };
        getData();
    }, [branch]);

    return (
        <>
            <div className="w-full h-[500px] flex justify-center">
                <div className="w-full md:w-3/4 lg:w-[50%] border border-gray-300 bg-[#194F90] rounded-md shadow-md px-8 py-2">
                    <div className="flex flex-col space-y-4">
                        <div className="flex flex-col space-y-4">
                            <h2 className="text-white text-xl font-semibold text-center mt-4">
                                Add Admin Account
                            </h2>
                            {/* Full Name */}
                            <label className="block text-white">
                                Admin Name:
                                <input
                                    className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75]"
                                    name="admname"
                                    value={formData.admname}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="Enter Admin Name"
                                />
                            </label>

                            {/* Username */}
                            <label className="block text-white">
                                Username:
                                <input
                                    className="text-gray-800 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75]"
                                    name="admuser"
                                    value={formData.admuser}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="Enter Username"
                                />
                            </label>
                            {/* Password */}
                            <div className="relative w-full">
                                <label className="block text-white">
                                    Password:
                                    <div className="relative">
                                        <input
                                            name="admpass"
                                            value={formData.admpass}
                                            onChange={handleChange}
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            } // Toggle between text and password type
                                            placeholder="Enter Password"
                                            className="text-gray-800 bg-white w-full mt-1 py-2 px-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                        >
                                            {showPassword ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                </label>
                            </div>

                            {/* Assign Office */}
                            <label className="block text-white">
                                Assign Office:
                                {/* Assuming this is a dropdown */}
                                <select
                                    placeholder="Enter Password"
                                    className="text-gray-800 bg-white w-full mt-1 py-2 px-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75]"
                                    value={formData.admrole}
                                    onChange={handleChange}
                                    name="admrole"
                                >
                                    <option value="" disabled>
                                        --Select Office--
                                    </option>
                                    {[
                                        ...new Map(
                                            offData.map((item) => [
                                                item.offabbr,
                                                item,
                                            ])
                                        ).values(),
                                    ].map((option) => (
                                        <option
                                            key={option.offid}
                                            value={option.offabbr}
                                        >
                                            {option.offabbr}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <div className="flex justify-center gap-6">
                                <button
                                    className="btn bg-[#FFDB75] text-[#194F90] font-semibold  hover:bg-[#f3cd64] hover:text-[#194F90] rounded-md px-6 py-2"
                                    onClick={() => setShowAdd(false)}
                                >
                                    Back
                                </button>

                                <button
                                    type="button"
                                    className="btn bg-[#FFDB75] text-[#194F90] font-semibold  hover:bg-[#f3cd64] hover:text-[#194F90] rounded-md px-6 py-2"
                                    onClick={createAcc}
                                >
                                    Add Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AddAccount;
