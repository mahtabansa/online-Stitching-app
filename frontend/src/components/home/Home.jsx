import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { CiSearch } from "react-icons/ci";
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from "react-toastify";
import custom_design from '../../media/custom_design.png'
import popularTailor from '../../media/popularTailor.png'
const Home = () => {
  const navigate = useNavigate();
  const [username,setUsername] = useState();
  
  return (
<>
  <div className="max-w-6xl mx-auto bg-[#FEFEFE]  sm:p-6 rounded-xl">
  <h2 className="w-full text-2xl font-semibold italic text-center  sm:text-left  mb-6 shadow-2xl ">
    Select Service
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-items-center mt-4">
    
    <Link
      to="/custom_design"
      className="w-full max-w-sm rounded-xl shadow-xl overflow-hidden hover:scale-105 transition-transform duration-300"
    >
      <img
        src={custom_design}
        alt="Custom Design"
        className="w-full h-auto object-cover rounded-xl"
      />
    </Link>

    <Link
      to="/popular_tailor"
      className="w-full max-w-sm rounded-xl shadow-xl overflow-hidden hover:scale-105 transition-transform duration-300"
    >
      <img
        src={popularTailor}
        alt="Popular Tailor"
        className="w-full h-auto object-cover rounded-xl"
      />
    </Link>

  </div>
</div>

<ToastContainer />
</>
  )

}

export default Home
