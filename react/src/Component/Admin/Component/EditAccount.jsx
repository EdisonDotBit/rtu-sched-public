import React, { useEffect, useState } from "react";
import axios from "axios";

function EditAccount({ selectedaccid }) {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const [formData, setFormData] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    const editAcc = async (e) => {
        e.preventDefault(); // Prevent page reload
        console.log(formData); // Log the formData

        try {
            const res = await axios.put(
                `${apiBaseUrl}/api/admin/edit/${selectedaccid}`,
                formData
            );

            if (res.status === 200) {
                console.log(res.data.message); // Log success message
                alert("Admin edited successfully.");
            }
        } catch (error) {
            alert(
                "Error editing admin. Please try again. Please double check the details"
            ); // Notify the user of the error
        }
    };

    useEffect(() => {
        const getData = async () => {
            try {
                const getRes = await axios.get(
                    `${apiBaseUrl}/api/admin/info/${selectedaccid}`
                );
                const responseData = getRes.data.data; // Corrected response data access
                setFormData({
                    admuser: responseData.admuser,
                    admpass: responseData.admpass,
                    admname: responseData.admname,
                    // admempnum: responseData.admempnum,
                });
            } catch (error) {
                console.error("Error fetching office data:", error); // Log the error if there's an issue with the request
                // Handle the error gracefully, such as showing an error message to the user
            }
        };

        // Ensure selectedaccid has a value before fetching data
        if (selectedaccid) {
            getData();
        }
    }, [selectedaccid]); // Add selectedaccid as a dependency

    return (
        <>
            <div className="w-full h-[500px] overflow-y-auto">
                <div className="flex flex-col justify-center">
                    <div>
                        <h1 className="flex justify-center text-2xl underline text-black mb-6">
                            Edit Account Form
                        </h1>
                        <h1 className="flex justify-center text-xl text-black">
                            Update Account Details {selectedaccid}
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
                                    {/* <label className="m-3 input input-bordered flex items-center gap-2 bg-gray-200 text-black border-black sm:w-2/3 md:w-8/12 lg:w-1/3">
                                        Employee Number:
                                        <input
                                            name="admempnum"
                                            value={formData.admempnum}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="SA-D-B0-1"
                                            className="grow"
                                        />
                                    </label> */}
                                    <label className="m-3 focus:border-transparent input input-bordered flex items-center gap-2 bg-gray-200 text-black border-black sm:w-2/3 md:w-8/12 lg:w-1/3">
                                        Username :
                                        <input
                                            name="admuser"
                                            value={formData.admuser}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="mapagmahalzero2"
                                            className="grow focus:border-blue-400 text-gray-400"
                                            disabled
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
                                            } // Toggle between text and password type
                                            placeholder="Bakal Pass"
                                            className="grow focus:border-blue-400"
                                        />
                                        <button
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                        >
                                            {showPassword ? "Hide" : "Show"}{" "}
                                            {/* Toggle between "Hide" and "Show" */}
                                        </button>
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
                                            onClick={editAcc}
                                        >
                                            Edit Account
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

export default EditAccount;
