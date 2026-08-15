import React, { useState, useMemo } from 'react'
import { setAddToCard, setCheckOut } from '../../redux/userSlice.js'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { IoMdClose } from 'react-icons/io'
import { IoChevronForward } from 'react-icons/io5'

const UserScrollCard = ({ item }) => {
  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [zoomImage, setZoomImage] = useState(null)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Normalize images
  const images = useMemo(() => {
    const source = item?.images || item?.image

    if (!source) return []

    const rawArray = Array.isArray(source)
      ? source
      : [source]

    const flattened = rawArray
      .flatMap((entry) =>
        typeof entry === 'string'
          ? entry.split('\n')
          : entry
      )
      .map((url) => url?.trim())
      .filter(Boolean)

    return [...new Set(flattened)]
  }, [item?.images, item?.image])

  const hasMultipleImages = images.length > 1

  // Next image
  const handleNextImage = (e) => {
    e.stopPropagation()

    setCurrentImageIndex(
      (prev) => (prev + 1) % images.length
    )
  }

  // Book
  const handleBook = () => {
    const updatedItem = {
      ...item,
      quantity: quantity > 0 ? quantity : 1
    }

    dispatch(setCheckOut(updatedItem))
    navigate('/checkout')
  }

  // Add to cart
  const handleAdd = () => {
    const updatedItem = {
      ...item,
      quantity: quantity > 0 ? quantity : 1
    }

    dispatch(setAddToCard(updatedItem))
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300 flex flex-col h-full">

      {/* ================= IMAGE ================= */}
      <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">

        {images.length > 0 ? (
          <img
            src={images[currentImageIndex]}
            alt={item?.name}
            className="w-full h-full object-cover hover:scale-105 transition duration-300 cursor-pointer"
            onClick={() =>
              setZoomImage(images[currentImageIndex])
            }
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}

        {/* Next Image Button */}
        {hasMultipleImages && (
          <button
            type="button"
            onClick={handleNextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70 transition"
            aria-label="Next image"
          >
            <IoChevronForward size={18} />
          </button>
        )}

        {/* Image Dots */}
        {hasMultipleImages && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, index) => (
              <span
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentImageIndex
                    ? 'bg-white'
                    : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ================= ZOOM IMAGE ================= */}
      {zoomImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setZoomImage(null)}
        >
          <img
            src={zoomImage}
            alt="Preview"
            className="max-w-[90%] max-h-[90%] rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            type="button"
            onClick={() => setZoomImage(null)}
            className="absolute top-5 right-5 text-white text-4xl cursor-pointer"
          >
            <IoMdClose />
          </button>
        </div>
      )}

      {/* ================= CONTENT ================= */}
      <div className="p-3 flex flex-col flex-1">

        {/* Name */}
        <h2 className="text-sm md:text-base font-semibold line-clamp-2">
          {item?.name}
        </h2>

        {/* Price */}
        <p className="text-[#C7843B] font-bold text-lg mt-1">
          ₹{item?.price}
        </p>

        {/* Description */}
        <p className="text-gray-500 text-sm mt-2 line-clamp-2">
          {item?.description}
        </p>

        {/* See Details */}
        <button
          type="button"
          onClick={() => navigate(`/item/${item?._id}`)}
          className="text-[#C7843B] text-sm font-medium mt-1 self-start hover:underline"
        >
          See Details..
        </button>

        {/* ================= BUTTONS ================= */}
        <div className="mt-auto flex gap-2 pt-4">

          <button
            type="button"
            onClick={handleBook}
            className="flex-1 bg-gray-700 hover:bg-[#C7843B] text-white py-2 rounded-lg text-xs md:text-sm transition"
          >
            Book Now
          </button>

          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 bg-gray-700 hover:bg-[#C7843B] text-white py-2 rounded-lg text-xs md:text-sm transition"
          >
            Add Cart
          </button>

        </div>

      </div>

    </div>
  )
}

export default UserScrollCard