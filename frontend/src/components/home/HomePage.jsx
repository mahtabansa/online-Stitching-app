import React, { use } from 'react'
import Home from './Home'
import Hero from './Hero'
import Navbar from '../../Navbar'
import Footer from '../../Footer'
import { useSelector } from 'react-redux'
import Tailordashboard from '../tailor/TailorDashboard.jsx'
const HomePage = () => {
  const { userData, role } = useSelector((state) => state.user || "");

  return (
    <>
      <Navbar />
      {
        userData?.role === "tailor" ? <>

          <h1 className='text-2xl text-center font-semibold mt-5'>Welcome {userData ? userData?.name?.toUpperCase() : 'Tailor'} </h1>
          <Tailordashboard />

        </> : <>
          <Home />
          <Hero />
          {/* <Footer /> */}

        </>

      }


    </>
  )
}

export default HomePage
