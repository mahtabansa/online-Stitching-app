import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from './redux/userSlice.js';
const serverurl = import.meta.env.VITE_SERVER_URL;
const Navbar = () => {
  const { userData, currentCity, currentState } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const handleLogout = async (e) => {

    const result = await axios.post(`${serverurl}/api/auth/logout`, {}, { withCredentials: true })
      .then(() => {
        dispatch(setUserData(null));
        navigate("/");
      })
      .catch(err => {
        console.error(err);
      });

    console.log("result", result);


  }
  const checkToken = () => {
    return !!document.cookie.split('; ').find(row => row.startsWith('token='));
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4" >
        <div className={`flex items-center h-16 ${userData?.role === "tailor" ? "justify-center gap-5":"justify-between"} `} >

          <div className="flex items-center gap-4">

            <h1 className="text-4xl font-bold text-[#111111]">

              <Link to='/'> <span className='opacity-75'>T</span><span className="text-[#B07A5A]">ailor</span></Link>
            </h1>

            {userData && userData.role === "customer" && (
              <div className="hidden md:flex flex-col text-sm leading-4 px-3">
                <span className="font-semibold">Tailor near by me</span>
                <span className="text-gray-500 py-1">{currentCity}, {currentState}</span>
              </div>
            )}

          </div>

          {userData && userData.role === "customer" && (
            <div className="hidden md:flex flex-1 mx-6">
              <input
                type="text"
                placeholder="what do you want to stitch?"
                className="w-full px-4 py-2 rounded-lg bg-gray-100 outline-none focus:ring-2 focus:ring-gray-400"
              />

            </div>
          )}
          <div className="hidden md:flex items-center gap-4">
            {
              userData ? <button className="font-medium" onClick={handleLogout} > {userData.role && userData.role==="tailor" ? "" : "log out"}</button> : <button className="font-medium" style={{ display: checkToken() ? 'none' : 'block' }} onClick={() => navigate('/login')}>Login</button>
            }


            <button className="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold" onClick={()=>navigate('/my-orders')}>
              🛒 My Order
            </button>
            {userData && userData.role==="tailor"?  <button className="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold" onClick={()=>navigate('/create-item')}>
               Add Item
            </button>:<button className="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold" onClick={()=>navigate('/create-item')}>
               My cart
            </button>}
         
          </div>

          {/* <button type='submit' className="md:hidden text-2xl" onClick={()=>navigate('/create-item')}>
            Add Item
          </button> */}

          <Link to='' >
            <button className="ml-5 text-gray-900 py-2 rounded-lg font-semibold" onClick={() => setOpen(true)}
            >
              Account
            </button>
          </Link>

          <div
            onClick={() => setOpen(false)}
            className={`fixed inset-0 bg-black/40 z-40 transition-opacity
        ${open ? "opacity-100 visible" : "opacity-0 invisible"}`}
          />


          {/* Right Sidebar */}
          <div
            className={`fixed top-0 right-0 h-1/2 w-72 bg-white z-50
        transform transition-transform duration-300 rounded-b-lg mt-1
        ${open ? "translate-x-0" : "translate-x-full"}`}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">My Account</h2>
              <button onClick={() => setOpen(false)}>✖</button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <p className="cursor-pointer hover:text-blue-600">{userData ? userData?.name?.toUpperCase() :""}</p>
              <p className="cursor-pointer hover:text-blue-600">Settings</p>
              <p className="cursor-pointer text-red-500" onClick={handleLogout}>Logout</p>
            </div>
          </div>
        </div>
      </div>

      <div id="mobileMenu" className="hidden md:hidden bg-white border-t">
        <div className="p-4 space-y-4">
          <input
            type="text"
            placeholder="Search for products"
            className="w-full px-4 py-2 rounded-lg bg-gray-100 outline-none"
          />

          <button className="block w-full text-left font-medium">Login</button>

          <button className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold">
            🛒 Cart
          </button>


        </div>
      </div>
    </nav>
  )
}

export default Navbar