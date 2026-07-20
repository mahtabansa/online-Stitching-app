import React from 'react'
import dummy_pic from '../../assets/dummy_pic.jpg'
import { useSelector } from 'react-redux'

const ExpertTailor = () => {
  const { shopsInMyCity } = useSelector((state) => state.user || {})
  const shops = shopsInMyCity?.shop || []

  return (
    <div className='  bg-[#FEFEFE]  rounded-xl  '>
      <h2 className="w-full text-2xl font-semibold italic text-center sm:text-left mb-6 text-gray-800">
        Our Expert Tailors
      </h2>

      {shops.length === 0 ? (
        <p className="text-center text-gray-500 py-8">
          No tailors found in your city yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {shops.map((shop) => (
            <div
              key={shop._id || shop.id}
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className="rounded-full p-[3px] bg-gradient-to-tr from-gray-500 to-gray-600 shadow-md transition-transform duration-300 group-hover:scale-105">
                <div className="rounded-full bg-white p-[2px]">
                  <img
                    src={shop?.owner?.image || dummy_pic}
                    onError={(e) => { e.target.onerror = null; e.target.src = dummy_pic }}
                    alt={shop?.owner?.name || 'Tailor shop'}
                    loading="lazy"
                    className="object-cover rounded-full h-20 w-20 md:h-24 md:w-24 lg:h-28 lg:w-28 border-2 border-white"
                  />
                </div>
              </div>

              <p className="text-sm md:text-base font-medium text-gray-700 text-center truncate w-full">
                {shop?.name || 'Tailor Shop'}
              </p>

              {shop.rating && (
                <span className="text-xs text-yellow-500 font-semibold">
                  ⭐ {shop.rating}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ExpertTailor