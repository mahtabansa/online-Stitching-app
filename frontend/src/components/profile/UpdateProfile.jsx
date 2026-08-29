import React from 'react'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios'
import Loader from '../../pages/Loader.jsx';
import { useEffect } from 'react';
const UpdateProfile = () => {
  const {userData} = useSelector((state) => state.user)

  const [name, setName] = useState(userData?.name || "");
  const [phone, setPhone] = useState(userData?.phone || "");
  const [house, setHouse] = useState(userData?.address?.house || "");
  const [sector, setSector] = useState(userData?.address?.sector || "");
  const [area, setArea] = useState(userData?.address?.area || "");
  const [city, setCity] = useState(userData?.address?.city || "");
  const [state, setState] = useState(userData?.address?.state || "");
  
 
  const [loader, setLoading] = useState(false);
  const navigate = useNavigate();
  
const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
 

  formData.append("name", name);
  formData.append("phone", phone);
  formData.append("house", house);
  formData.append("sector", sector);
  formData.append("area", area);
  formData.append("city", city);
  formData.append("state", state);

  setLoading(true)
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/api/user/update-profile`,
      formData,
      {
        withCredentials: true,
      }
    );

    console.log(res.data);
    setLoading(false)
    toast.success("updated successfully")
    navigate('/profile')
  } catch (err) {
    toast.error();
    setLoading(false);
    console.log(err);
  }
};

  // useEffect(() => {
  //   console.log("Redux userData changed:", userData);
  // }, [userData]);

  return (

    <div className="bg-[#FEFEFE] min-h-[calc(100vh-4rem)] flex justify-center items-center py-5">

      <form
        onSubmit={handleSubmit}
        className="bg-gray-200 min-h-[500px] w-[400px] rounded-lg shadow-xl py-2"
      >

        <span
          onClick={() => navigate("/")}
          className="flex justify-end pr-4 pt-2 cursor-pointer"
        >
          <i className="fa-solid fa-xmark"></i>
        </span>

        <div className="px-5 py-3">
          <label htmlFor="name">Name</label>
          <br />

          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            name="name"
            className="w-full p-2 border rounded mt-1"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </div>

        <div className="px-5 py-3">
          <label htmlFor="phone">Phone</label>
          <br />

          <div className="flex items-center w-full border-2 border-gray-500 hover:border-gray-700 rounded mt-1">

            <span className="pl-3 pr-2 text-gray-500 font-medium select-none">
              +91
            </span>

            <input
              id="phone"
              type="tel"
              placeholder="Enter 10-digit number"
              name="phone"
              className="w-full p-2 outline-none rounded-r"
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
              required
              
            />

          </div>
        </div>

        <div className="px-5 py-3">
          <label htmlFor="house">House</label>
          <br />

          <input
            id="house"
            type="text"
            placeholder="eg:45-A, A-39"
            name="house"
            className="w-full p-2 border rounded mt-1"
            onChange={(e) => setHouse(e.target.value)}
            value={house}
            required
          />
        </div>

        <div className="px-5 py-3">
          <label htmlFor="sector">Sector</label>
          <br />

          <input
            id="sector"
            type="text"
            placeholder="eg: Sector-A, Sector-D"
            name="sector"
            className="w-full p-2 border rounded mt-1"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            required
          />
        </div>

        <div className="px-5 py-3">
          <label htmlFor="area">Area</label>
          <br />

          <input
            id="area"
            type="text"
            placeholder="eg: Indrapuri, Nehru Nagar"
            name="area"
            className="w-full p-2 border rounded mt-1"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            required
          />
        </div>

        <div className="px-5 py-3">
          <label htmlFor="state">State</label>
          <br />

          <input
            id="state"
            type="text"
            placeholder="eg: Delhi, Madhya Pradesh"
            name="state"
            className="w-full p-2 border rounded mt-1"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
        </div>

        <div className="px-5 py-3">
          <label htmlFor="city">City</label>
          <br />

          <input
            id="city"
            type="text"
            placeholder="eg: Bhopal, Gurgaon"
            name="city"
            className="w-full p-2 border rounded mt-1"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>

        <div className="py-3">
          <div className="flex justify-center pb-4">

            {loader ? (
              <div className="fixed inset-0 bg-[#FEFEFE] bg-opacity-40 flex justify-center items-center z-50">
                <Loader />
              </div>
            ) : (
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Update Profile
              </button>
            )}

          </div>
        </div>

      </form>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        theme="light"
      />

    </div>

  )
}

export default UpdateProfile