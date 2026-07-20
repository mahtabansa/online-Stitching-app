import { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { updateOrderStatus } from '../../redux/userSlice.js';
import { socket } from '../../socket.js';
function OwnerOrderCard({ item }) {
  console.log("item",item)
  const [status, setStatus] = useState(item?.status);
  const [pickupTime, setPickupTime] = useState(item?.shopOrder?.[0]?.pickup);
  const dispatch = useDispatch();
  const [pickupTimelocal, setPickupTimelocal] = useState('');
  // Pickup verification states
  const [pickupOtpSent, setPickupOtpSent] = useState(item.pickupOtp || false);
  const [pickupOtpInput, setPickupOtpInput] = useState('');

  // Delivery verification states
  const [deliveryOtpSent, setDeliveryOtpSent] = useState(item?.deliveryOtp || false);
  const [deliveryOtpInput, setDeliveryOtpInput] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const shopOrder = item.shopOrder?.[0];
  const orderItem = shopOrder?.shopOrderItems?.[0]?.item;
  const quantity = shopOrder?.shopOrderItems?.[0]?.quantity;

  const timeOptions = [
    "8-10 AM", "10-12 PM", "12-2 PM", "2-4 PM",
    "4-6 PM", "6-8 PM", "8-10 PM",
  ];

  const statusOptions = ["accepted", "stitching", "out of delivery", "cancelled"];

  // Step 1: Order Accept
  const handleAccept = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/order/accept/${item._id}`, {}, { withCredentials: true });
      console.log("accept order only res.data ", res.data)
      console.log("accept order", res.data.order.status)
      dispatch(updateOrderStatus({ orderId: item._id, status: res.data.order.status }))

      setStatus(res.data.order.status)
    } catch (err) {
      console.log(err);
      setError('Order accept nahi hua, dobara try karo');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Pickup time save karna (sirf scheduling, status touch nahi karta)

  const handlePickupTimeSave = async () => {

    if (!pickupTimelocal) {
      setError(' please select Pickup time');
      return;
    }
    try {
      setLoading(true);
      setError('');
      // ✅ FIX: response se order lo, taaki pickup time UI turant sync ho
      const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/order/pickup-time/${item._id}`, { pickupTime: pickupTimelocal }, { withCredentials: true });
      console.log("res", res)
      setPickupTime(res.data.order.shopOrder[0].pickup);
      setError('');
    } catch (err) {
      console.log(err);
      setError('Pickup time save nahi hua');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Pickup OTP generate karna — status touch NAHI hota (backend confirm hai)
  const handleSendPickupOtp = async () => {
    try {
      setLoading(true);
      setError('');
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/order/pickup/send-otp/${item._id}`, {}, { withCredentials: true });
      setPickupOtpSent(true);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || 'Pickup OTP does not generated, please try again');
    } finally {
      setLoading(false);
    }
  };

  // Step 4: Pickup OTP verify karna → status = stitching
  const handleVerifyPickupOtp = async () => {
    if (!pickupOtpInput || pickupOtpInput.length !== 4) {
      setError('Sahi 4-digit OTP daalo');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/order/pickup/verify-otp/${item._id}`,
        { otp: pickupOtpInput },
        { withCredentials: true }
      );
      setStatus(res.data.order.status);
      dispatch(updateOrderStatus({ orderId: item._id, status: res.data.order.status }))// "stitching"
      setPickupOtpInput('');
      setPickupOtpSent(false); // reset, next stage ke liye
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || 'OTP galat hai');
    } finally {
      setLoading(false);
    }
  };

  // Step 5: Delivery OTP generate karna

  const handleSendDeliveryOtp = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/order/delivery/send-otp/${item._id}`, {}, { withCredentials: true });
      setDeliveryOtpSent(true);
      if (res.data.order?.status) {
        setStatus(res.data.order.status);
      }
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || 'Delivery OTP did not generate,  try again');
    } finally {
      setLoading(false);
    }
  };
  // Step 6: Delivery OTP verify karna → status = delivered
  const handleVerifyDeliveryOtp = async () => {
    if (!deliveryOtpInput || deliveryOtpInput.length !== 4) {
      setError('Sahi 4-digit OTP daalo');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/order/delivery/verify-otp/${item._id}`,
        { otp: deliveryOtpInput },
        { withCredentials: true }
      );
       
       setStatus(res.data.order.status)
       dispatch(updateOrderStatus({ orderId: item._id, status: res?.data?.order?.status }))// "delivered"
      setDeliveryOtpInput('');
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || 'OTP galat hai');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    const prevStatus = status; // rollback ke liye purani value save karo
    console.log('Changing status from', prevStatus, 'to', newStatus);

    try {
      setLoading(true);
      setError('');
      setStatus(newStatus); // optimistic update — UI turant update ho jaye

      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/order/delivery/update-status/${item._id}`,
        { status: newStatus }, // ✅ FIX: local variable use karo, state nahi
        { withCredentials: true }
      );
      setStatus(res.data.order.status);
         dispatch(updateOrderStatus({ orderId:item._id ,status:res.data.order.status})) // backend se confirmed status set karo
    } catch (err) {
      console.log(err);
      setStatus(prevStatus); // ✅ FIX: rollback purani status pe, na ki null
      setError(err.response?.data?.message || 'Status did not update');
    } finally {
      setLoading(false);
    }
  };
  // ✅ FIX: badge color helper — out of delivery ke liye bhi color define kiya
  const getBadgeColor = (s) => {
    switch (s) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'accepted': return 'bg-blue-100 text-blue-700';
      case 'stitching': return 'bg-purple-100 text-purple-700';
      case 'out of delivery': return 'bg-orange-100 text-orange-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };


  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-md mx-auto mb-5">
      {/* Item details */}
      <div className="flex gap-4">
        <img
          src={orderItem?.image}
          alt={orderItem?.name}
          className="w-24 h-24 object-cover rounded-lg border"
        />
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-800">{orderItem?.name}</h2>
          <p className="text-sm text-gray-600">Qty: {quantity}</p>
          <p className="text-sm text-gray-600">Price: ₹{shopOrder?.subtotal}</p>
          <p className="text-sm text-gray-500">Method: {item.StitchingMethod}</p>
        </div>
      </div>

      {/* User details */}
      <div className="mt-3 border-t pt-3">
        <p className="text-sm text-gray-800 font-medium">{item.user?.name}</p>
        <p className="text-sm text-gray-600">{item.user?.phone}</p>
        <p className="text-sm text-gray-600">{item.deliveryAddress}</p>
      </div>

      {/*  here will be the status input option dropdown*/}
      {/* Total + status badge */}
      <div className="mt-2 flex justify-between items-center">
        <span className="text-gray-700 font-medium">Total: ₹{item.totalAmount}</span>

        {status === 'stitching' && status !== "delivered" ? (

          <div className="inline-flex flex-col gap-1 items-end">
            <select
              value={status}
              onChange={handleChange}
              disabled={loading}
              className={`text-xs font-medium px-2 py-1 rounded-full border-none outline-none capitalize cursor-pointer disabled:opacity-60 ${getBadgeColor(status)}`}
            >
              {statusOptions.map((opt) => (
                <option key={opt} value={opt} className="bg-white text-gray-800">
                  {opt}
                </option>
              ))}
            </select>
          </div>


        ) : (
          <span className={`text-xs px-2 py-1 rounded-full capitalize ${getBadgeColor(status)}`}>
            {status.replace(/_/g, ' ')}
          </span>
        )}
      </div>


      {error && <p className="text-red-600 text-sm mt-2 font-semibold">{error}</p>}

      <div className="mt-4">
        {/* STAGE 1: Pending */}
        {status === 'pending' && (
          <button
            onClick={handleAccept}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md flex items-center justify-center disabled:opacity-60"
          >
            {loading ? <ClipLoader color="#fff" size={20} /> : 'Accept Order'}
          </button>
        )}


        {/* STAGE 2: Accepted — pickup time + pickup OTP verification */}
        {status === 'accepted' && (
          <div className="flex flex-col gap-3">

            {/* Step A: Pickup time NOT set yet -> show selector */}
            {!pickupTime ? (
              <div className="flex flex-col gap-2">
                <label htmlFor="pickupTime" className="text-sm font-medium text-gray-700">
                  Select Pickup Time
                </label>
                <select
                  id="pickupTime"
                  value={pickupTimelocal || ''}
                  onChange={(e) => setPickupTimelocal(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">-- Select time slot --</option>
                  {timeOptions.map((time, index) => (
                    <option key={index} value={time}>{time}</option>
                  ))}
                </select>

                <button
                  onClick={() => handlePickupTimeSave()}
                  disabled={loading}
                  className="w-full bg-gray-600 text-white py-2 rounded-md flex items-center justify-center disabled:opacity-60"
                >
                  {loading ? <ClipLoader color="#fff" size={20} /> : 'Save Pickup Time'}
                </button>
              </div>
            ) : (
              <>
                {/* Pickup time already set -> show it */}
                <p className="text-sm text-gray-600 font-medium">
                  Order Pickup Time: <span className="font-medium">{pickupTime}</span>
                </p>

                {/* Step B: Pickup time set but OTP not sent yet -> show Generate OTP */}
                {!pickupOtpSent ? (
                  <div className="border-t pt-3">
                    <p className="text-xs text-gray-500 mb-2 text-center">
                      Generate OTP when you picked up the order
                    </p>
                    <button
                      onClick={() => handleSendPickupOtp()}
                      disabled={loading}
                      className="w-full bg-green-600 text-white py-2 rounded-md flex items-center justify-center disabled:opacity-60"
                    >
                      {loading ? <ClipLoader color="#fff" size={20} /> : 'Generate Pickup OTP'}
                    </button>
                  </div>
                ) : (
                  /* Step C: OTP sent -> show verify input */
                  <div className="border-t pt-3 flex flex-col gap-2">
                    <label htmlFor="pickupOtp" className="text-sm font-medium text-gray-700 text-center">
                      OTP sent to customer
                    </label>

                    <input
                      id="pickupOtp"
                      type="text"
                      maxLength={4}
                      placeholder="Enter 4-digit OTP"
                      value={pickupOtpInput}
                      onChange={(e) => setPickupOtpInput(e.target.value)}
                      className="w-full p-2 border rounded tracking-widest text-center"
                    />
                    <button
                      onClick={handleVerifyPickupOtp}
                      disabled={loading}
                      className="w-full bg-purple-600 text-white py-2 rounded-md flex items-center justify-center disabled:opacity-60"
                    >
                      {loading ? <ClipLoader color="#fff" size={20} /> : 'Verify Pickup OTP'}
                    </button>
                    <button
                      onClick={handleSendPickupOtp}
                      disabled={loading}
                      className="text-xs text-blue-600 underline mt-1"
                    >
                      Resend OTP
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* STAGE 3 & 4: Stitching / Ready for Delivery — delivery OTP verification */}

        {(status === 'out of delivery') && (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-600">
              Delivery Time: <span className="font-medium">{pickupTime || shopOrder?.pickup}</span>
            </p>

            {!deliveryOtpSent ? (
              <>
                <p className="text-xs text-gray-500 mb-1 text-center">
                  Generate OTP on the time of order Delivery
                </p>
                <button
                  onClick={handleSendDeliveryOtp}
                  disabled={loading}
                  className="w-full bg-orange-600 text-white py-2 rounded-md flex items-center justify-center disabled:opacity-60"
                >
                  {loading ? <ClipLoader color="#fff" size={20} /> : 'Generate Delivery OTP'}
                </button>
              </>
            ) : (
              <>


                <label htmlFor="deliveryOtp" className="text-sm font-medium text-gray-700 text-center" >
                  OTP sent to customer
                </label>

                <input
                  id="deliveryOtp"
                  type="text"
                  maxLength={4}
                  placeholder="Enter 4-digit OTP"
                  value={deliveryOtpInput}
                  onChange={(e) => setDeliveryOtpInput(e.target.value)}
                  className="w-full p-2 border rounded tracking-widest text-center"
                />
                <button
                  onClick={handleVerifyDeliveryOtp}
                  disabled={loading}
                  className="w-full bg-purple-600 text-white py-2 rounded-md flex items-center justify-center disabled:opacity-60"
                >
                  {loading ? <ClipLoader color="#fff" size={20} /> : 'Verify OTP & Complete'}
                </button>
                <button
                  onClick={handleSendDeliveryOtp}
                  disabled={loading}
                  className="text-xs text-blue-600 underline mt-1"
                >
                  Resend OTP
                </button>
              </>
            )}
          </div>
        )}

        {/* STAGE 5: Delivered */}
        {status === 'delivered' && (
          <p className="text-center text-green-700 font-medium">✅ Order Delivered Successfully</p>
        )}
      </div>


    </div>
  );
}

export default OwnerOrderCard;