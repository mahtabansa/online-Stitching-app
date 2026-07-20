import React from 'react'
import Navbar from '../../Navbar.jsx'
import { useSelector } from 'react-redux'
import { FaArrowLeft } from "react-icons/fa6";
import CartItemCard from '../services/CartItemCard.jsx';
import UserOrderCard from '../services/UserOrderCard.jsx';
import OwnerOrderCard from '../Tailor Cards/OwnerOrderCard.jsx'
import { useNavigate } from 'react-router-dom';
import { socket } from '../../socket.js';
import { useEffect } from 'react';
import { AddMyOrders } from '../../redux/userSlice.js'
import { useDispatch } from 'react-redux';
import { updateOrderStatus ,updatePickupTime} from "../../redux/userSlice.js";

const MyOrdersHome = () => {
      const { Myorder, userData } = useSelector((state) => state.user)
      const navigate = useNavigate();
      const dispatch = useDispatch();

      useEffect(() => {

            socket.on("newOrder", (data) => {
                  console.log("New order received:", data.order);
                  dispatch(AddMyOrders(data.order))

            });

            socket.on("placeOrder", (data) => {
                  console.log("data coming from palce order socket", data)
                  console.log("data", data?.neworder?.status);
            }),

                  socket.on("handleAccept", (data) => {
                        console.log("data", data)
                        dispatch(updateOrderStatus({ orderId: data.orderId, status: data.status }));
                  });

            socket.on('verifyPickupOtp', (data) => {
                  console.log("data", data)
                  dispatch(updateOrderStatus({ orderId: data.orderId, status: data.status }));
            });
            socket.on('verifyOtpConfirmation', (data) => {
                  console.log("data", data)
                  dispatch(updateOrderStatus({ orderId: data.orderId, status: data.status }));
            });

            socket.on('orderStatusUpdate', (data) => {
                  console.log("data", data)
                  dispatch(updateOrderStatus({ orderId: data.orderId, status: data.status }));
            });

            socket.on("pickupTimeUpdate", (data) => {
                  dispatch(updatePickupTime({ orderId: data.orderId, pickupTime: data.pickupTime }));
            });


            return () => {
                  socket.off('orderStatusUpdate');
                  socket.off('verifyPickupOtp');
                  socket.off("newOrder");
                  socket.off('verifyOtpConfirmation')
                  
            };
      }, [dispatch]);



      return (
            <>
                  <div className='p-5 flex justify-center flex-row gap-5' >
                        <button className='text-gray-700 text-2xl' onClick={() => navigate("/")}><FaArrowLeft /></button>
                        <h1 className='text-2xl font-semibold text-gray-700'>My Orders </h1>
                  </div>
                  <div className=' flex flex-col items-center h-full gap-5'>

                        {Myorder?.orders?.length === 0 ?
                              (<div className='flex flex-col gap-5'>
                                    <p className='text-xl '>There is no stitching Order yet </p>
                                    <p> <span className='text-gray-800 text-medium'>Book your stitching clothes,</span> <button className='text-blue-600 font-semibold' onClick={() => navigate('/custom_design')}> Click Here !</button></p>

                              </div>) : (Myorder?.orders?.map((order) => (
                                    userData?.role == "customer" ?
                                          <UserOrderCard order={order} key={order?._id} />
                                          : <OwnerOrderCard item={order} key={order?._id} />
                              )))

                        }

                  </div>
            </>
      )
}

export default MyOrdersHome