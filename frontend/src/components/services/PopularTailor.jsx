import React, { use } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../Navbar.jsx'
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PopularTailorCard from './PopularTailorCard.jsx';
const PopularTailor = () => {
  const navigate = useNavigate();
  const shopData = useSelector((state) => state.user.shopsInMyCity) || [];
  console.log("shopData", shopData);

  return (
    <>
      <Navbar />

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
            shopData && shopData?.shop?.map((shop) => (
              <PopularTailorCard key={shop._id} shop={shop} />
            ))
          }

          {
            shopData.length === 0 && (
              <p className='text-center text-xl opacity-75 py-10 w-full'>
                No popular tailor found in your city
              </p>
            )
          }

        </div>

      </div>
    </>
  )
}

export default PopularTailor