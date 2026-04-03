import React from 'react'
import Navbar from '../../Navbar.jsx'
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const CustomDesign = () => {
  const navigate = useNavigate();
  return (
    <><Navbar />
      <div className='flex flex-col items-center gap-2 p-5'>

        <div className='text-2xl font-semibold flex flex-row'>

          <span className='text-[#B07A5A] px-3 '>
            <span className='text-gray-800 cursor-pointer ' onClick={()=>navigate(-1)}><IoMdArrowBack />  Top </span> Designs</span>
        </div>


        <div>legha kurta</div>
        <div>suit salwar </div>
        <div>anar kali</div>
        <div>uniform</div>
        <div>festival clothes</div>
        <div>wedding haldi ceremony</div>
      </div>
    </>
  )
}

export default CustomDesign