import { registerSocketUser, registerSocketOwner } from './socket.js';
import './App.css';
import HomePage from './components/home/HomePage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from './components/Login.jsx';
import SignUp from './components/Signup.jsx';
import 'react-toastify/dist/ReactToastify.css';
import PopularTailor from './components/services/PopularTailor';
import CustomDesign from './components/services/CustomDesign';
import Details from './components/see details/Details.jsx';
import GetCurrentUser from './Hooks/GetCurrentUser.jsx';
import GetCurrentLocation from './Hooks/GetCurrentLocation.jsx';
import { useSelector } from 'react-redux';
import ProtectedRoute from './ProtectedRoute.jsx';
import CreateEditShop from './components/tailor/CreateEditShop.jsx';
import CreateItem from './components/tailor/CreateItem.jsx';
import GetShopInmyCity from './Hooks/GetShopInmyCity.jsx';
import GetMyShop from './Hooks/GetMyShop.jsx';
import EditItem from './components/tailor/EditItem.jsx';
import MyOrdersHome from './components/tailor/MyOrdersHome.jsx';
import GetItemsInMyCity from './Hooks/GetItemsInmyCity.jsx';
import MyCart from './components/services/MyCart.jsx';
import CheckOut from './components/services/CheckOut.jsx';
import GetMyOrder from './Hooks/GetMyOrder.jsx';
import TrackOrder from './components/services/TrackOrder.jsx';
import Navbar from './Navbar.jsx';
import ProductCard from './components/services/ProductCard.jsx';
import Footer from './Footer.jsx'
import { useEffect } from 'react';
import Profile from './components/profile/Profile.jsx';
import UpdateProfile from './components/profile/UpdateProfile.jsx';
import FetchAllItem from './Hooks/FetchAllItem.jsx';
import FetchAllshops from './Hooks/FetchAllshops.jsx';

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
  GetMyOrder();
  FetchAllItem();
  FetchAllshops();

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
  
          <div className='absolute top-[200px] left-0 right-0 z-50 bg-[#e6dcca] shadow-lg max-h-[80vh] overflow-y-auto min-h-screen '>

            {searchResults.length > 0 ? (

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4 mt-5 z-0 ">

                {searchResults.map((item) => (
                  <div key={item._id} className="w-full min-w-0">
                    <ProductCard item={item} />
                  </div>
                ))}

              </div>

            ) : (
              <p className="text-center py-6 text-gray-500">
                No results found
              </p>
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
              path="/item/:id"
              element={

                <Details />

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

            <Route path='/profile' element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
            />

              <Route path='/update-profile' element={
              <ProtectedRoute>
                <UpdateProfile />
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

export default App;
