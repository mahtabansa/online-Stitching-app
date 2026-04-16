import React from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { updateQuantity } from "../../redux/userSlice.js";
import { useNavigate } from "react-router-dom";
import { removeItemFromCard } from "../../redux/userSlice.js";
function CartItemCard({ item }) {
  const { CartItemCard } = useSelector((state) => state.user);
  const [showMore,setshowMore] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleIncrease = ({ id, currentQuantity }) => {
    dispatch(updateQuantity({ id: id, quantity: currentQuantity + 1 }));
  }

  const handleDecrease = ({ id, currentQuantity }) => {
    if (currentQuantity > 1) {
      dispatch(updateQuantity({ id: id, quantity: currentQuantity - 1 }));
    }
  }


  return (
    <div className="w-full bg-[
#ffffff
] sm:p-5 sm:m-5 md:w-[400px] lg:w-[400px]  border border-gray-200 rounded-lg 
 p-4 flex flex-col sm:flex-row gap-4 hover:shadow-md transition">

      {/* Image */}
      <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-gray-100">
        <img
          src={item?.image}
          alt={item?.name}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 justify-between ">

        {/* Top Section */}
        <div className="flex justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-800">
              {item?.name}
            </h2>

            <p className={`text-sm text-gray-500 mt-1 ${showMore ? "text-full" : "line-clamp-2"} `}>
              {item?.description} thinsis amazing thing your try ince and it feels too good and best services in your city at door step
            </p>

            {/* Stock */}
            <p className="text-green-600 text-sm mt-1" onClick={()=>setshowMore((prev)=>!prev)}>
              {showMore ? "Show Less" :"See More Details"}
            </p>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-900">
              ₹{item?.price}
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-wrap items-center justify-between mt-4 gap-3 ">

          {/* Quantity Dropdown style */}
          <div className="flex items-center border rounded-md overflow-hidden">

            <button
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
              onClick={() =>
                handleDecrease({
                  id: item._id,
                  currentQuantity: item.quantity,
                })
              }
            >
              <FaMinus size={12} />
            </button>

            <span className="px-4 text-sm">{item.quantity}</span>

            <button
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
              onClick={() =>
                handleIncrease({
                  id: item._id,
                  currentQuantity: item.quantity,
                })
              }
            >
              <FaPlus size={12} />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 text-sm text-blue-600">

            <button
              onClick={() => dispatch(removeItemFromCard({ id: item._id }))}
              className="hover:underline flex items-center gap-1"
            >
              <FaRegTrashCan /> Delete
            </button>


          </div>

          {/* Book Button */}
          <button className="ml-auto bg-yellow-400 hover:bg-yellow-500 text-black px-5 py-1.5 rounded-md text-sm font-medium" onClick={()=>navigate("/checkout")}>
           Book Order
          </button>

        </div>
      </div>
    </div>
  );
}

export default CartItemCard;

