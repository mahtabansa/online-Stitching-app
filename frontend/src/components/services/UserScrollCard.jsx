import React, { useState, useMemo } from 'react'
import { setAddToCard, setCheckOut } from '../../redux/userSlice.js'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { IoChevronForward } from "react-icons/io5";

const UserScrollCard = ({ item }) => {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoomImage, setZoomImage] = useState(null);
  // Normalize item.image into a clean array of valid URLs.
  // Handles both single-image and multi-image (up to 3) items,
  // and cases where one array entry has multiple URLs joined by "\n".
  const images = useMemo(() => {
    const source = item?.images || item?.image;
    if (!source) return [];

    const rawArray = Array.isArray(source) ? source : [source];

    const flattened = rawArray
      .flatMap((entry) => (typeof entry === "string" ? entry.split("\n") : entry))
      .map((url) => url?.trim())
      .filter(Boolean);

    return [...new Set(flattened)];
  }, [item?.images, item?.image]);

  const hasMultipleImages = images.length > 1;

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlebook = () => {
    const updatedItem = { ...item, quantity: quantity }
    dispatch(setCheckOut(updatedItem))
    navigate('/checkout')
  }

  const handleAdd = () => {
    const updatedItem = { ...item, quantity: quantity > 0 ? quantity : 1 }
    dispatch(setAddToCard(updatedItem))
  }

  return (
    <div className="w-[260px] h-80 bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden cursor-pointer">

      {/* Image */}
      <div className="relative h-[50%] bg-gray-200 flex items-center justify-center overflow-hidden">
        <img
          src={images[currentImageIndex]}
          alt={item?.name}
          className="h-full m-auto hover:scale-105 transition duration-300"
          onClick={() => setZoomImage(images[currentImageIndex])}
        />

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

        {hasMultipleImages && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, index) => (
              <span
                key={index}
                className={`w-1.5 h-1.5 rounded-full ${
                  index === currentImageIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Design zoomed Image */}
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
            className="absolute top-5 right-5 text-white text-4xl font-bold cursor-pointer"
            onClick={() => setZoomImage(null)}
          >
            ✕
          </button>
        </div>
      )}

      {/* Content */}
      <div className="p-4 space-y-2">

        {/* Title */}
        <div className="font-semibold text-gray-800 line-clamp-2 relative">
          <span className='text-lg font-semibold'>{item?.name}</span>
          <span className='absolute text-lg font-semibold inset-y-0 right-0'> ₹{item?.price}</span>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-500 line-clamp-2">
          {item?.description}
        </p>

        {/* Button */}
        <div className='w-full flex justify-between gap-5'>
          <button className="w-1/3 mt-2 bg-gray-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-[#e04326] transition" onClick={handlebook}>
            Book Now
          </button>
          <button className="w-1/3 mt-2 bg-gray-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-[#e04326] transition" onClick={handleAdd}>
            Add Cart
          </button>
        </div>

      </div>
    </div>
  )
}

export default UserScrollCard