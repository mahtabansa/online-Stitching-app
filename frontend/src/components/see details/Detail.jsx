import React from 'react'
import { Link } from 'react-router-dom'
import { BiAt } from "react-icons/bi";
const Detail = () => {
  return (
<div className=" flex flex-col items-center justify-center px-4">
  
  <h1 className="text-xl md:text-2xl font-semibold mb-4 text-center sm:py-4">
    Welcome to the details of tailor
  </h1>
  <div className="bg-gray-200 w-full max-w-sm rounded-lg shadow-xl italic">
    
    <div className="h-48 w-full overflow-hidden rounded-t-lg">
      <img
        src="/media/dummy_pic.jpg"
        alt="tailor_name"
        className="w-full h-full object-cover"
      />
    </div>
    
    <p className="p-3">
      <span className="font-semibold">Boutique:</span> Fashion World
    </p>

    <p className="px-3 pb-4">
      <span className="font-semibold">Location:</span> Nizamuddin Colony, near Jama Masjid
    </p>
  
  </div>

</div>

  )
}

export default Detail