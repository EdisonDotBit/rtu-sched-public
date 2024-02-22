import React, { useState } from "react";
import Campus from "./Subcomponent/Asset/RTU_Campus.jpg";

function SelectBranch() {
    // State to store the selected branch
    const [branch, setBranch] = useState("");

    // Function to handle click event and update the selected branch
    const handleClick = (selectedBranch) => {
        setBranch(selectedBranch);
    };

    return (
        <>
            <div className="">
                <div className="">
                    <h1 className="flex justify-center text-[#194F90] text-[1.9rem] font-bold pb-[30px]">
                        Select RTU Branch
                    </h1>
                </div>
                <div className="flex justify-evenly m-5 p-[20px]">
                    <div
                        className="border-solid border-[1px] border-black rounded-lg hover:bg-[#d9d9d9]"
                        onClick={() => handleClick("Boni")} // Update branch to Boni on click
                    >
                        <button className="flex flex-col p-[20px]">
                            <img
                                src={Campus}
                                alt=""
                                className="lex self-center rounded-2xl w-[300px] p-[10px]"
                            />
                            <h2 className="text-[#194F90] text-[1.5rem] font-bold">
                                Rizal Technological University - Boni
                            </h2>
                            <p>
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit.
                            </p>
                        </button>
                    </div>
                    <div
                        className="border-solid border-[1px] border-black rounded-lg hover:bg-[#d9d9d9]"
                        onClick={() => handleClick("Pasig")} // Update branch to Pasig on click
                    >
                        <button className="flex flex-col p-[20px]">
                            <img
                                src={Campus}
                                alt=""
                                className="flex self-center rounded-2xl w-[300px] p-[10px]"
                            />
                            <h2 className="text-[#194F90] text-[1.5rem] font-bold">
                                Rizal Technological University - Pasig
                            </h2>
                            <p>
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit.
                            </p>
                        </button>
                    </div>
                </div>
                <div className="flex flex-col justify-center w-full items-center">
                    <button className="flex justify-center items-center bg-blue-500 text-white py-2 px-4 rounded-md w-96 ml-5">
                        Next &gt;
                    </button>
                </div>
            </div>
        </>
    );
}

export default SelectBranch;
