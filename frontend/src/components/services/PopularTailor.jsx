import React, { use, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../Navbar.jsx'
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PopularTailorCard from './PopularTailorCard.jsx';
const PopularTailor = () => {
  const navigate = useNavigate();
  const {shopsInMyCity,allShops} = useSelector((state) => state.user) || [];

  const shopData = shopsInMyCity?.shop?.length > 0 ? shopsInMyCity?.shop : allShops;

  return (
    <>
      <div className='p-5'>

        <div className='relative flex items-center justify-center py-5'>

          <span
            className='text-3xl text-gray-900 cursor-pointer'
            onClick={() => navigate(-1)}
          >
            <IoMdArrowBack />
          </span>

          <h1 className='text-lg md:text-3xl lg:text-3xl pl-2 font-semibold'>
           Stitch with your Favourite tailor
          </h1>

        </div>

        {/* Cards Container */}
        <div className="flex flex-col justify-center items-center gap-6">

          {
            shopData && shopData?.map((shop) => (
              <PopularTailorCard key={shop._id} shop={shop} />
            ))
          }
         
          {
            shopData.length === 0 && (
              <p className='text-center text-xl opacity-75 py-10 w-full'>
                No tailor found in your city
              </p>
            )
          }

        </div>

      </div>
    </>
  )
}

export default PopularTailor