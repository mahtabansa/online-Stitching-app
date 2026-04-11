import React, { Fragment, useEffect } from 'react'
import AddShop from '../Tailor Cards/AddShop.jsx'
import AddItem from '../Tailor Cards/AddItem.jsx'
import { useSelector } from 'react-redux'
import ShopCard from '../Tailor Cards/ShopCard.jsx'
import CreateEditItem from './CreateItem.jsx'
import { ItemCard } from '../Tailor Cards/ItemCard.jsx'
import Footer from '../../Footer.jsx'
const TailorDashboard = () => {
  const { myShopData } = useSelector((state) => state.owner);
  const { userData } = useSelector((state) => state.user);
  console.log("userDtta", userData);
  console.log("myShopData in tailordash", myShopData);

  useEffect(()=>{
    
  })

  return (
    <div className='container mt-5  gap-5 '>
      <div className='flex flex-col justify-center items-center '>
          {!myShopData || myShopData.length === 0 ? <>
        <p className='text-xl text-center  opacity-75'>Host your shop online and Add your new design </p>
        <AddShop className="w-full max-w-md border " /></>
        : <ShopCard className="mt-5" data={myShopData[0]} />
      }
      </div>
      
        
    <div className='flex flex-wrap justify-center items-center mt-5'>
  {
    userData && myShopData && myShopData[0]?.items?.length > 0 ? (
      myShopData[0].items.map((design) => (
        <ItemCard data={design} key={design._id} />
      ))
    ) : (
      <AddItem />
    )
  }
</div>
        {/* <Footer /> */}
     </div>
  

  )
}

export default TailorDashboard