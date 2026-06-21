import React from 'react'
import Navbar from '../../Navbar'
import { IoArrowBack } from "react-icons/io5";
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
const TrackOrder = () => {
  const { Myorder } = useSelector((state) => state.user);
  const { id } = useParams();

  const order = Myorder.orders[0].find(order => order._id === id);
  console.log('order', order);
  return (

    <>
      <Navbar />


      <div className=' flex flex-col items-center h-full gap-5 p-5'>


        <h1 className='flex items-center text-lg font-semibold text-gray-800'>  <button className='text-gray-700 text-2xl' onClick={() => window.history.back()}><IoArrowBack /></button>  <button className='px-5'>Track Order</button></h1>


        <div
          className="h-[200px] w-full bg-gray-200 sm:p-5 sm:m-5 md:w-[400px] lg:w-[400px] 
            border border-gray-200 rounded-lg p-4 flex flex-col hover:shadow-md transition ">

          <div className="w-full flex  bg-gray-200  rounded-lg">

            <div className="w-1/2 ">
              <img src={"https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="item" className="w-full  rounded-lg" />
            </div>

          </div>

        </div>
      </div>

    </>

  )
}

export default TrackOrder