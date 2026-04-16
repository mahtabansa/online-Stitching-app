import React from 'react'

const ChekOutItemCard = ({ item }) => {
      return (
            <div className="w-full flex justify-between  border border-gray-200 rounded-lg 
flex flex-col sm:flex-row gap-4 hover:shadow-md transition">

                  {/* Image */}
                  <div className=" h-32 flex-shrink-0 bg-gray-100">
                        <img
                              src={item?.image}
                              alt={item?.name}
                              className="w-full h-full object-contain"
                        />
                  </div>

                  {/* Content */}
                  <div className=" m-5 italic">

                        {/* Top Section */}


                        <h2 className="text-lg font-sm text-gray-800">
                              Design: {item?.name}
                        </h2>
                        <p className="text-lg font-sm text-gray-900">
                              Quantity: {item.quantity}
                        </p>

                        <p className="text-lg font-sm text-gray-900">
                              Price: ₹{item.price}
                        </p>



                  </div>

            </div>
      )
}

export default ChekOutItemCard