import React from 'react'
import Navbar from '../../Navbar.jsx'
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UserItemCard from './UserItemCard.jsx';

const CustomDesign = () => {
  const navigate = useNavigate();
  const {ItemsInMyCity} = useSelector((state)=>state.user);
  console.log("ItemsInMyCity",ItemsInMyCity);
  return (
    <><Navbar />
   <div className='p-5'>

        <div className='relative flex items-center justify-center py-5'>

          <span
            className='text-3xl text-gray-900 cursor-pointer'
            onClick={() => navigate(-1)}
          >
            <IoMdArrowBack />
          </span>


          <h1 className='text-3xl px-5 font-semibold'>
            Popular Tailor
          </h1>

        </div>

        {/* Cards Container */}
        <div className="flex flex-wrap justify-center items-center gap-6">

          {
            ItemsInMyCity && ItemsInMyCity?.map((shop) => (
              <UserItemCard key={shop._id} item={shop} />
            ))
          }

          {
            ItemsInMyCity?.length === 0 && (
              <p className='text-center text-xl opacity-75 py-10 w-full'>
                No tailor found in your city ,we are working to provide services
              </p>
            )
          }

        </div>

      </div>
    </>
  )
}

export default CustomDesign