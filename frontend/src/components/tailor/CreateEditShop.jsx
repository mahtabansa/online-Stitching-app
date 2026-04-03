import React from 'react'
import Navbar from '../../Navbar.jsx'
import { useState } from 'react'
import { Form, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { setMyShopData } from '../../redux/ownerSlice.js';
import { useDispatch } from 'react-redux';

const CreateEditShop = () => {
  const navigate = useNavigate();
  const {myShopData} = useSelector((state) => state.owner);
  const dispatch = useDispatch();

  const [name, setName] = useState(myShopData[0]?.name || "");
  const [state, setState] = useState(myShopData[0]?.state || "");
  const [city, setCity] = useState(myShopData[0]?.city || "");
  const [address, setAddress] = useState(myShopData[0]?.address || "");
  const [FrontendImage, setFrontendImage] = useState("" || myShopData[0]?.image || "");
  const [BackendImage, setBackendImage] = useState("");

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
    const formData = new FormData();
    formData.append("name", name);
    formData.append("state", state);
    formData.append("city", city);
    formData.append("address", address);
    console.log("formdata",formData);
    if (BackendImage) {
      formData.append("image", BackendImage);
    }

    try {
      const response =
      await axios.post("http://localhost:8000/api/shops/create-edit-shop", formData, { withCredentials: true });
      console.log("response", response);
      dispatch(setMyShopData(response.data));
      toast.success("Shop created/updated successfully!");
      navigate("/");
    }
    catch (err) {
      console.log("error in create shop controller", err);
      toast.error(err.response?.data?.message || "Error in creating shop", {
        position: "bottom-left",
      });
    }
  }
  return (
    <>
      <Navbar />
      <div className='flex flex-col items-center gap-5 mt-5'>
        <h1 className='text-3xl text-gray-600 '>Fill the valid shop details</h1>

        <form onSubmit={handleSubmit} className='bg-gray-100 h-120 w-100 rounded-lg shadow-2xl' >

          <div className=' px-5 '>
            <label htmlFor="text">Shop Name</label> <br />
            <input type='text' placeholder='Enter your shop name' name='name'
              className='w-80 p-2 border-1 rounded opacity-50' onChange={handleChange} value={name} required />
          </div>

          <div className='px-5'>
            <label htmlFor="image" className='block text-sm font-medium text-gray-900 mb-2'>Shop Image</label>
            <input type="file" placeholder='Enter your shop image' className='w-80 p-2 border-1 rounded opacity-50' accept="image/*" onChange={handleImage}  />
          </div>
          {FrontendImage &&

            <div className='px-5'>
              <img src={FrontendImage} alt="shop Restaurant Image" className='w-80 h-48 border rounded-lg object-cover ' />
            </div>
          }
          <div className=' px-5 py-3'>
            <label htmlFor="state" name='state'>Shop State</label> <br />
            <input type='text' placeholder='Enter your shop state' name='state'
              className='w-80 p-2 border-1 rounded opacity-50' onChange={handleChange} value={state} required />
          </div>

          <div className=' px-5 py-3'>
            <label htmlFor="city" name='city'>Shop City</label> <br />
            <input type='text' placeholder='Enter your shop city' name='city'
              className='w-80 p-2 border-1 rounded opacity-50' onChange={handleChange} value={city} required />
          </div>

          <div className=' px-5 py-3'>
            <label htmlFor="address" name='address'>Shop Address</label> <br />
            <input type='text' placeholder='Enter your shop complete address' name='address'
              className='w-80 p-2 border-1 rounded opacity-50' onChange={handleChange} value={address} required />
          </div>

          <div className='py-2'>
            <div className='flex justify-center pb-4' style={{ width: "100%" }}>
              <button type='submit' className='bg-blue-600 text-white px-4 py-2 rounded-md 
               flex justify-center align-center' onClick={handleSubmit}>Add now</button>
            </div>

          </div>
        </form>
      </div>
    </>
  )
}

export default CreateEditShop