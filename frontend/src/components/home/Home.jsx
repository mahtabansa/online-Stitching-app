import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { CiSearch } from "react-icons/ci";
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from "react-toastify";
const Home = () => {
  const navigate = useNavigate();
  const [username,setUsername] = useState();
  

  return (
<>
    <div className='bg-[#FEFEFE] m-4 p-4 gap-4'>
      <h2 className='font-semibold text-xl italic py-4 px-4 items-center'>Select Service</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 p-2 gap-5 sm:p-5 '>

        <div className='rounded-lg shadow-xl' style={{ width: "80%" }}>
          <Link to='/custom_design'>

            <img src="media\custom_design.png" alt="custom design"
              className=' rounded-lg ' />
          </Link>
        </div>

        <div className='rounded-lg shadow-xl ' style={{ width: "80%" }}>
          <Link to='/popular_tailor'>
            <img src="media\popularTailor.png" alt="custom design"
              className=' rounded-lg' />
          </Link>
        </div>


      </div>
    </div>
    <ToastContainer />
</>
  )

}

export default Home
