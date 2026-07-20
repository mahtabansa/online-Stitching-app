import React from 'react'
import { useSelector } from 'react-redux'
import CartItemCard from './CartItemCard.jsx'
import Navbar from '../../Navbar.jsx'
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCheckOut } from '../../redux/userSlice.js';
const MyCart = () => {
  const { ItemCard,TotalAmount } = useSelector((state) => state.user);
  const cartItems = ItemCard || [];
  const navigate = useNavigate();
  const dispatch = useDispatch();

 
  const handleBookOrder = () => {
    if (!cartItems || cartItems.length === 0) return;
 
    // push every cart item into CheckOutItem before navigating
    cartItems.forEach((item) => {
      dispatch(setCheckOut(item));
    });
 
    navigate("/checkout");
  };

  return (
    <>
      <div className='p-5 flex justify-center items-center flex-row gap-5'>
        <button className='text-gray-700 text-2xl' onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        <h1 className='text-2xl font-semibold text-gray-700'>Your Cart</h1>
      </div>

      <div className='flex flex-col items-center gap-5 min-h-[70vh] p-5'>
        {cartItems.length === 0 ? (
          <div className='flex flex-col gap-5 text-center'>
            <p className='text-xl'>There is nothing to Stitch</p>
            <p>
              <span className='text-gray-800 text-medium'>Book your stitching clothes,</span>{' '}
              <button
                className='text-blue-600 font-semibold'
                onClick={() => navigate('/custom_design')}
              >
                Click Here !
              </button>
            </p>
          </div>
        ) :     <div className="w-full flex flex-col items-center pb-28">
      {/* Sab items ek hi div ke andar render ho rahe hain */}
      <div className="w-full flex flex-col items-center gap-4 p-4">
        {cartItems && cartItems.length > 0 ? (
          cartItems.map((item) => <CartItemCard item={item} key={item._id} />)
        ) : (
          <p className="text-gray-500 mt-10">Your cart is empty</p>
        )}
      </div>
 
      {/* Amazon jaisa sticky bottom bar */}
      {cartItems && cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.08)] p-4 flex items-center justify-between z-40">
          <div>
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="text-lg font-semibold text-gray-900">₹{TotalAmount}</p>
          </div>
 
          <button
            onClick={handleBookOrder}
            className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-6 py-3 rounded-lg transition"
          >
            Book Order
          </button>
        </div>
      )}
    </div>
}
      </div>
    </>
  )
}

export default MyCart