import React from 'react'
import { useSelector } from 'react-redux';
import UserItemCard from './UserItemCard';
import UserScrollCard from './UserScrollCard';
import { IoMdClose } from "react-icons/io";

const PopularTailorCard = ({ shop }) => {
  const userData = useSelector((state) => state.user.userData);
  const url = import.meta.env.VITE_SERVER_URL;
  const [fontendImage, setFrontendImage] = React.useState("");
  const [backendImage, setBackendImage] = React.useState("");
  const [selectedImage, setSelectedImage] = React.useState(null);

  const profileImage = fontendImage || backendImage;
   if (!shop?.items?.length) {
    return null;
  }
  
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFrontendImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  return (

    <div className='m-5 sm:w-full lg:w-1/2  md:w-full items-center border-b-2 border-gray-200 bg-gray-100 rounded-lg px-5 '>

      {shop.items?.length > 0 && (
        <>
          <h1 className='py-5 text-2xl font-semibold'> Boutique,<span className='font-semibold'> {shop?.name}</span></h1>
        </>
      )}


      {/* THIS IS FOR DISPLAYING SHOP AND SHOP OWNER IMAGES*/}
      {
        shop.items?.length > 0 && (
          <div className="w-80 bg-white rounded-xl shadow-md overflow-hidden mb-2">

            {/* Background Image */}
            <div className="h-32 w-full relative ">
              <img
                src={shop?.image}
                alt={shop?.name}
                className="w-full h-full object-cover"
              />

              {/* Profile Image (center + overlap) */}
              <div className="absolute left-1/2 transform -translate-x-1/2 translate-y-1/2 bottom-0" onClick={() => {
                userData?.role === "tailor" && handleImageChange();
              }}>
                <img
                  src={
                    shop?.owner?.image

                    || "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  className="w-20 h-20 rounded-full border-4 border-white object-cover"
                  onClick={() => setSelectedImage(shop?.owner?.image)} />
              </div>
            </div>
            {/* THIS IS DISPLAYING THE SELECTED IMAGE */}
            {selectedImage && (
              <div className='fixed inset-0 bg-black/80 flex items-center justify-center z-50 '>
                <img src={selectedImage} className='max-w-[80%] max-h-[60%] bg-gray-100' onClick={(e) => e.stopPropagation(null)} />

                <button className=' absolute top-5 right-5 text-white text-2xl font-bold' onClick={() => setSelectedImage(null)}><IoMdClose /></button>
              </div>
            )}


            {/* Content */}
            <div className="pt-12 text-center px-2 pb-2">
              <p className="text-sm text-gray-600 mt-1">
                {shop?.address}
              </p>

            </div>
          </div>

        )
      }

      {shop?.items?.length > 0 && <>

        <hr className='border-gray-500 mt-1' />
        <p className='text-xl font-bold py-3'>Stitch Your Favourite Design</p>
      </>
      }
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-5">
        {shop?.items?.map((item) => (
          <div key={item._id} className="min-w-0">
            <UserScrollCard item={item} />
          </div>
        ))}
      </div>
    </div>

  )
}

export default PopularTailorCard



