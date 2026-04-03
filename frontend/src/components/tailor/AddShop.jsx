import React from 'react'
import shop from "../../assets/shop.jpg"
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ShopCard from './ShopCard';
const AddShop = () => {
      const navigate = useNavigate();
      const { shopsInMyCity } = useSelector((state) => state.user);

      console.log(shopsInMyCity);

      return (
            <div className="w-full max-w-md flex justify-center items-center p-4 
                         sm:p-6 bg-white shadow-lg hover:shadow-2xl rounded-md 
                         transition-shadow duration-200 ">

                  <div className="flex flex-col justify-center items-center w-full">

                                    <div className="relative w-full h-48 rounded-md overflow-hidden">

                                          <img
                                                src={shop}
                                                alt="shop"
                                                className="w-full h-full object-cover"
                                          />
                                          <button
                                                onClick={() => navigate("/create-edit-shop")}
                                                className="absolute bottom-3 left-1/2 transform 
                                             -translate-x-1/2 
                            bg-[#C7843B] text-white px-5 py-2 rounded-full 
                            hover:bg-[#a66a2f] transition duration-200 shadow-lg"
                                          >
                                                Add Shop
                                          </button>

                                    </div>
                  </div>
            </div>
      )
}

export default AddShop

