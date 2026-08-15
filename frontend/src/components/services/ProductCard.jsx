import { useNavigate } from 'react-router-dom'
import { memo, useState } from 'react'
import { setAddToCard, setIsSearching } from '../../redux/userSlice'
import { useDispatch } from 'react-redux'
import { IoMdClose } from 'react-icons/io'

const ProductCard = memo(({ item }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [selectedImage, setSelectedImage] = useState(null)
  const [quantity] = useState(1)

  // ================= BOOK NOW =================
  const handleBook = () => {
    const updatedItem = {
      ...item,
      quantity
    }

    dispatch(setAddToCard(updatedItem))
    dispatch(setIsSearching(false))
    navigate('/checkout')
  }

  // ================= ADD TO CART =================
  const handleAdd = () => {
    const updatedItem = {
      ...item,
      quantity: quantity > 0 ? quantity : 1
    }

    dispatch(setAddToCard(updatedItem))
    dispatch(setIsSearching(false))
  }

  return (
<div className="w-full bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">

      {/* ================= IMAGE ================= */}
      <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">

        {item?.image ? (
          <img
            src={item.image}
            alt={item?.name}
            loading="lazy"
            className="w-full h-full object-cover hover:scale-105 transition duration-300 cursor-pointer"
            onClick={() => setSelectedImage(item.image)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}

      </div>

      {/* ================= ZOOM IMAGE ================= */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex justify-center items-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Preview"
            className="max-w-[90%] max-h-[90%] rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute top-5 right-5 text-white text-4xl"
          >
            <IoMdClose />
          </button>
        </div>
      )}

      {/* ================= CONTENT ================= */}
      <div className="p-3 flex flex-col flex-1">

        {/* Product Name */}
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
})

export default ProductCard