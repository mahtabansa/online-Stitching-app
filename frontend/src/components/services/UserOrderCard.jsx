import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { CgClose } from "react-icons/cg";
import { useParams } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { cancelOrder } from "../../redux/userSlice.js";

const OrderCard = ({ order }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showConfirm, setshowConfirm] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const reasons = [
    "Changed my mind",
    "Ordered by mistake",
    "Found another tailor",
    "Delivery is taking too long",
    "Other",
  ];
  const statusStyles = {
    pending: ' text-yellow-700',
    accepted: 'font-semibold text-blue-700',
    stitching: 'font-semibold text-purple-700',
    'out of delivery': 'font-semibold text-orange-700',
    delivered: 'font-semibold text-green-700',
    cancelled: 'font-semibold text-red-700',
  };



  const handleCancel = async (id) => {
    console.log("cancelReason, customReason ", cancelReason, customReason)

    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/order/cancel-order/${id}`, { cancelReason, customReason }, { withCredentials: true }).then(res => {
      })
      dispatch(cancelOrder({ orderId: id, status: "cancelled", cancelReason }));
    } catch (err) {
      console.log(`error ocuured while cancelling user's order ${err}`)
    }

  };
   

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-md p-4 mb-5">
      {order?.shopOrder?.map((shoporder) =>
        shoporder.shopOrderItems?.map((orderItem) => (
          <div
            key={orderItem._id}
            className="flex gap-4 border-b pb-4 last:border-none"
          >
            {/* Image */}
            <div className="w-32 h-42 flex-shrink-0">
              <img
                src={orderItem.item?.image[0]}
                alt={orderItem.item?.name}
                className="w-full h-full object-cover rounded-lg"
                onClick={() => setSelectedImage(orderItem.item?.image[0])}
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

            {/* Details */}
            <div className="flex flex-col justify-between flex-1">
              <div>
                <h3 className="font-semibold text-lg">
                  {orderItem.item?.name}
                </h3>

                <p>Price: ₹{orderItem.item?.price}</p>
                <p>Quantity: {orderItem.quantity}</p>
                <p >Status:
                  <span className={`font-semibold  ${statusStyles[order.status]}`}> {order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()}</span>
                </p>
                <p>Tailor: {shoporder.owner?.name}</p>
              </div>

              <div className={`flex gap-2 mt-3 ${order.status === "cancelled" ? "hidden" : null}`}>
                <button
                  className="flex-1 bg-gray-600 text-white py-2 rounded-lg"
                  onClick={() => navigate(`/track-order/${order?._id}`)}

                >
                  {order.status === "delivered" ? "View last order" : "Track Order "}
                </button>
                {
                  order.status === "delivered" ? null : <button
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg"
                    onClick={() => setshowConfirm(true)}
                  >
                    Cancel Order
                  </button>
                }

              </div>
            </div>
          </div>
        ))
      )}

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 ">

          <div className="bg-white rounded-xl p-3 w-[90%] max-w-sm shadow-xl relative">
            <button className="absolute top-2 right-2 text-2xl hover:text-gray-600 cursor-pointer " onClick={() => { setshowConfirm(false), setCancelReason('') }}><CgClose /></button>
            <h2 className=" text-center text-xl font-bold mb-2">
              Cancel Order?
            </h2>

            <p className="text-gray-600 mb-5 text-center">
              Are you sure you want to cancel this order?
            </p>

            <div className="flex flex-col gap-3">
              <div className="flex justify-center">

                <div className="space-y-3">

                  {cancelReason == 'Other' ? null : reasons.map((reason) => (
                    <label
                      key={reason}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="cancelReason"
                        value={reason}
                        checked={cancelReason === reason}
                        onChange={(e) => setCancelReason(e.target.value)}
                      />

                      <span>{reason}</span>
                    </label>
                  ))}

                </div>

                {
                  cancelReason === "Other" && (<textarea className="bg-gray-200 m-5 p-4 flex-1" placeholder="give your feedback for futher improvement " value={customReason} onChange={(e) => setCustomReason(e.target.value)} />
                  )
                }

              </div>
              <button
                onClick={() => {
                  handleCancel(order._id);
                  setshowConfirm(false);
                }}
                className="px-4 py-2 rounded bg-red-600 text-white"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default OrderCard;