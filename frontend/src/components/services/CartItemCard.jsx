import React, { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { updateQuantity, removeItemFromCard } from "../../redux/userSlice.js";
import { IoMdClose } from "react-icons/io";

function CartItemCard({ item }) {
  const [showMore, setshowMore] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const dispatch = useDispatch();

  const handleIncrease = () => {
    dispatch(updateQuantity({ id: item._id, quantity: item.quantity + 1 }));
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      dispatch(updateQuantity({ id: item._id, quantity: item.quantity - 1 }));
    } else {
      // quantity is already 1, decreasing further means remove the item
      dispatch(removeItemFromCard({ id: item._id }));
    }
  };

  return (
    <div className="w-full bg-white sm:p-5 sm:m-3 md:w-[400px] lg:w-[400px] border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row gap-4 hover:shadow-md transition items-center sm:items-start justify-between">

      {/* Image */}
      <div className="w-full sm:w-32 h-40 sm:h-32 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
        <img
          src={item?.image}
          alt={item?.name}
          className="w-full h-full object-contain cursor-pointer"
          onClick={() => setSelectedImage(item?.image)}
        />
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            className="max-w-[90%] sm:max-w-[80%] max-h-[70%] sm:max-h-[60%] bg-gray-100 rounded-md"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute top-5 right-5 text-white text-2xl font-bold"
            onClick={() => setSelectedImage(null)}
          >
            <IoMdClose />
          </button>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col flex-1 w-full justify-between sm:ml-2">

        {/* Top Section */}
        <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-4">
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-medium text-gray-800 truncate">
              {item?.name}
            </h2>

            <p className={`text-sm text-gray-500 mt-1 ${showMore ? "" : "line-clamp-2"}`}>
              {item?.description}
            </p>

            <button
              type="button"
              className="text-blue-600 text-sm mt-1 font-medium"
              onClick={() => setshowMore((prev) => !prev)}
            >
              {showMore ? "Show Less" : "See More"}
            </button>
          </div>

          {/* Price */}
          <div className="text-left sm:text-right shrink-0">
            <p className="text-lg font-semibold text-gray-900">
              ₹{item?.price}
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center justify-between mt-4 gap-3">

          {/* Quantity */}
          <div className="flex items-center justify-center border rounded-md overflow-hidden w-fit">
            <button
              className="px-4 py-1 bg-gray-100 hover:bg-gray-200"
              onClick={handleDecrease}
            >
              <FaMinus size={12} />
            </button>

            <span className="px-4 text-sm">{item.quantity}</span>

            <button
              className="px-4 py-1 bg-gray-100 hover:bg-gray-200"
              onClick={handleIncrease}
            >
              <FaPlus size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartItemCard;