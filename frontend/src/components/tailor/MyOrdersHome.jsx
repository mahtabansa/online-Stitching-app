import React from 'react'
import Navbar from '../../Navbar.jsx'
import { useSelector } from 'react-redux'
import { FaArrowLeft } from "react-icons/fa6";
import CartItemCard from '../services/CartItemCard.jsx';
import UserOrderCard from '../services/UserOrderCard.jsx';
import OwnerOrderCard from '../Tailor Cards/OwnerOrderCard.jsx'
import { useNavigate } from 'react-router-dom'; 
const MyOrdersHome = () => {
      //here will be my order logic function
      const { Myorder, userData } = useSelector((state) => state.user)
      const navigate = useNavigate();
      console.log("myOrders", Myorder);
      //for tailors  
      return (
            <> <Navbar />
                  <div className='p-5 flex justify-center flex-row gap-5'>
                        <button className='text-gray-700 text-2xl' onClick={() => navigate(-1)}><FaArrowLeft /></button>
                        <h1 className='text-2xl font-semibold text-gray-700'>MY Orders </h1>
                  </div>
                  <div className=' flex flex-col items-center h-full gap-5'>

                        {Myorder.orders.length === 0 ?
                              (<div className='flex flex-col gap-5'>
                                    <p className='text-xl '>There is no stitching Order yet </p>
                                    <p> <span className='text-gray-800 text-medium'>Book your stitching clothes,</span> <button className='text-blue-600 font-semibold' onClick={() => navigate('/custom_design')}> Click Here !</button></p>


                              </div>) : (Myorder.orders.map((order) => (
                                    userData.role == "customer" ?
                                          <UserOrderCard order={order} key={order._id} />
                                          : <OwnerOrderCard order={order} key={order._id} />
                              )))

                        }

                  </div>
            </>
      )
}

export default MyOrdersHome