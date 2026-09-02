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
      <div className="p-3 sm:p-5 flex justify-center">
        <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-3 w-full sm:w-auto">

          {/* All Orders */}
          <button
            className="
        flex items-center justify-center gap-2
        w-full sm:w-auto
        px-3 py-3 sm:px-5 sm:py-2.5
        rounded-xl
        bg-blue-500 text-white
        text-sm sm:text-base
        font-medium
        shadow-sm
        hover:bg-blue-600
        active:scale-95
        transition-all duration-200
      "
          >
            <i className="fa-solid fa-list-check"></i>
            <span>All Orders</span>
          </button>

          {/* Pending */}
          <button
            className="
        flex items-center justify-center gap-2
        w-full sm:w-auto
        px-3 py-3 sm:px-5 sm:py-2.5
        rounded-xl
        bg-yellow-500 text-white
        text-sm sm:text-base
        font-medium
        shadow-sm
        hover:bg-yellow-600
        active:scale-95
        transition-all duration-200
      "
          >
            <i className="fa-solid fa-clock"></i>
            <span>Pending</span>
          </button>

          {/* Completed */}
          <button
            className="
        flex items-center justify-center gap-2
        w-full sm:w-auto
        px-3 py-3 sm:px-5 sm:py-2.5
        rounded-xl
        bg-green-500 text-white
        text-sm sm:text-base
        font-medium
        shadow-sm
        hover:bg-green-600
        active:scale-95
        transition-all duration-200
      "
          >
            <i className="fa-solid fa-circle-check"></i>
            <span>Completed</span>
          </button>

          {/* Cancelled */}
          <button
            className="
        flex items-center justify-center gap-2
        w-full sm:w-auto
        px-3 py-3 sm:px-5 sm:py-2.5
        rounded-xl
        bg-red-500 text-white
        text-sm sm:text-base
        font-medium
        shadow-sm
        hover:bg-red-600
        active:scale-95
        transition-all duration-200
      "
          >
            <i className="fa-solid fa-circle-xmark"></i>
            <span>Cancelled</span>
          </button>

        </div>
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