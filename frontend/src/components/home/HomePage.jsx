import React, { use } from 'react'
import Home from './Home'
import Hero from './Hero'
import Navbar from '../../Navbar'
import { useSelector } from 'react-redux'
import Tailordashboard from '../tailor/TailorDashboard.jsx'
import { useState } from 'react'
import ProductCard from '../services/ProductCard.jsx'
import ExpertTailor from '../Tailor Cards/ExpertTailor.jsx'

const HomePage = () => {
  const { userData, shopsInMyCity } = useSelector((state) => state.user || {})
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)


  return (
    <>

      {/* Floating search results — sirf jab search active ho */}
      {isSearching && (
        <div className=" absolute top-[70px] left-0 right-0 z-50 bg-white shadow-lg max-h-[80vh] overflow-y-auto min-h-screen">
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
              {searchResults.map((item) => (
                <ProductCard key={item._id} item={item} />
              ))}
            </div>
          ) : (
            <p className="text-center py-6 text-gray-500">No results found</p>
          )}
        </div>
      )}

      {/* Normal page — isSearching true hone par blur/dim kar sakte hain */}
      <div className={isSearching ? 'pointer-events-none blur-sm ' : ''}>
        {userData?.role === 'tailor' ? (
          <>
            <h1 className="text-2xl text-center font-semibold mt-5">
              Welcome {userData?.name?.toUpperCase() || 'Tailor'}
            </h1>
            <Tailordashboard />
          </>
        ) : (
          <div className="flex flex-col items-center  min-h-screen gap-5">
            <Home />
            <Hero />
           <ExpertTailor  />
        
          </div>
        )}
      </div>
    </>
  )
}

export default HomePage
