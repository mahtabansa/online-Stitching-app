import React, { use } from 'react'
import Home from './Home'
import Hero from './Hero'
import Navbar from '../../Navbar'
import { useSelector } from 'react-redux'
import Tailordashboard from '../tailor/TailorDashboard.jsx'
import { useState } from 'react'
import ProductCard from '../services/ProductCard.jsx'
import ExpertTailor from '../Tailor Cards/ExpertTailor.jsx'
import HowWorks from '../../pages/HowWorks.jsx'

const HomePage = () => {
  const { userData, shopsInMyCity } = useSelector((state) => state.user || {})
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)


  return (
    <>

      <div className={isSearching ? 'pointer-events-none blur-sm ' : ''}>
        {userData?.role === 'tailor' ? (
          <>
            <h1 className="text-2xl text-center font-semibold mt-5">
              Welcome {userData?.name?.toUpperCase() || 'Tailor'}
            </h1>
            <Tailordashboard />
          </>
        ) : (
          <div className={`flex flex-col items-center  gap-4 `}>
            <Home />
            <Hero />
            <ExpertTailor />
            <HowWorks />
          </div>
        )}
      </div>
    </>
  )
}

export default HomePage
