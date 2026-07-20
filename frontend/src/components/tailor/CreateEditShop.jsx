import React, { useEffect } from 'react'
import Navbar from '../../Navbar.jsx'
import { useState } from 'react'
import { data, Form, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { setMyShopData, updateMyshopData } from '../../redux/ownerSlice.js';
import { useDispatch } from 'react-redux';
import { IoMdArrowBack } from "react-icons/io";
import { ClipLoader } from 'react-spinners'
import { socket } from '../../socket.js'


const CreateEditShop = () => {
  const navigate = useNavigate();
  const { myShopData } = useSelector((state) => state.owner);
  const dispatch = useDispatch();

  const [name, setName] = useState(myShopData[0]?.name || "");
  const [state, setState] = useState(myShopData[0]?.state || "");
  const [city, setCity] = useState(myShopData[0]?.city || "");
  const [address, setAddress] = useState(myShopData[0]?.address || "");
  const [FrontendImage, setFrontendImage] = useState(myShopData[0]?.image || "");
  const [BackendImage, setBackendImage] = useState(myShopData[0]?.image || "");
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    if (name === "name") setName(value);
    else if (name === "state") setState(value);
    else if (name === "city") setCity(value);
    else if (name === "address") setAddress(value);

  }

  const handleImage = (e) => {
    try {
      const file = e.target.files[0];
      console.log(file)
      if (!file) return;

      setBackendImage(file);

      setFrontendImage(URL.createObjectURL(file));
      console.log("BackendImage:", BackendImage);
    } catch (err) {
      console.log("handle image is not working");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);   // ✅ sabse pehle, taaki validation fail hone par bhi errors dikhein

    if (!name.trim() || !state.trim() || !city.trim() || !address.trim()) {
      toast.error("Please fill all required fields", { position: "bottom-left" });
      return;
    }
    if (!BackendImage) {
      toast.error("Shop image is required", { position: "bottom-left" });
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("state", state.trim());
    formData.append("city", city.trim());
    formData.append("address", address.trim());
    formData.append("image", BackendImage);

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/shops/create-edit-shop`,
        formData,
        { withCredentials: true }
      );
      dispatch(updateMyshopData({
        shopId: response.data._id,
        shop: response.data,
        created: response.data.owner.isShopCreated,
      }));
      navigate("/");
    } catch (err) {
      console.log("error in create shop controller", err);
      const msg = err.response?.data?.message || "Error in creating shop";
      setError(msg);
      toast.error(msg, { position: "bottom-left" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>

      <div className='flex  flex-col items-center gap-3 mt-5 min-h-screen'>
        <div className='flex justify-start gap-4'>

          <button
            className='text-xl md:text-lg lg:text-2xl  text-gray-900 cursor-pointer px-2'
            onClick={() => navigate("/")}
          >
            <IoMdArrowBack />
          </button>
          <span className='text-xl md:text-lg lg:text-2xl  text-gray-600 lg:py-4'>
            Fill the valid shop details</span>

        </div>


        <form onSubmit={handleSubmit} className='flex  flex-col items-center  bg-gray-100  rounded-lg shadow-2xl' >

          <div className='px-5 '>
            <label htmlFor="text">Shop Name</label> <br />
            <input type='text' placeholder='Enter your shop name' name='name'
              className='w-80 p-2 border-1 rounded  opacity-100 mt-1' onChange={handleChange} value={name} />
          </div>
          {isSubmitted && !name && <p className='text-red-600 text-center font-semibold'>shop is  required</p>}

          <div className='px-5 py-2'>
            <label htmlFor="image" className='block text-sm font-medium text-gray-900 '>Shop Image</label>
            <input type="file" placeholder='Enter your shop image' className='w-80 p-2 border-1 rounded  opacity-100 mt-1' accept="image/*" onChange={handleImage} />
          </div>

          {FrontendImage &&

            <div className='px-5'>
              <img src={FrontendImage} alt="shop Restaurant Image" className='w-80 h-48 border rounded-lg object-cover ' />
            </div>
          }
          {isSubmitted && !FrontendImage && !BackendImage && (
            <p className='text-red-600 text-center font-semibold'>shop image is required</p>
          )}      {isSubmitted && !FrontendImage && BackendImage && <p className='text-red-600 text-center font-semibold'>shop image is required</p>}

          <div className=' px-5 py-3'>
            <label htmlFor="state" name='state'>Shop State</label> <br />
            <input type='text' placeholder='Enter your shop state' name='state'
              className='w-80 p-2 border-1 rounded  opacity-100 mt-1' onChange={handleChange} value={state} />
          </div>
          {isSubmitted && !state && <p className='text-red-600 text-center font-semibold'> state is required</p>}

          <div className=' px-5 py-3'>
            <label htmlFor="city" name='city'>Shop City</label> <br />
            <input type='text' placeholder='Enter your shop city' name='city'
              className='w-80 p-2 border-1 rounded  opacity-100 mt-1' onChange={handleChange} value={city} />
          </div>
          {isSubmitted && !city && <p className='text-red-600 text-center font-semibold'> city is required</p>}

          <div className=' px-5 py-3'>
            <label htmlFor="address" name='address'>Shop Address</label> <br />
            <textarea type='text' placeholder='Enter your shop complete address' name='address'
              className='w-80 p-2 border-1 rounded  opacity-100 mt-1 ' onChange={handleChange} value={address} />
          </div>
          {isSubmitted && !address && <p className='text-red-600 text-center font-semibold'> address is required </p>}

          <div className='py-2'>
            <div className='flex justify-center pb-4' style={{ width: "100%" }}>
              {loading ? <ClipLoader className='text-white font-semibold' /> : <button type='submit' className='bg-blue-600 text-white px-4 py-2 rounded-md 
               flex justify-center align-center' >Add now</button>}

            </div>
          </div>
        </form>

      </div>
    </>
  )
}

export default CreateEditShop