import React from 'react'
import SubNav from './Subcomponent/SubNav'
import Campus from './Subcomponent/Asset/RTU_Campus.jpg'

function SelectOffice() {
  return (
    <>
        <div className=" border-solid h-screen overflow-hidden">
            <div className="flex flex-col ">
                <SubNav />
                <h1 className="flex justify-center text-[#194F90] text-[1.9rem] font-bold pb-[30px]">Select Office</h1>
                
                <div className="flex justify-evenly self-center flex-wrap gap-[20px] w-[1000px] h-[450px] overflow-auto">           
                  <div className="border-solid border-[1px] p-[20px] border-black rounded-lg hover:bg-[#d9d9d9] ">
                      <button className="flex flex-col  w-[250px]">
                        <img src={Campus} alt="" className="lex self-center rounded-2xl w-[200px] p-[5px]"/>
                        <h2 className="text-[#194F90] text-[1.2rem] font-bold">Management Information Center</h2>
                      </button>
                    </div>
                    <div className="border-solid border-[1px] p-[20px] border-black rounded-lg hover:bg-[#d9d9d9]">
                      <button className="flex flex-col  w-[250px]">
                        <img src={Campus} alt="" className="flex self-center rounded-2xl w-[200px] p-[5px]"/>
                        <h2 className="text-[#194F90] text-[1.2rem] font-bold">Management Information Center</h2>   
                      </button>
                    </div>
                    <div className="border-solid border-[1px] p-[20px] border-black rounded-lg hover:bg-[#d9d9d9]">
                      <button className="flex flex-col  w-[250px]">
                        <img src={Campus} alt="" className="flex self-center rounded-2xl w-[200px] p-[5px]"/>
                        <h2 className="text-[#194F90] text-[1.2rem] font-bold">Management Information Center</h2>   
                      </button>
                    </div>
                    <div className="border-solid border-[1px] p-[20px] border-black rounded-lg hover:bg-[#d9d9d9]">
                      <button className="flex flex-col  w-[250px]">
                        <img src={Campus} alt="" className="flex self-center rounded-2xl w-[200px] p-[5px]"/>
                        <h2 className="text-[#194F90] text-[1.2rem] font-bold">Management Information Center</h2>   
                      </button>
                    </div>
                    <div className="border-solid border-[1px] p-[20px] border-black rounded-lg hover:bg-[#d9d9d9]">
                      <button className="flex flex-col  w-[250px]">
                        <img src={Campus} alt="" className="flex self-center rounded-2xl w-[200px] p-[5px]"/>
                        <h2 className="text-[#194F90] text-[1.2rem] font-bold">Management Information Center</h2>   
                      </button>
                    </div>
                    <div className="border-solid border-[1px] p-[20px] border-black rounded-lg hover:bg-[#d9d9d9]">
                      <button className="flex flex-col  w-[250px]">
                        <img src={Campus} alt="" className="flex self-center rounded-2xl w-[200px] p-[5px]"/>
                        <h2 className="text-[#194F90] text-[1.2rem] font-bold">Management Information Center</h2>   
                      </button>
                    </div>
                  </div>  
            </div>
            
        </div>
    </>  
  )
}

export default SelectOffice