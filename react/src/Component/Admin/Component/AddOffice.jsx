import React, { useState } from "react";
import axios from "axios";

function AddOffice() {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const [formData, setFormData] = useState({
        offabbr: "",
        offname: "",
        offlimit: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const addoff = async (e) => {
        e.preventDefault(); // Prevent page reload
        console.log(formData); // Log the formData

        try {
            const res = await axios.post(
                `${apiBaseUrl}/api/office/add`,
                formData
            );

            if (res.data.status === "200") {
                console.log(res.data.message); // Log success message
                alert("Appointment deleted successfully.");
            } else {
                console.error("Failed to add office:", res.data.message); // Log error message
                alert("Failed to add office: res.data.message");
            }
        } catch (error) {
            console.error("Error adding office:", error); // Log any error that occurs during the request
        }
    };

    return (
        <>
            <div className="w-full h-[500px] overflow-y-auto">
                <div className="flex flex-col justify-center">
                    <div>
                        <h1 className="flex justify-center text-2xl m underline text-black">
                            Input Office Details
                        </h1>
                    </div>
                    <div className="flex flex-col justify-center">
                        <div className="flex justify-center items-center"></div>
                        <div className="flex flex-col justify-center">
                            <h1 className="flex justify-center text-3xl mb-5"></h1>
                            <div className="flex flex-col justify-center w-full items-center">
                                <div className="flex flex-col justify-center items-center w-3/4">
                                    <label className="m-3 input input-bordered flex items-center gap-2 bg-gray-200 text-black border-black sm:w-2/3 md:w-8/12 lg:w-1/3">
                                        Office Name :
                                        <input
                                            name="offname"
                                            value={formData.offname}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="Bakal Administration Office"
                                            className="grow"
                                        />
                                    </label>
                                    <label className="m-3 input input-bordered flex items-center gap-2 bg-gray-200 text-black border-black sm:w-2/3 md:w-8/12 lg:w-1/3">
                                        Office Abbreviation:
                                        <input
                                            name="offabbr"
                                            value={formData.offabbr}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="BAO"
                                            className="grow"
                                        />
                                    </label>
                                    <label className="m-3 focus:border-transparent input input-bordered flex items-center gap-2 bg-gray-200 text-black border-black sm:w-2/3 md:w-8/12 lg:w-1/3">
                                        Limit :
                                        <input
                                            name="offlimit"
                                            value={formData.offlimit}
                                            onChange={handleChange}
                                            onInput={(e) => {
                                                // Use onInput event to handle input
                                                e.target.value =
                                                    e.target.value.replace(
                                                        /[^0-9]/g,
                                                        ""
                                                    ); // Remove non-numeric characters
                                            }}
                                            type="text"
                                            placeholder="10"
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
                                            onClick={addoff}
                                        >
                                            Add Office
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

export default AddOffice;
