import React from 'react'
import { useNavigate } from 'react-router-dom';
import scissor from "../../assets/scissor.webp"  

const AddItem = () => {
      const navigate = useNavigate();
      return (
            <div className="w-full max-w-md flex justify-center items-center p-4 
                sm:p-6 bg-white shadow-lg hover:shadow-2xl rounded-md 
                transition-shadow duration-200 ">

                  <div className="flex flex-col justify-center items-center w-full">

                        {/* 🔹 Image Container */}
                        <div className="relative w-full h-48 rounded-md overflow-hidden">

                              {/* Image */}
                              <img
                                    src={scissor}
                                    alt="design"
                                    className="w-full h-full object-cover"
                              />

                              {/* 🔥 Overlay Button */}
                              <button
                                    onClick={() => navigate("/create-item")}
                                    className="absolute bottom-3 left-1/2 transform -translate-x-1/2 
                   bg-[#C7843B] text-white px-5 py-2 rounded-full 
                   hover:bg-[#a66a2f] transition duration-200 shadow-lg"
                              >
                                  Add Design
                              </button>

                        </div>

                  </div>
            </div>
      )
}

export default AddItem