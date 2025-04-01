import React, { useState } from "react";
import BoniCampus from "./Asset/RTU_Campus.jpg";
import PasigCampus from "./Asset/RTU_Pasig.jpg";

function SelectBranch({ formData, setFormData, setBranchSelected }) {
    const [branches] = useState([
        {
            image: BoniCampus,
            bname: "Boni",
            location: "Boni Avenue, Mandaluyong City, Metro Manila",
        },
        {
            image: PasigCampus,
            bname: "Pasig",
            location: "Eusebio, Pasig, Metro Manila",
        },
    ]);

    const handleBranchSelection = (selected) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            aptbranch: selected,
        }));
        setBranchSelected(true);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {branches.map((branchItem, index) => (
                <div
                    key={index}
                    className={`relative overflow-hidden rounded-xl shadow-sm border transition-all duration-200 cursor-pointer ${
                        formData.aptbranch === branchItem.bname
                            ? "ring-2 ring-blue-500 border-blue-300"
                            : "border-gray-200 hover:border-blue-200"
                    }`}
                    onClick={() => handleBranchSelection(branchItem.bname)}
                >
                    <div className="relative h-48 overflow-hidden">
                        <img
                            src={branchItem.image}
                            alt={`RTU ${branchItem.bname} Campus`}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                        {formData.aptbranch === branchItem.bname && (
                            <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                                <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium absolute top-3 right-3">
                                    Selected
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-5 bg-white">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Rizal Technological University
                                </h3>
                                <h4 className="text-md font-medium text-blue-600">
                                    {branchItem.bname} Campus
                                </h4>
                            </div>
                            {formData.aptbranch === branchItem.bname ? (
                                <div className="bg-blue-100 text-blue-800 p-1 rounded-full">
                                    <svg
                                        className="w-5 h-5"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                            ) : (
                                <div className="border border-gray-300 rounded-full p-1">
                                    <div className="w-5 h-5"></div>
                                </div>
                            )}
                        </div>
                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                            {branchItem.location}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default SelectBranch;
