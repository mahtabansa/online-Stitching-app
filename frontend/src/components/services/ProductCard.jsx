import { useNavigate } from 'react-router-dom'
import { memo } from 'react'
import { useState } from 'react';
import { setAddToCard, setIsSearching } from '../../redux/userSlice';
import { useDispatch } from 'react-redux';
const ProductCard = memo(({ item }) => {
  const dispatch = useDispatch()
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const handlebook = () => {
    const updatedItem = {
      ...item, quantity: quantity
    }
    dispatch(setAddToCard(updatedItem))
    dispatch(setIsSearching(false))
    navigate('/checkout')
  }

  const handleAdd = () => {
    const updatedItem = {
      ...item, quantity: quantity > 0 ? quantity : 1
    }
     
    dispatch(setAddToCard(updatedItem))
    dispatch(setIsSearching(false))


  }


  return (
    <div className="mt-5 w-[260px] h-90 bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden cursor-pointer">
      <div className="h-[50%] bg-gray-200 flex items-center justify-center overflow-hidden">
        <img
          src={item?.image}
          alt={item?.name}
          loading="lazy"
          className="h-full hover:scale-105 transition duration-300"
          onClick={() => setSelectedImage(item?.image)}
        />
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Preview"
            className="max-w-[90%] max-h-[90%] rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            className="absolute top-5 right-5 text-white text-4xl font-bold"
            onClick={() => setSelectedImage(null)}
          >
            ✕
          </button>
        </div>
      )}

      <div className="p-4 space-y-2">
        <h2 className="text-sm font-semibold text-gray-800 line-clamp-2">
          <span className="font-semibold">Design</span>, {item?.name}
        </h2>
        <p className="text-gray-800">
          <span className="font-semibold">Price,</span> ₹{item?.price}
        </p>
        <p className="text-xs text-gray-500 line-clamp-2">{item?.description}</p>
        <div className="w-full flex justify-between gap-5">
          <button
            className="w-1/3 mt-2 bg-gray-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-[#e04326] transition"
            onClick={handlebook}
          >
            Book Now
          </button>
          <button
            className="w-1/3 mt-2 bg-gray-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-[#e04326] transition"
            onClick={handleAdd}
          >
            Add Cart
          </button>
        </div>
      </div>
    </div>
  )
})

export default ProductCard