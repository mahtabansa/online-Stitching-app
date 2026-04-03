// import React from 'react'
// import { FaRegEdit } from "react-icons/fa";
// import { useNavigate } from 'react-router-dom';
// const ShopCard = ({data}) => {
//   const navigate = useNavigate();

//   return (
//     <div className="w-full max-w-3xl flex justify-center items-center p-4 
//                          bg-white   rounded-md 
//                          transition-shadow duration-200 relative">

//            <img src={data.image} alt={data.name} className="w-full h-70 object-cover rounded-md" />
//            <div className="absolute top-7 right-7" onClick={()=>navigate(`/create-edit-shop`)}>
//              <FaRegEdit className=" text-3xl sm:text-2xl text-gray-800 hover:text-blue-800 cursor-pointer" />
//            </div>
//            <p className=" text-2xl font-semibold text-[#16161A] absolute text-center w-full bottom-10 left-0">
//              {data.name.toUpperCase()}
//            </p>

//     </div>
//   )
// }

// export default ShopCard


import React, { useState } from 'react'
import { FaRegEdit } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const ShopCard = ({ data }) => {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.userData);
  console.log("userData", userData);
  console.log("shop in shop card", data);
  const url = import.meta.env.VITE_SERVER_URL;

  const [profileImage, setProfileImage] = useState(data?.ownerImage || null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // ✅ size validation
    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2MB");
      return;
    }

    // ✅ preview
    const imageUrl = URL.createObjectURL(file);
    setProfileImage(imageUrl);

    // ✅ upload immediately
    await uploadImageToServer(file);
  };

  const uploadImageToServer = async (file) => {
    const formData = new FormData();

    // ⚠️ backend me "image" expect ho raha hai
    formData.append("image", file);

    try {
      const response = await axios.post(
        `${url}/api/auth/add-image`,
        formData,
        {
          withCredentials: true
        }
      );

      console.log("response", response.data);

    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  return (
    <div className="w-full max-w-3xl bg-white rounded-xl shadow-md overflow-hidden relative">

      {/* 🔹 Background Image */}
      <div className="relative h-56 w-full">
        <img
          src={data?.image}
          alt={data?.name}
          className="w-full h-full object-cover"
        />

        {/* ✏️ Edit Button */}
        <div
          className="absolute top-4 right-4"
          onClick={() => navigate(`/create-edit-shop`)}
        >
          <FaRegEdit className="text-2xl text-gray-800 hover:text-blue-800 cursor-pointer" />
        </div>

        {/* 👤 Profile Image (Center Overlap) */}
        <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2">

          <img
            src={
            data?.owner?.image ||  profileImage ||
              `${userData?.shop?.image.replace(/\\/g, "/")}`
            }
            alt="owner"
            className="w-30 h-30 rounded-full border-4 border-white object-cover cursor-pointer"
            onClick={() => document.getElementById("fileInput").click()}
          />

          {/* 📂 Hidden Input */}
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />

        </div>
      </div>

      {/* 🔹 Content */}
      <div className="pt-15 pb-6 text-center px-4">
        <p className="text-2xl font-semibold text-[#16161A]">
          {data.name.toUpperCase()}
        </p>
      </div>

    </div>
  );
};

export default ShopCard;