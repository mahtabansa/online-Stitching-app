import React, { Fragment, useEffect } from 'react'
import AddShop from '../Tailor Cards/AddShop.jsx'
import AddItem from '../Tailor Cards/AddItem.jsx'
import { useDispatch, useSelector } from 'react-redux'
import ShopCard from '../Tailor Cards/ShopCard.jsx'
import CreateEditItem from './CreateItem.jsx'
import { ItemCard } from '../Tailor Cards/ItemCard.jsx'
import Footer from '../../Footer.jsx'
import { socket } from '../../socket.js'
import { updateMyshopData } from '../../redux/ownerSlice.js'
import { updateProfileImage } from '../../redux/userSlice.js'

const TailorDashboard = () => {
  const { myShopData } = useSelector((state) => state.owner);
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("createEditShop", (data) => {
      console.log("data coming from bakcend", data)
      dispatch(updateMyshopData({ shopId: data.shopId, shop: data.shop }))
    }),

      socket.on('updateOwnerProfileImage', (data) => {
        dispatch(updateProfileImage({ userId: data.user._id, user: data.user }));

        // shop ke andar bhi owner.image sync karo
        if (myShopData?.[0]?.owner?._id === data.user._id) {
          dispatch(updateMyshopData({
            shopId: myShopData[0]._id,
            shop: { owner: { ...myShopData[0].owner, image: data.user.image } }
          }));
        }
      });
  }, [])



  return (
    <div className='mt-5  gap-5 min-h-screen '>
      <div className='flex flex-col justify-center items-center '>
        {!myShopData || myShopData.length === 0 ? <>
          <p className='text-xl text-center  opacity-75'>Host your shop online and Add your new design </p>
          <AddShop className="w-full max-w-md border " /></>
          : <ShopCard className="mt-5" data={myShopData[0]} />
        }
      </div>

      <div className='flex flex-wrap justify-center items-center mt-5 '>
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

    </div>


  )
}

export default TailorDashboard