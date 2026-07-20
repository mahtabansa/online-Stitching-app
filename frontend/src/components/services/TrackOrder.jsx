import React from 'react'
import Navbar from '../../Navbar'
import { IoArrowBack } from "react-icons/io5";
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { socket } from '../../socket.js'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateOrderStatus,updatePickupTime } from '../../redux/userSlice.js';
const TrackOrder = () => {
  const { Myorder } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { id } = useParams();
  const order = Myorder?.orders?.find((item) => item._id === id);
  const navigate = useNavigate();
  const [status, setStatus] = useState(order?.status);
  const [pickupOtp, setPickupOtp] = useState(order.pickupOtp || null);
  const [pickupOtpExpiry, setPickupOtpExpiry] = useState(order?.pickupOtpExpiry || null);
  const [deliveryOtp, setdeliveryOtp] = useState(order?.deliveryOtp || null);
  const [deliveryOtpExpiry, setdeliveryOtpExpiry] = useState(order?.deliveryOtpExpiry || null);
  const [isOtpVerified, setisOtpVerified] = useState()

  const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-700',
    accepted: 'bg-blue-100 text-blue-700',
    stitching: 'bg-purple-100 text-purple-700',
    'out of delivery': 'bg-orange-100 text-orange-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  const shopOrder = order?.shopOrder?.[0];
  const orderItem = shopOrder?.shopOrderItems?.[0];

  const showPickupOtp =
    pickupOtp &&
    (status === "pending" || status === 'accepted');

  const showDeliveryOtp =
    deliveryOtp
    ;


  const isExpired = (expiry) => expiry && new Date(expiry).getTime() < Date.now();


  useEffect(() => {

    socket.on('orderStatusUpdate', (data) => {
      console.log("data", data)
    if(!data.status){
      return res(402).json({mesaage:`orderstatus is null`})
    }
      dispatch(updateOrderStatus({ orderId: data.orderId, status: data.status }));
    });

    // ✅ naya listener add karo
    socket.on('pickupOtpGenerated', (data) => {
      console.log("pickup otp", data)
      if (data.orderId === id) {
        setPickupOtp(data.pickupOtp);
        setPickupOtpExpiry(data.pickupOtpExpiry);
      }
    });

    socket.on('deliveryOtpGenerated', (data) => {
      if (data.orderId === id) {
        setdeliveryOtp(data?.deliveryOtp)
        setdeliveryOtpExpiry(data?.pickupOtpExpiry)
        dispatch(updateOrderStatus({ orderId: data.orderId, status: data.status }));
      }
    })

    socket.on('verifyPickupOtp', (data) => {
      if (data.orderId === id) {
        setPickupOtp(data.pickupOtp)
        dispatch(updateOrderStatus({ orderId: data.orderId, status: data.status }));
        setisOtpVerified(data.isOtpVerified)
        setStatus(data.status)
      }
    })
    socket.on('verifyOtpConfirmation', (data) => {
      if (data.orderId === id) {
        setdeliveryOtp(data?.deliveryOtp)
        setdeliveryOtpExpiry(data?.pickupOtpExpiry)
        dispatch(updateOrderStatus({ orderId: data.orderId, status: data.status }));
      }
    }
    )

    socket.on("pickupTimeUpdate", (data) => {
      dispatch(updatePickupTime({ orderId: data.orderId, pickupTime: data.pickupTime  }));
    });

    return () => {
      socket.off('pickupOtpGenerated');
      socket.off('deliveryOtpGenerated');
      socket.off('verifyPickupOtp');
      socket.off('verifyOtpConfirmation');

    };
  }, [id]);
  return (
    <>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-10">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 py-4 sm:py-6">

          <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-gray-800 leading-snug">
            Welcome to {shopOrder?.shop?.name || 'the shop'}
          </h1>
        </div>

        {/* Shop Image */}
        <div className="w-full rounded-2xl overflow-hidden bg-gray-100">
          <img
            src={shopOrder?.shop?.image}
            alt="Shop"
            className="w-full h-40 sm:h-52 lg:h-60 object-cover"
          />
        </div>

        {/* Order Details Card */}
        <div className="w-full mt-6">
          <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
            <div className='flex  justify-center gap-6'>
              <button
                onClick={() => navigate('/my-orders')}
                aria-label="Go back"
                className="p-2 text-2xl text-gray-900 hover:bg-gray-100 rounded-full transition shrink-0"
              >
                <IoArrowBack />
              </button>
              <h2 className="text-lg sm:text-2xl font-bold text-gray-800 text-center">
                Your Order
              </h2>
            </div>


            {/* Design / Item */}
            <div className="py-4">
              <p className="text-sm sm:text-base font-semibold text-gray-500 uppercase tracking-wide">
                Design
              </p>

              <div className="mt-3">
                <div className="flex items-center gap-3 border rounded-lg p-3">
                  <img
                    src={orderItem?.item?.image}
                    alt={orderItem?.name || 'Item'}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <p className="text-base sm:text-lg font-bold text-gray-700 truncate">
                      {orderItem?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Qty: {orderItem?.quantity}
                    </p>
                    <p className="font-semibold text-orange-600 text-sm sm:text-base">
                      Total: ₹{orderItem?.quantity * orderItem?.price}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info List */}
            <div className="space-y-4 border-t pt-4">
              <div>
                <p className="text-sm sm:text-base font-semibold text-gray-500">
                  Clothes Pickup Time: <span className="font-normal text-gray-700">{shopOrder?.pickup || '—'}</span>
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Shop owner will reach your location shortly
                </p>
                <p className="text-sm sm:text-base font-semibold text-gray-700 mt-1">
                  {shopOrder?.shop?.shopName}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                <p className="text-sm sm:text-base font-semibold text-gray-500 shrink-0">
                  Pickup Address:
                </p>
                <span className="text-sm text-gray-700 break-words">
                  {order?.deliveryAddress}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <p className="text-sm sm:text-base font-semibold text-gray-500 shrink-0">
                  Contact No:
                </p>
                <span className="text-sm text-gray-700">
                  {shopOrder?.owner?.phone || '—'}
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <p className='text-sm sm:text-base font-semibold text-gray-500 shrink-0'>Status:</p>
                <span
                  className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium capitalize ${statusStyles[order.status] || 'bg-gray-100 text-gray-700'
                    }`}
                >
                  {order.status}
                </span>


              </div>

              {/* ✅ Pickup OTP Field */}
              {showPickupOtp && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-purple-700">
                      Pickup OTP
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Do not share any one except the shop owner
                    </p>
                  </div>
                  <div className="flex flex-col items-start sm:items-end">
                    <span className="text-2xl font-bold tracking-widest text-purple-700">
                      {pickupOtp}
                    </span>
                    {isExpired(pickupOtpExpiry) && (
                      <span className="text-xs text-red-500 mt-1">OTP Expired</span>
                    )}
                  </div>
                </div>
              )}

              {/* ✅ Delivery OTP Field */}
              {showDeliveryOtp && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-orange-700">
                      Delivery OTP
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Do not share any one except the shop owner
                    </p>
                  </div>
                  <div className="flex flex-col items-start sm:items-end">
                    <span className="text-2xl font-bold tracking-widest text-orange-700">
                      {deliveryOtp}
                    </span>
                    {isExpired(deliveryOtpExpiry) && (
                      <span className="text-xs text-red-500 mt-1">OTP Expired</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrackOrder;