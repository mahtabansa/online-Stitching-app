import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData, setIsSearching, setSearchResults } from './redux/userSlice.js';
import { RxHamburgerMenu } from "react-icons/rx";
import { CiSearch } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";


const Navbar = () => {
  const { userData, currentCity, currentState, ItemCard, searchResults } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [SearchedItem, setSearchItem] = useState("");

  const controllerRef = useRef(null);

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/logout`, {}, { withCredentials: true });
      dispatch(setUserData(null));
      navigate("/");
      setOpen(false)
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }

  const handleSearch = async (query) => {
    if (controllerRef.current) controllerRef.current.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const result = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/items/search-item`,
        {
          params: { query, city: currentCity },
          withCredentials: true,
          signal: controller.signal,
        }
      );
      dispatch(setSearchResults(result.data.searchResults || []));

    } catch (err) {
      if (axios.isCancel(err) || err.name === 'CanceledError') return;
      console.error("Search failed:", err);
      dispatch(setSearchResults([]));
    }
  }
  const handleRemoveQuery = async () => {

    if (SearchedItem.trim()) {
      dispatch(setIsSearching(false));
      setSearchItem('')

    }
  }

  useEffect(() => {
    if (!SearchedItem.trim()) {
      dispatch(setIsSearching(false));
      dispatch(setSearchResults([]));
      return;
    }

    dispatch(setIsSearching(true));

    const timer = setTimeout(() => {
      handleSearch(SearchedItem);
    }, 400);

    return () => clearTimeout(timer);
  }, [SearchedItem, currentCity]);

  useEffect(() => {
    return () => {
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, []);

  const handleSearchIconClick = () => {
    if (SearchedItem.trim()) {
      dispatch(setIsSearching(true));
      handleSearch(SearchedItem);

    }
  }


  return (
    <nav className="bg-white shadow sticky top-0 z-50 ">
      <div className="max-w-6xl mx-auto px-4" >
        <div className={`flex items-center h-16 ${userData?.role === "tailor" ? "justify-between gap-5" : "justify-between"} `} >
          {/* This is side Tailor Name */}
          <div className="flex items-center  gap-4">
            <h1 className="text-3xl md:text-4xl font-bold text-[#111111]">
              <Link to='/'> <span className='opacity-75'>T</span><span className="text-[#B07A5A]">ailor</span></Link>
            </h1>

            <div className="hidden lg:flex flex-col justify-center text-sm px-3">
              <span className="font-semibold">Tailor near by me</span>
              <span className="text-gray-500 py-1">{currentCity}, {currentState}</span>
            </div>
          </div>

          {/* search bar for items  */}

          {
            userData && userData.role === "tailor" ? null : <div className="hidden md:flex items-center flex-1 mx-6">
              <div className="flex items-center w-full bg-gray-200 rounded-lg overflow-hidden">
                <input
                  type="text"
                  placeholder="What do you want to stitch?"
                  className="flex-1 px-4 py-3 bg-transparent outline-none cursor-pointer"
                  required
                  value={SearchedItem}
                  onChange={(e) => setSearchItem(e.target.value)}
                />


                {
                  searchResults.length.toString() > 0 ? <button className="bg-gray-200 text-black cursor-pointer" onClick={handleRemoveQuery}>
                    <RxCross2 className="text-xl" />
                  </button> : null
                }
                <button className="p-2 text-gray-600 hover:text-black cursor-pointer" onClick={handleSearchIconClick}>
                  <CiSearch className="text-2xl" />
                </button>

              </div>
            </div>

          }



          <div className="hidden md:flex lg:flex items-center gap-4 relative">
            {
              userData ? <button className=" font-medium cursor-pointer" onClick={handleLogout} > {userData.role && userData.role === "tailor" ? "log out" : "log out"}</button> :

                <button className="font-medium cursor-pointer" style={{ display: userData ? 'none' : 'block' }} onClick={() => navigate('/login')}>Login</button>
            }

            {userData && userData?.role === "tailor" ? 
              <div className='flex gap-5'>
                <button className="bg-gray-500 text-white px-3 py-2 rounded-lg font-semibold cursor-pointer" onClick={() => navigate('/my-orders')}>
                  🛒 My Order
                </button>
                <button className="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold cursor-pointer" onClick={() => navigate('/create-item')}>
                  Add Item
                </button>

                <button className="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold cursor-pointer " onClick={() => { navigate('/profile'), setOpen(false) }}>
                  Account
                </button>


              </div> :
              <div className='flex justify-center gap-3'>
                <div className='flex justify-center items-center align-items gap-3' >
                  {
                    userData ? <button className="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold gap-3 cursor-pointer " onClick={() => navigate('/my-orders')}>
                      My Order
                    </button> : null
                  }

                  <div className='relaitve flex items-center justify-center '>
                    <button className="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold cursor-pointer" onClick={() => navigate('/my-cart')}>
                      My cart
                    </button>
                    <span className='bg-[#baccbf] rounded-xl absolute w-[20px] h-[20px] text-black -top-2 -right-1 items-center pl-1'>{ItemCard?.length}</span>
                  </div>

                </div>

              </div>

            }

          </div>
          {userData?.role === 'tailor' ? "" :
            <button className="ml-3 bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold cursor-pointer hidden md:block lg:block xl:block" onClick={() => navigate('/profile')}>
              Profile
            </button>
          }



          {/* for User Only */}
          <div className="flex items-center ">
            <div className='relative sm:block md:hidden lg:hidden xl:hidden'>
              {userData?.role === "customer" ? <> <button className=" bg-gray-500 text-white px-4 py-2 rounded-lg text-sm cursor-pointer" onClick={() => navigate('/my-cart')}>
                My cart
              </button>
                <button >
                  <span className='bg-[#baccbf] rounded-xl absolute w-[20px] h-[20px] text-black -top-2 -right-1 items-center '>{ItemCard?.length}</span>
                </button></> : <>
                <button className=" bg-gray-500 text-white px-4 py-2 rounded-lg text-sm cursor-pointer" onClick={() => navigate('/my-orders')}>
                  My Orders
                </button>
                <button >
                  <span className='bg-[#baccbf] rounded-xl absolute w-[20px] h-[20px] text-black -top-2 -right-1 items-center '>{ItemCard?.length}</span>
                </button>
              </>}

            </div>


            {/* Mobile */}
            <button
              className="ml-5 text-gray-900 py-2 rounded-lg font-semibold md:hidden cursor-pointer"
              onClick={() => setOpen(true)}
            >
              <RxHamburgerMenu size={24} />
            </button>
          </div>


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
              <h2 className="text-lg font-semibold">{ }My Account</h2>
              <button className='cursor-pointer' onClick={() => setOpen(false)}>✖</button>
            </div>

            {/* Content */}
            <div className="flex flex-col p-4 space-y-3">
              <p className="cursor-pointer hover:text-gray-600 font-semibold " onClick={() => { navigate('/'), setOpen(false) }} >{userData ? userData?.name?.toUpperCase() : ""}</p>
              <div>
                <button className="cursor-pointer hover:text-gray-600 font-semibold " onClick={() => { navigate('/profile'), setOpen(false) }}>
                  Profile
                </button>
              </div>

              <div>
                <button className="cursor-pointer hover:text-gray-600 font-semibold  " onClick={() => { navigate('/my-orders'), setOpen(false) }}>
                  My Order
                </button>
              </div>

              <div>
                {userData ? <button className='cursor-pointer text-red-500 hover:text-red-400 font-semibold' onClick={handleLogout}>Logout</button> : <button className='cursor-pointer text-red-500 hover:text-red-400 font-semibold' onClick={() => { navigate('/login'), setOpen(false) }}>Login</button>}

              </div>

            </div>
          </div>
        </div>
      </div>



      {userData && userData.role === "tailor" ? null : (

        <div className="md:hidden lg:hidden flex-2 mx-6 mb-4">
          <div className="flex items-center w-full bg-gray-200 rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="What do you want to stitch?"
              className="flex-1 px-4 py-3 bg-transparent outline-none"
              required
              value={SearchedItem}
              onChange={(e) => setSearchItem(e.target.value)}
            />
            {
              searchResults.length.toString() > 0 ? <button className="bg-gray-200 text-black cursor-pointer" onClick={handleRemoveQuery}>
                <RxCross2 className="text-xl" />
              </button> : null
            }

            <button className="px-4  font-bold text-gray-600 hover:text-black" onClick={handleSearchIconClick}>
              <CiSearch className="text-2xl" />
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar