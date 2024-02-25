import React, { useState } from "react";
import Campus from "./Subcomponent/Asset/RTU_Campus.jpg";
function SelectBranch({ selectedBranch, setSelectedBranch }) {
    const [branches, setBranch] = useState([
        {
            image: Campus,
            bname: "Boni",
            location: "Boni ",
        },
        {
            image: Campus,
            bname: "Pasig",
            location: "Pasig ",
        },
    ]);

    const [expanded, setExpanded] = useState(false);
    const handleBranchSelection = (selected) => {
        setSelectedBranch(selected);
    };
    return (
        <div className="flex flex-wrap items-center justify-center h-64">
            {branches.map((branchItem, index) => (
                <div
                    key={index}
                    className={`p-6 border border-gray-300 rounded-md shadow-md transition-transform hover:scale-105 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 mx-2 my-2 cursor-pointer ${
                        selectedBranch === branchItem.bname ? "bg-blue-500" : ""
                    }`}
                    onMouseEnter={() => setExpanded(true)}
                    onMouseLeave={() => setExpanded(false)}
                    onClick={() => handleBranchSelection(branchItem.location)}
                >
                    <img
                        src={branchItem.image}
                        alt=""
                        className="flex self-center rounded-2xl w-[500px] p-[10px]"
                    />
                    <p className="text-xl text-center">{branchItem.bname}</p>
                    <p className="text-sm text-center">{branchItem.location}</p>
                </div>
            ))}
        </div>
    );
}

export default SelectBranch;
