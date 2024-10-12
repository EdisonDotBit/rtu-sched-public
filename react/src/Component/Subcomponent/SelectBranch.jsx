import React, { useState } from "react";
import Campus from "./Asset/RTU_Campus.jpg";
function SelectBranch({ formData, setFormData }) {
    const [branches, setBranch] = useState([
        {
            image: Campus,
            bname: "Boni",
            location: "Boni Avenue, Mandaluyong City, Metro Manila ",
        },
        {
            image: Campus,
            bname: "Pasig",
            location: "Eusebio, Pasig, Metro Manila",
        },
    ]);

    const [expanded, setExpanded] = useState(false);
    const handleBranchSelection = (selected) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            aptbranch: selected,
        }));
    };
    return (
        <div className="flex flex-wrap items-center justify-center h-{100} mb-5 gap-4">
            {branches.map((branchItem, index) => (
                <div
                    key={index}
                    className={`p-6 border border-gray-300 rounded-md shadow-md transition-transform hover:scale-105 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-[340px] mx-2 my-2 cursor-pointer h-auto ${
                        formData.aptbranch === branchItem.bname
                            ? "bg-blue-500"
                            : ""
                    }`}
                    onMouseEnter={() => setExpanded(true)}
                    onMouseLeave={() => setExpanded(false)}
                    onClick={() => handleBranchSelection(branchItem.bname)}
                >
                    <img
                        src={branchItem.image}
                        alt=""
                        className="flex self-center rounded-2xl w-[500px] p-[10px]"
                    />
                    <p className="text-xl text-center">
                        Rizal Technological University
                    </p>
                    <p className="text-xl text-center">{branchItem.bname}</p>
                    <p className="text-sm text-center line-clamp-1">
                        {branchItem.location}
                    </p>
                </div>
            ))}
        </div>
    );
}

export default SelectBranch;
