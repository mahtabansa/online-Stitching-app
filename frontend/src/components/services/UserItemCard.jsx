import React, { useState } from 'react'
import { setAddToCard } from '../../redux/userSlice.js'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
const UserItemCard = ({ item }) => {
   const [quantity,setQuantity] = useState(1);
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const handlebook = () => {
    const updatedItem = {
      ...item,quantity:quantity
    }
    dispatch(setAddToCard(updatedItem))
    navigate('/checkout')

  }

  
  const handleAdd = () => {
    const updatedItem = {
      ...item,quantity:quantity > 0 ? quantity : 1 
    }
    dispatch(setAddToCard(updatedItem))
    

  }

  return (


    <div className="w-[260px] h-100 bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden cursor-pointer">

      {/* Image */}
      <div className="h-[50%] bg-gray-100 flex items-center justify-center overflow-hidden">
        <img
          src={item?.image}
          alt={item?.name}
          className="h-full   hover:scale-105 transition duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">

        {/* Title */}
        <h2 className="text-sm font-semibold text-gray-800 line-clamp-2">
          <span className='text-medium font-semibold  '>Design</span>, {item?.name}
        </h2>

        {/* Price */}
        <p className="text-[#ff4d2d]">
          <span className='text-medium font-semibold  '>Price ,</span> ₹{item?.price}
        </p>

        {/* Description */}
        <p className="text-xs text-gray-500 line-clamp-2">
          {item?.description}
        </p>


        {/* Button */}

        <div className='w-full flex justify-between  gap-5'>
          <button className="w-1/3   mt-2 bg-[#ff4d2d] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#e04326] transition" onClick={handlebook}>
            Book Now
          </button>
          <button className="w-1/3 mt-2  bg-[#ff4d2d] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#e04326] transition" onClick={handleAdd}>
            Add Cart
          </button>
        </div>

      </div>
    </div>

  )

}

export default UserItemCard