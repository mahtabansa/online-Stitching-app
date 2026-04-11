import React, { useEffect, useState } from 'react'
import Navbar from '../../Navbar.jsx'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setMyShopData } from '../../redux/ownerSlice.js';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from "react-icons/io5";

const EditItem = () => {
       const {id} = useParams();
      const { myShopData } = useSelector((state) => state.owner);
     const dispatch = useDispatch();
      const [FrontendImage, setFrontendImage] = React.useState(null);
      const [preview, setPreview] = useState(null);
      const [name, setName] = React.useState("");
      const [description, setDescription] = React.useState("");
      const [price, setPrice] = React.useState("");
      const navigate = useNavigate();
      const item = myShopData?.[0]?.items?.find((i) => i._id === id);
   

      const handleChange = (e) => {
            console.log("event", e);
            const { name, value } = e.target;
            // Handle input change logic here (e.g., update state)
            if (name === "name") {
                  setName(value);
            } else if (name === "description") {

                  setDescription(value);
                  e.target.style.height = "auto"
                  e.target.style.height = e.target.scrollHeight +  "px";
            } else if (name === "price") {
                  setPrice(value);
            }

      }

      const handleSubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            formData.append("price", price);
            formData.append("shopId",myShopData[0]?.owner?._id)
            if (FrontendImage) {
                  formData.append("image", FrontendImage);
            }

            try {
                  const url = import.meta.env.VITE_SERVER_URL;
                  console.log("FORM DATA",formData);
                  const response = await axios.post(`${url}/api/items/edit-item/${id}`, formData, { withCredentials: true })

                  console.log("response", response.data)
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

      useEffect(()=>{
            if(item){
                  setName(item?.name)
                  setDescription(item?.description);
                  setPreview(item?.image);
                  setPrice(item?.price)
            }
      },[id])

      return (
            <>
                  <Navbar />
                  <div className='flex flex-col items-center gap-5 mt-5  relative'>
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
                                          <div className='px-5 '>
                                                <img
                                                      src={preview}
                                                      alt="preview"
                                                      className='w-80 h-full border rounded-lg object-cover'
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
               flex justify-center align-center' onClick={handleSubmit}>Update Item</button>
                                    </div>

                              </div>
                        </form>
                  </div>
            </>
      )
}

export default EditItem