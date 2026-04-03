import React from 'react'
import { useSelector } from 'react-redux';
import dummyImage from '../../assets/dummy_pic.jpg';


const PopularTailorCard = ({shop}) => {
  const userData = useSelector((state)=>state.user.userData);
  console.log("userData",userData);
  const url = import.meta.env.VITE_SERVER_URL;
  console.log("shop", shop);
  const [fontendImage, setFrontendImage] = React.useState("");
  const [backendImage,setBackendImage] = React.useState("");
 
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
  return(
<div className="w-80 bg-white rounded-xl shadow-md overflow-hidden">

  {/* Background Image */}
  <div className="h-32 w-full relative">
    <img
      src={shop?.image}
      alt={shop?.name}
      className="w-full h-full object-cover"
    />

    {/* Profile Image (center + overlap) */}
    <div className="absolute left-1/2 transform -translate-x-1/2 translate-y-1/2 bottom-0" onClick={handleImageChange}>
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
  <div className="pt-12 text-center px-4 pb-4">
    <p className="text-lg font-semibold">
      Boutique, {shop?.name}
    </p>

    <p className="text-sm text-gray-600 mt-1">
      {shop?.address}
    </p>
  </div>

</div>

  )
}

export default PopularTailorCard