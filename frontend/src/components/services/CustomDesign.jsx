import React from 'react'
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UserItemCard from './UserItemCard.jsx';
import Loader from '../../pages/Loader.jsx'

const CustomDesign = () => {
  const navigate = useNavigate();
  const { ItemsInMyCity ,itemsLoading} = useSelector((state) => state.user);

  return (
    <>
      <div className='flex-1 p-5'>

        <div className='relative flex items-center justify-center py-5'>

          <span
            className='text-3xl text-gray-900 cursor-pointer'
            onClick={() => navigate("/")}
          >
            <IoMdArrowBack />
          </span>


          <h1 className='text-2xl lg:text-3xl md:lg:text-3xl px-5 font-semibold'>
            Trending & New  Design
          </h1>

        </div>

        {/* Cards Container */}

        <div className="flex flex-wrap justify-center items-center gap-6 min-h-[400px]">

          {itemsLoading ? (
            <div className="w-full flex justify-center items-center">
              <Loader />
            </div>
          ) : ItemsInMyCity?.length > 0 ? (
            ItemsInMyCity.map((shop) => (
              <UserItemCard key={shop._id} item={shop} />
            ))
          ) : (
            <p className="text-center text-xl opacity-75 py-10 w-full">
              No tailor found in your city, we are working to provide services.
            </p>
          )}

        </div>

      </div>
    </>
  )
}

export default CustomDesign