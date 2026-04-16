import React from 'react'
import { useSelector } from 'react-redux'
import CartItemCard from './CartItemCard.jsx'
import Navbar from '../../Navbar.jsx'
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';


const MyCart = () => {
      const { ItemCard } = useSelector((state) => state.user);
      console.log("ItemsCard ", ItemCard);
      const navigate = useNavigate();
      return (
            <>
                  <Navbar />
                  
                  <div className='p-5 flex justify-center flex-row gap-5'>
                        <button className='text-gray-700 text-2xl' onClick={()=> navigate(-1)}><FaArrowLeft/></button>
                        <h1 className='text-2xl font-semibold text-gray-700'>Your Cart</h1>
                  </div>
                  <div className=' flex flex-col items-center h-full gap-5'>
                  
                        {ItemCard.length===0 ?  
                        <div className='flex flex-col gap-5'>
                              <p className='text-xl '>There is nothing to Stitch </p>
                              <p> <span className='text-gray-800 text-medium'>Book your stitching clothes,</span> <button className='text-blue-600 font-semibold' onClick={()=>navigate('/custom_design')}> Click Here !</button></p>
                           
                             
                        </div>: ItemCard.map((item) => (
                              <CartItemCard item={item}  key={item._id}/>
                        ))
                       
                              
                  
                        }

                  </div>
            </>

      )
}

export default MyCart




