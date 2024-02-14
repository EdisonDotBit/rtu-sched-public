import React from 'react'
import SubNav from './Subcomponent/SubNav'
import Campus from './Subcomponent/Asset/RTU_Campus.jpg'

function SelectBranch() {
  return (
    <>
     <div className="">
        <div className="">
            <SubNav />
            <h1 className="flex justify-center text-[#194F90] text-[1.9rem] font-bold pb-[30px]">Select RTU Branch</h1>
        </div>
        <div className="flex justify-evenly p-[20px]">
            <div className="border-solid border-[1px] border-black rounded-lg hover:bg-[#d9d9d9]">
              <button className="flex flex-col p-[20px]">
                <img src={Campus} alt="" className="lex self-center rounded-2xl w-[300px] p-[10px]"/>
                <h2 className="text-[#194F90] text-[1.5rem] font-bold">Rizal Technological University - Boni</h2>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
              </button>
            </div>
            <div className="border-solid border-[1px] border-black rounded-lg hover:bg-[#d9d9d9]">
              <button className="flex flex-col p-[20px]">
                <img src={Campus} alt="" className="flex self-center rounded-2xl w-[300px] p-[10px]"/>
                <h2 className="text-[#194F90] text-[1.5rem] font-bold">Rizal Technological University - Pasig</h2>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
              </button>
            </div>
        </div>
     </div>
    </>

  )
}

export default SelectBranch