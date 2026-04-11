import './App.css'
import HomePage from './components/home/HomePage'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
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
import MyOrders from './components/tailor/MyOrders.jsx'
import GetItemsInMyCity from './Hooks/GetItemsInmyCity.jsx'
import MyCart from './components/services/MyCart.jsx'

function App() {
  const {userData ,role} = useSelector((state) => state.user);
  let userdata ;
  if(userData !== null){
      userdata =userData?.role
  }
  else if(role !==null){
    userdata =role
  }


  GetCurrentUser();
  GetCurrentLocation();
  GetMyShop();
  GetShopInmyCity();
  GetItemsInMyCity();

  return (
   <BrowserRouter>
      {/* Popup only when not logged in */}
{/* 
      { !role || !userData && <Choose />} */}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={userData? <HomePage/> : <Login />} />
        <Route path="/signup" element={ <SignUp /> } />
        {/* 🔒 Protected Routes */}
        <Route
          path="/popular_tailor"
          element={
            <ProtectedRoute>
              <PopularTailor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tailor_details"
          element={
            <ProtectedRoute>
              <Detail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/custom_design"
          element={
            <ProtectedRoute>
              <CustomDesign />
            </ProtectedRoute>
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
                  <MyOrders/>
              </ProtectedRoute>
          }
         />

             <Route path='/my-cart'  
          element={
                <ProtectedRoute>
                  <MyCart/>
              </ProtectedRoute>
          }
         />

       
      </Routes>

      
    </BrowserRouter>


  )
}

export default App
