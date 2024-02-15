import React from "react";
import SubNav from "./Subcomponent/SubNav";
import Calendar from "./Subcomponent/Calendar";
import Purpose from "./Subcomponent/Purpose";
import FormDetails from "./Subcomponent/FormDetails";

function InputDetails() {
    return (
        <>
            <div className="w-full">
                <div>
                    <SubNav />
                </div>
                <div className="flex flex-col justify-center">
                    <div>
                        <h1 className="flex justify-center text-2xl m underline">
                            Input Details
                        </h1>
                    </div>
                    <div className="flex flex-col justify-center">
                        <div className="flex justify-center text-xl py-5">
                            Select Date
                        </div>
                        <div>
                            <Calendar />
                        </div>
                        <div className="flex justify-center items-center">
                            <Purpose />
                        </div>
                        <div className="flex flex-col justify-center">
                            <h1 className="flex justify-center text-3xl mb-5">
                                Personal Details
                            </h1>
                            <div className="flex flex-col justify-center w-full items-center">
                                <FormDetails />
                            </div>
                        </div>
                        <div className="flex flex-col justify-center w-full items-center">
                            <button className="flex justify-center items-center bg-blue-500 text-white py-2 px-4 rounded-md w-96 ml-5">
                                Next &gt;
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default InputDetails;
