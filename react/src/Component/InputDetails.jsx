import React from "react";
import SubNav from "./Subcomponent/SubNav";
import Calendar from "./Subcomponent/Calendar";
import Purpose from "./Subcomponent/Purpose";

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
                        <div className="flex justify-center w-full">
                            <Purpose />
                        </div>
                        <div></div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default InputDetails;
