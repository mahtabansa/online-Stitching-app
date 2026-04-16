import React, { useState } from 'react'
import Navbar from '../../Navbar.jsx'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setMyShopData } from '../../redux/ownerSlice.js';
import {useNavigate} from 'react-router'
import { IoArrowBack } from "react-icons/io5";
import { ClipLoader } from "react-spinners";

const CreateItem = () => {
      const { myShopData } = useSelector((state) => state.owner);
      console.log("myShopData[0]?.owner?._id",myShopData[0]?._id)
      console.log("myshopData",myShopData)
     const dispatch = useDispatch();
     const navigate = useNavigate();
      const [loading,setLoading] = useState(false);
      const [FrontendImage, setFrontendImage] = React.useState(null);
      const [preview, setPreview] = useState(null);
      const [name, setName] = React.useState("");
      const [description, setDescription] = React.useState("");
      const [price, setPrice] = React.useState("");

      const handleChange = (e) => {
          
            const { name, value } = e.target;
           
            if (name === "name") {
                  setName(value);
            } else if (name === "description") {
                  setDescription(value);
                   e.target.style.height = "auto"
                  e.target.style.height = e.target.scrollHeight + "px"
            } else if (name === "price") {
                  setPrice(value);
            }

      }

      const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading(true)
            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            formData.append("price", price);
           
            if (FrontendImage) {
                  formData.append("image", FrontendImage);
            }

            try {
                  const url = import.meta.env.VITE_SERVER_URL;
                  console.log("FORM DATA",formData);
                  const response = await axios.post(`${url}/api/items/create-item`, formData, { withCredentials: true })

                  console.log("response", response.data)
                   setLoading(false);
                  dispatch(setMyShopData(response.data))
                  navigate('/')
            } catch (err) {
                  console.log(`errror while addig Items ${err}`);
            }
      }
      const handleImage = (e) => {
            try {
                  const file = e.target.files[0];

                  if (!file) return;
                  setFrontendImage(file);
                  const reader = new FileReader();
                  reader.onloadend = () => {
                        setPreview(reader.result);
                  };
                  reader.readAsDataURL(file);

            } catch (err) {
                  console.error("Error occurred while handling image:", err);
            }
      }

      return (
            <>
                  <Navbar />
                  <div className='flex flex-col items-center gap-5 mt-5 relative'>
                        <div className='absolute top-5 left-5 text-2xl text-gray-800' onClick={()=>navigate(-1)}><IoArrowBack/></div>
                        <h1 className='text-3xl text-gray-600 '>Fill the all details</h1>

                        <form onSubmit={handleSubmit} className='bg-gray-100 h-120 w-100 rounded-lg shadow-2xl' >

                              <div className=' px-5 mt-5'>
                                    <label htmlFor="text">Design Name</label> <br />
                                    <input type='text' placeholder='Design name' name='name'
                                          className='w-80 p-2 border-1 rounded opacity-50' onChange={handleChange} value={name} required />
                              </div>

                              <div className='px-5'>
                                    <label htmlFor="image" className='block text-sm font-medium text-gray-900 mb-2'>Design Image</label>
                                    <input type="file" placeholder='upload your design image' className='w-80 p-2 border-1 rounded opacity-50' accept="image/*" onChange={handleImage} />
                              </div>
                              {preview &&
                                    (
                                          <div className='px-5'>
                                                <img
                                                      src={preview}
                                                      alt="preview"
                                                      className='w-80 h-[60%] border rounded-lg object-cover'
                                                />
                                          </div>
                                    )
                              }

                        

                              <div className=' px-5 py-3'>
                                    <label htmlFor="state" name='description'>Description</label> <br />
                                    <textarea type='text' placeholder='Enter a brief description of your design' name='description'
                                          className='w-80 p-2 border-1 rounded opacity-50' onChange={handleChange} value={description} required />
                              </div>

                              <div className=' px-5 py-3'>
                                    <label htmlFor="city" name='price'>Stiching Price </label> <br />
                                    <input type='number' placeholder='Enter your stiching price' name='price'
                                          className='w-80 p-2 border-1 rounded opacity-50' onChange={handleChange} value={price} required />
                              </div>

                              <div className='py-2'>
                                    <div className='flex justify-center pb-4' style={{ width: "100%" }}>
                                          <button type='submit' className='bg-blue-600 text-white px-4 py-2 rounded-md 
               flex justify-center align-center' onClick={handleSubmit} >{loading? <ClipLoader className=' w-full text-blue-600'/>:"Add Item" }</button>
                                    </div>

                              </div>
                        </form>
                  </div>
            </>
      )
}

export default CreateItem