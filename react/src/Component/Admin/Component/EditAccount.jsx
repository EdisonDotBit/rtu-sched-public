import React, { useEffect, useState } from "react";
import axios from "axios";

function EditAccount({ selectedaccid }) {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const [formData, setFormData] = useState({});
    const [offData, setOffData] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [selectedOffice, setSelectedOffice] = useState("");

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

        if (formData.admrole === "") {
            alert("Please select an office.");
            return;
        }

        try {
            const res = await axios.put(
                `${apiBaseUrl}/api/admin/edit/${selectedaccid}`,
                formData
            );

            if (res.status === 200) {
                console.log(res.data.message); // Log success message
                alert("Admin edited successfully.");
                window.location.reload();
            }
        } catch (error) {
            alert(
                "Error editing admin. Please try again. Please double check the details"
            ); // Notify the user of the error
        }
    };

    useEffect(() => {
        const getAccountData = async () => {
            try {
                const getRes = await axios.get(
                    `${apiBaseUrl}/api/admin/info/${selectedaccid}`
                );
                const responseData = getRes.data.data; // Corrected response data access
                setFormData({
                    admuser: responseData.admuser,
                    admpass: responseData.admpass,
                    admname: responseData.admname,
                    admrole: responseData.admrole,
                    // admempnum: responseData.admempnum,
                });
                setSelectedOffice(responseData.admrole); // Preselect the current assigned office
            } catch (error) {
                console.error("Error fetching account data:", error); // Log the error if there's an issue with the request // Handle the error gracefully, such as showing an error message to the user
            }
        };
        const getOfficesData = async () => {
            try {
                const getRes = await axios.get(`${apiBaseUrl}/api/office/all`);
                setOffData(getRes.data);
            } catch (error) {
                console.error("Error fetching office data:", error); // Log the error if there's an issue with the request // Handle the error gracefully, such as showing an error message to the user
            }
        };

        // Ensure selectedaccid has a value before fetching data
        if (selectedaccid) {
            getAccountData();
            getOfficesData();
        }
    }, [selectedaccid]); // Add selectedaccid as a dependency

    return (
        <>
            <div className="w-full h-[500px] flex justify-center">
                <div className="w-full md:w-3/4 lg:w-[50%] border border-gray-300 bg-[#194F90] rounded-md shadow-md px-8 py-2">
                    <div className="flex flex-col space-y-4">
                        <div className="flex flex-col space-y-4">
                            <h2 className="text-white text-xl font-semibold text-center mt-4">
                                Edit Admin Account
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
                                />
                            </label>
                            {/* Employee Number */}
                            {/* <label className="block text-white">
                                Employee Number
                                <input
                                    className="text-gray-500 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75]"
                                    name="admempnum"
                                    value={formData.admempnum}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="SA-D-B0-1"
                                />
                            </label> */}
                            {/* Username */}
                            <label className="block text-white">
                                Username:
                                <input
                                    className="text-gray-500 bg-white w-full mt-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75]"
                                    name="admuser"
                                    value={formData.admuser}
                                    onChange={handleChange}
                                    type="text"
                                    disabled
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
                            {/* Assigned Office */}
                            <label className="block text-white">
                                Assigned Office:
                                <select
                                    className="text-gray-800 bg-white w-full mt-1 py-2 px-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDB75]"
                                    name="admrole"
                                    value={selectedOffice}
                                    onChange={(e) => {
                                        handleChange(e);
                                        setSelectedOffice(e.target.value);
                                    }}
                                >
                                    <option value="" disabled>
                                        --Select Office--
                                    </option>
                                    {offData.map((option) => (
                                        <option
                                            key={option.offid}
                                            value={option.offabbr}
                                        >
                                            {option.offabbr}
                                        </option>
                                    ))}{" "}
                                </select>{" "}
                            </label>
                            <div className="flex justify-center gap-6">
                                <a href="#main">
                                    <button className="btn btn-outline px-6 text-[#194F90] bg-[#FFDB75] hover:bg-[#f3cd64] hover:text-[#194F90] mt-2">
                                        Back
                                    </button>
                                </a>
                                <button
                                    type="button"
                                    className="btn btn-outline px-6 text-[#194F90] bg-[#FFDB75] hover:bg-[#f3cd64] hover:text-[#194F90] mt-2"
                                    onClick={editAcc}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EditAccount;
