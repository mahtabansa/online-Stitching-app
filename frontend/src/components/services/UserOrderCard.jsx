import React from "react";
import { useNavigate } from "react-router-dom";

const OrderCard = ({ order }) => {
  console.log("order", order);
  const Navigate = useNavigate();
  return (
    <>
      {order &&
        order.map((item) => (
          <div
            key={item._id}
            className="h-[200px] w-full bg-gray-200 sm:p-5 sm:m-5 md:w-[400px] lg:w-[400px] border border-gray-200 rounded-lg p-4 flex flex-col hover:shadow-md transition  "
          >
            {/* Loop shopOrder */}
            {item.shopOrder &&
              item.shopOrder.map((shoporder) => (
                <div key={shoporder._id} className="w-full flex  bg-gray-200  rounded-lg">
                  {/* Loop shopOrderItems */}
                  {shoporder.shopOrderItems &&
                    shoporder.shopOrderItems.map((orderItem) => (
                      // this is for item info
                      <div key={orderItem._id} className="w-1/2 ">
                        {/* Image */}
                        <img
                          src={orderItem.item?.image}
                          alt="item"
                          className="w-full  rounded-lg"
                        />
                      </div>
                    ))}

                  {/* this is for owner info */}
                  <div className="w-full">
                    {/* { shoporder.owner && (
                  <div className="">
                    <img
                      src={shoporder.owner?.image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                      alt="Owner"
                      className=" w-1/2 h-full "
                    />
                    
                  </div>
                  
                )} */}
                
                    {/* Order Details */}
                    {
                      shoporder.shopOrderItems && shoporder.shopOrderItems.map((orderItem) => (
                        <div key={orderItem._id} className="flex flex-col justify-between h-full pl-5  ">

                          <div className=" py-5">
                            <p>Design: {orderItem.item?.name}</p>
                            <p >pick up: {item.shopOrder?.[0]?.status}</p>
                            <p>Price: ₹{orderItem.item?.price}</p>
                          </div>

                          <button className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 items-end" onClick={() => Navigate(`/track-order/${item._id}`)}>
                            Track Order
                          </button>
                        </div>
                      ))}


                  </div>
                </div>
              ))}

        
          </div>
        ))}
    </>
  );
};

export default OrderCard;

// <div>

//               <p>Price: ₹{orderItem.price}</p>
//               <p>Qty: {orderItem.quantity}</p>
//             </div>
