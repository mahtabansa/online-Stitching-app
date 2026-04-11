import React from 'react'
import {setAddToCard} from '../../redux/userSlice.js'
import { useNavigate } from 'react-router-dom';
import {useDispatch} from 'react-redux';
const UserItemCard = ({ item }) => {
const dispatch = useDispatch()
const navigate = useNavigate();
   const handlebook = ()=>{
    dispatch(setAddToCard([...item]))
    navigate('/my-cart')
    
  
   }
  return (


    <div className="w-[260px] bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden cursor-pointer">

  {/* Image */}
  <div className="w-full h-52 bg-gray-100 flex items-center justify-center overflow-hidden">
    <img
      src={item?.image}
      alt={item?.name}
      className="h-full w-full object-cover hover:scale-105 transition duration-300"
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
    <button className="w-full mt-2 bg-[#ff4d2d] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#e04326] transition" onClick={handlebook}>
      Book Now
    </button>

  </div>
</div>

  )

}

export default UserItemCard