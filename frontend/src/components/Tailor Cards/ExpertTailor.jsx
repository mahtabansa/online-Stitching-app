import React, { useEffect, useState } from 'react'
import dummy_pic from '../../assets/dummy_pic.jpg'
import { useSelector } from 'react-redux'

const ExpertTailor = () => {
  const { shopsInMyCity } = useSelector((state) => state.user || {})
  const shops = shopsInMyCity?.shop || []

  const getBatchSize = () => {
    const width = window.innerWidth
    if (width >= 1024) return 12 // lg (6 columns × 2 rows)
    if (width >= 768) return 10  // md (5 columns × 2 rows)
    if (width >= 640) return 8   // sm (4 columns × 2 rows)
    return 6                     // mobile (3 columns × 2 rows)
  }

  const [batchSize, setBatchSize] = useState(getBatchSize())
  const [visibleCount, setVisibleCount] = useState(getBatchSize())

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      const size = getBatchSize()

      setBatchSize(size)

      setVisibleCount((prev) => Math.max(prev, size))
    }

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Reset when shops change
  useEffect(() => {
    setVisibleCount(batchSize)
  }, [shops, batchSize])

  const visibleShops = shops.slice(0, visibleCount)

  return (
    <div className='bg-[#FEFEFE] rounded-xl'>
      <h2 className="w-full text-2xl font-semibold italic text-center sm:text-left mb-6 text-gray-800 px-4">
        Our Expert Tailors
      </h2>

      {shops.length === 0 ? (
        <p className="text-center text-gray-500 py-8">
          No tailors found in your city yet.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
            {visibleShops.map((shop) => (
              <div
                key={shop._id}
                className="flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div className="rounded-full p-[3px] bg-gradient-to-tr from-gray-500 to-gray-600 shadow-md transition-transform duration-300 group-hover:scale-105">
                  <div className="rounded-full bg-white p-[2px]">
                    <img
                      src={shop?.owner?.image || dummy_pic}
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = dummy_pic
                      }}
                      alt={shop?.owner?.name || "Tailor"}
                      loading="lazy"
                      className="object-cover rounded-full h-20 w-20 md:h-24 md:w-24 lg:h-28 lg:w-28 border-2 border-white"
                    />
                  </div>
                </div>

                <p className="text-sm md:text-base font-medium text-gray-700 text-center truncate w-full">
                  {shop?.name || "Tailor Shop"}
                </p>

                {shop.rating && (
                  <span className="text-xs text-yellow-500 font-semibold">
                    ⭐ {shop.rating}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* More Tailors Button */}
          {visibleCount < shops.length && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setVisibleCount((prev) => prev + batchSize)}
                className="px-6 py-3 rounded-lg bg-[#C7843B] text-white font-medium hover:bg-[#a96b2f] transition"
              >
                More Tailors
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ExpertTailor