import React from "react";

function SubNav() {
    return (
        <>
            <div className="p-4 bg-white flex-1 rounded-lg m-4">
                <div className="flex justify-around bg-[#194F90] text-white h-[50px] xl:text-xl sm:text-base">
                    <button className="hover:text-white hover:bg-[#123A69] w-[300px]">
                        RTU Branch
                    </button>

                    <button className="hover:text-white hover:bg-[#123A69] w-[300px]">
                        Select Office
                    </button>

                    <button className="hover:text-white hover:bg-[#123A69] w-[300px]">
                        Input Details
                    </button>

                    <button className="hover:text-white hover:bg-[#123A69] w-[300px]">
                        Confirmation
                    </button>
                </div>
            </div>
        </>
    );
}

export default SubNav;
