import React, { useMemo, useState } from 'react'
import { setAddToCard, setCheckOut } from '../../redux/userSlice.js'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { IoMdClose } from "react-icons/io"
import { IoChevronForward } from "react-icons/io5"

const UserItemCard = ({ item }) => {
  const [quantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [zoomImage, setZoomImage] = useState(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const images = useMemo(() => {
    if (!item?.image) return []

    const rawArray = Array.isArray(item.image)
      ? item.image
      : [item.image]

    const flattened = rawArray
      .flatMap((entry) =>
        typeof entry === "string"
          ? entry.split("\n")
          : entry
      )
      .map((url) => url?.trim())
      .filter(Boolean)

    return [...new Set(flattened)]
  }, [item?.image])

  const hasMultipleImages = images.length > 1

  const handleNextImage = (e) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const handleBook = () => {
    dispatch(setCheckOut({ ...item, quantity }))
    navigate("/checkout")
  }

  const handleAdd = () => {
    dispatch(setAddToCard({ ...item, quantity }))
  }

  return (
    <>
      <div className="w-full bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">

        {/* Image */}
        <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">

          <img
            src={images[currentImageIndex]}
            alt={item?.name}
            className="w-full h-full object-cover hover:scale-105 transition duration-300 cursor-pointer"
            onClick={() => setZoomImage(images[currentImageIndex])}
          />

          {hasMultipleImages && (
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex justify-center items-center hover:bg-black/70"
            >
              <IoChevronForward size={18} />
            </button>
          )}

          {hasMultipleImages && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, index) => (
                <span
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentImageIndex
                      ? "bg-white"
                      : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Zoom Image */}
        {zoomImage && (
          <div
            className="fixed inset-0 bg-black/80 flex justify-center items-center z-50"
            onClick={() => setZoomImage(null)}
          >
            <img
              src={zoomImage}
              alt="Preview"
              className="max-w-[90%] max-h-[90%] rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            <button
              onClick={() => setZoomImage(null)}
              className="absolute top-5 right-5 text-white text-4xl"
            >
              <IoMdClose />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-3 flex flex-col flex-1">

          <h2 className="text-sm md:text-base font-semibold line-clamp-2">
            {item?.name}
          </h2>

          <p className="text-[#C7843B] font-bold text-lg mt-1">
            ₹{item?.price}
          </p>

          <p
            className={`text-gray-500 text-sm mt-2 line-clamp-2 `}
          >
            {item?.description}
          </p>

          <button
          onClick={() => navigate(`/item/${item?._id}`)}
            className="text-[#C7843B] text-sm font-medium mt-1 self-start hover:underline"
          >
            See Details..
          </button>

          <div className="mt-auto flex gap-2 pt-4">

            <button
              onClick={handleBook}
              className="flex-1 bg-gray-700 hover:bg-[#C7843B] text-white py-2 rounded-lg text-xs md:text-sm transition"
            >
              Book Now
            </button>

            <button
              onClick={handleAdd}
              className="flex-1 bg-gray-700 hover:bg-[#C7843B] text-white py-2 rounded-lg text-xs md:text-sm transition"
            >
              Add Cart
            </button>

          </div>

        </div>

      </div>
    </>
  )
}

export default UserItemCard