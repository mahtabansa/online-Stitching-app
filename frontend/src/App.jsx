import './App.css'
import HomePage from './components/home/HomePage'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import SignUp from './components/Signup'
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
import CreateEditItem from './components/tailor/CreateEditItem.jsx'
import GetShopInmyCity from './Hooks/GetShopInmyCity.jsx'
import GetMyShop from './Hooks/GetMyShop.jsx'


function App() {
  const userData = useSelector((state) => state.user.userData);

  GetCurrentUser();
  GetCurrentLocation();
  GetMyShop();
  GetShopInmyCity();

  return (
   <BrowserRouter>
      {/* Popup only when not logged in */}
      {!userData && <Choose />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={userData ? <Navigate to="/" /> : <Login />} />
        <Route path="/signup" element={userData ? <Navigate to="/" /> : <SignUp />} />

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
          path="/create-edit-item"
          element={
            <ProtectedRoute>
              <CreateEditItem />
            </ProtectedRoute>
          }
        />
      </Routes>

      
    </BrowserRouter>


  )
}

export default App
