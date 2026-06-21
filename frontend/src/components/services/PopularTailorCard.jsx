import React from 'react'
import { useSelector } from 'react-redux';
import UserItemCard from './UserItemCard';
import UserScrollCard from './UserScrollCard';


const PopularTailorCard = ({ shop }) => {
  const userData = useSelector((state) => state.user.userData);
  console.log("shop in tailor card", shop);
  console.log("userData", userData);
  const url = import.meta.env.VITE_SERVER_URL;

  const [fontendImage, setFrontendImage] = React.useState("");
  const [backendImage, setBackendImage] = React.useState("");

  const profileImage = fontendImage || backendImage;

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

    <div className=' sm:w-full lg:w-1/2  md:w-full items-center border-b-2 border-gray-200 bg-gray-100 rounded-lg p-5 shadow-md'>
      <h1 className='pb-2 text-2xl font-semibold'> Boutique,<span className='font-semibold'> {shop?.name}</span></h1>
    
      <div className="w-80 bg-white rounded-xl shadow-md overflow-hidden">

        {/* Background Image */}
        <div className="h-32 w-full relative">
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
            />
          </div>
        </div>

        {/* Content */}
        <div className="pt-12 text-center px-2 pb-2">
         

          <p className="text-sm text-gray-600 mt-1">
            {shop?.address}
          </p>

        </div>

      </div>
      <hr className='border-gray-500 mt-1' />
      <p className='text-xl font-bold py-3'>Stitch Your Favourite Design</p>
      <div className='flex flex-wrap py-5 gap-5'>{shop?.items?.map((item) => (
            <div key={item._id}>
                <UserScrollCard item={item} />
            </div>
      ))}</div>
    </div>

  )
}

export default PopularTailorCard



