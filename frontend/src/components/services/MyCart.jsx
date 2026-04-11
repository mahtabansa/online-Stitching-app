import React from 'react'
import { useSelector } from 'react-redux'
import Navbar from '../../Navbar.jsx'
const MyCart = () => {
  const {ItemCard} = useSelector((state)=>state.user);
  console.log("ItemsCard",ItemCard);
      return (
            <>
             <Navbar/>
                  <div>
                    hello bro what are you doing 
                  </div>
            </>

      )
}

export default MyCart