import { registerSocketUser,registerSocketOwner } from './socket.js'
import './App.css'
import HomePage from './components/home/HomePage'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Login } from './components/Login.jsx'
import SignUp from './components/Signup.jsx'
import 'react-toastify/dist/ReactToastify.css';
import PopularTailor from './components/services/PopularTailor'
import CustomDesign from './components/services/CustomDesign'
import Detail from './components/see details/Detail'
import GetCurrentUser from './Hooks/GetCurrentUser.jsx'
import GetCurrentLocation from './Hooks/GetCurrentLocation.jsx'
import { useSelector } from 'react-redux'
import Choose from './Choose.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import CreateEditShop from './components/tailor/CreateEditShop.jsx'
import CreateItem from './components/tailor/CreateItem.jsx'
import GetShopInmyCity from './Hooks/GetShopInmyCity.jsx'
import GetMyShop from './Hooks/GetMyShop.jsx'
import EditItem from './components/tailor/EditItem.jsx'
import MyOrdersHome from './components/tailor/MyOrdersHome.jsx'
import GetItemsInMyCity from './Hooks/GetItemsInmyCity.jsx'
import MyCart from './components/services/MyCart.jsx'
import CheckOut from './components/services/CheckOut.jsx'
import GetMyOrder from './Hooks/GetMyOrder.jsx'
import TrackOrder from './components/services/TrackOrder.jsx'
import { useState } from 'react'
import Navbar from './Navbar.jsx'
import ProductCard from './components/services/ProductCard.jsx'
import Footer from './Footer.jsx'
import io from 'socket.io-client';
import { useEffect } from 'react'
import EditAccount from './components/tailor/EditAccount.jsx'
import Setting from './components/tailor/Setting.jsx'

function App() {
  const { userData, role, isSearching, searchResults } = useSelector((state) => state.user);

  let userdata;
  if (userData !== null) {
    userdata = userData?.role
  }
  else if (role !== null) {
    userdata = role
  }
  GetCurrentUser();
  GetCurrentLocation();
  GetMyShop();
  GetShopInmyCity();
  GetItemsInMyCity();
  GetMyOrder()

  useEffect(() => {
    if (userData?._id) {
      registerSocketUser(userData._id);
    }
  }, [userData]);
 

  useEffect(() => {
    if (userData?._id) {
      registerSocketOwner(userData?._id);
    }
  }, [userData?._id]);



  return (
    <BrowserRouter>
      <div className='min-h-screen flex flex-col '>
        <Navbar />

        {isSearching && (
          <div className="absolute top-[90px] left-0 right-0 z-50 bg-gray-100 shadow-lg max-h-[80vh] overflow-y-auto mt-5">
            {searchResults.length > 0 ? (
              <div className="mt-5 flex justify-center gap-4 p-4 ">
                {searchResults.map((item) => (
                  <ProductCard key={item._id} item={item} />
                ))}
              </div>
            ) : (
              <p className="text-center py-6 text-gray-500">No results found</p>
            )}
          </div>
        )}

        <div className='flex-1'>

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={userData ? <HomePage /> : <Login />} />

            <Route path="/signup" element={<SignUp />} />
            {/* 🔒 Protected Routes */}
            <Route
              path="/popular_tailor"
              element={

                <PopularTailor />
              }
            />

            <Route
              path="/tailor_details"
              element={

                <Detail />

              }
            />

            <Route
              path="/custom_design"
              element={

                <CustomDesign />
              }
            />

            <Route
              path="/create-edit-shop"
              element={
                <ProtectedRoute>
                  <CreateEditShop />
                </ProtectedRoute>
              }
            />

            <Route
              path="/create-item"
              element={
                <ProtectedRoute>
                  <CreateItem />
                </ProtectedRoute>
              }
            />


            <Route
              path="/edit-item/:id"
              element={
                <ProtectedRoute>
                  <EditItem />
                </ProtectedRoute>
              }
            />

            <Route path='/my-orders'
              element={
                <ProtectedRoute>
                  <MyOrdersHome />
                </ProtectedRoute>
              }
            />

            <Route path='/my-cart'
              element={

                <MyCart />

              }
            />


            <Route path='/checkout'
              element={
                <ProtectedRoute>
                  <CheckOut />
                </ProtectedRoute>
              }
            />
            <Route path='/track-order/:id'
              element={
                <ProtectedRoute>
                  <TrackOrder />
                </ProtectedRoute>
              }
            />

            <Route path='/setting' element={
              <ProtectedRoute>
                <Setting/>
              </ProtectedRoute>
            }
            />

          </Routes>

        </div>
        <Footer />
      </div>

    </BrowserRouter>


  )
}

export default App
