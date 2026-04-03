import React, { Fragment } from 'react'
import AddShop from '../tailor/AddShop.jsx'
import AddItem from '../tailor/AddItem.jsx'
import { useSelector } from 'react-redux'
import ShopCard from '../tailor/ShopCard.jsx'
const TailorDashboard = () => {
  const { myShopData } = useSelector((state) => state.owner);
  const {userData} = useSelector((state)=>state.user);
  console.log("userDtta",userData);
  console.log("myShopData",myShopData);

  return (
    <div className='container mt-5 flex flex-col items-center gap-5 '>
      {!myShopData || myShopData.length === 0 ?    <>
      <p className='text-xl text-center  opacity-75'>Host your shop online and Add your new design </p>
          <AddShop className="w-full max-w-md border " /></>
        : <ShopCard className="mt-5" data={myShopData[0]} />
      }
      <AddItem />
    </div>

  )
}

export default TailorDashboard