import React from 'react'
import SubNav from './Subcomponent/SubNav'
import Campus from './Subcomponent/Asset/RTU_Campus.jpg'

function SelectOffice() {
  return (
    <>
        <div >
            <div className="">
                <SubNav />
                <h1 className="flex justify-center text-[#194F90] text-[1.9rem] font-bold pb-[30px]">Select Office</h1>
            </div>
            <div className="flex justify-evenly flex-wrap overflow-auto"> 
              <div className="border-solid border-[1px] border-black rounded-lg hover:bg-[#d9d9d9] ">
                  <button className="flex flex-col p-[20px] w-[250px]">
                    <img src={Campus} alt="" className="lex self-center rounded-2xl w-[300px] p-[10px]"/>
                    <h2 className="text-[#194F90] text-[1.5rem] font-bold">Management Information Center</h2>
                    
                  </button>
                </div>
                <div className="border-solid border-[1px] border-black rounded-lg hover:bg-[#d9d9d9]">
                  <button className="flex flex-col p-[20px] w-[250px]">
                    <img src={Campus} alt="" className="flex self-center rounded-2xl w-[300px] p-[10px]"/>
                    <h2 className="text-[#194F90] text-[1.5rem] font-bold">Management Information Center</h2>   
                  </button>
                </div>
                <div className="border-solid border-[1px] border-black rounded-lg hover:bg-[#d9d9d9]">
                  <button className="flex flex-col p-[20px] w-[250px]">
                    <img src={Campus} alt="" className="flex self-center rounded-2xl w-[300px] p-[10px]"/>
                    <h2 className="text-[#194F90] text-[1.5rem] font-bold">Management Information Center</h2>   
                  </button>
                </div>
                <div className="border-solid border-[1px] border-black rounded-lg hover:bg-[#d9d9d9]">
                  <button className="flex flex-col p-[20px] w-[250px]">
                    <img src={Campus} alt="" className="flex self-center rounded-2xl w-[300px] p-[10px]"/>
                    <h2 className="text-[#194F90] text-[1.5rem] font-bold">Management Information Center</h2>   
                  </button>
                </div>
                <div className="border-solid border-[1px] border-black rounded-lg hover:bg-[#d9d9d9]">
                  <button className="flex flex-col p-[20px] w-[250px]">
                    <img src={Campus} alt="" className="flex self-center rounded-2xl w-[300px] p-[10px]"/>
                    <h2 className="text-[#194F90] text-[1.5rem] font-bold">Management Information Center</h2>   
                  </button>
                </div>
                <div className="border-solid border-[1px] border-black rounded-lg hover:bg-[#d9d9d9]">
                  <button className="flex flex-col p-[20px] w-[250px]">
                    <img src={Campus} alt="" className="flex self-center rounded-2xl w-[300px] p-[10px]"/>
                    <h2 className="text-[#194F90] text-[1.5rem] font-bold">Management Information Center</h2>   
                  </button>
                </div>
              </div>  
        </div>
    </>  
  )
}

export default SelectOffice