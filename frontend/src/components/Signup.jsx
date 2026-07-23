import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios'
import Choose from '../Choose.jsx';
import { useSelector } from 'react-redux';
import { setRole, setUserData } from '../redux/userSlice.js';
import { useDispatch } from 'react-redux';
import Loader from '../pages/Loader.jsx';

const SignUp = () => {
  const { role } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loader, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [showPopup, setShowPopup] = useState(true);
  const { name, phone, email, password } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      // Sirf numbers allow karne ke liye aur max 10 digits ke liye
      const cleanValue = value.replace(/\D/g, '');
      if (cleanValue.length <= 10) {
        setFormData({ ...formData, [name]: cleanValue });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setUserData(selectedRole);
    setShowPopup(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role) {
      alert("Please select role first");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`,
        { ...formData, role: role },
        { withCredentials: true }
      );
      console.log("response", response.data);
      toast.success("Signup successful!");
      dispatch(setUserData(response.data));
      setLoading(false);
      navigate("/");
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <>
      {!role && (
        <Choose onSelect={handleRoleSelect} forceOpen={true} />
      )}

      <div className='bg-[#FEFEFE]  h-[calc(100vh-4rem)] flex justify-center items-center p-5 m-5'>

        <form onSubmit={handleSubmit} className='bg-gray-200 h-120 w-100 rounded-lg shadow-xl' >
          <span onClick={() => { navigate('/'), dispatch(setRole(false)) }} className='flex justify-end pr-4 pt-4  
                           '><i className="fa-solid fa-xmark"></i>
          </span>

          <div className=' px-5  '>
            <label htmlFor="text" >Name</label> <br />
            <input type='text' placeholder='Enter your name' name='name'
              className='w-80 p-2 border-1 rounded  opacity-50 mt-1 ' onChange={handleChange} value={name} required />
          </div>

          <div className='px-5 py-3'>
            <label htmlFor="phone">Phone</label> <br />

            {/* Border aur styling is wrapper div par aayegi */}
            <div className='flex items-center w-80 border-2 border-gray-500 hover:border-gray-700 rounded opacity-50 mt-1'>

              {/* Fixed +91 Text */}
              <span className='pl-3 pr-2 text-gray-500 font-medium select-none'>
                +91
              </span>

              {/* Actual Input Box (Borders removed so it looks seamless) */}
              <input
                type='tel'
                placeholder='Enter 10-digit number'
                name='phone'
                className='w-full p-2 outline-none rounded-r'
                onChange={handleChange}
                value={formData.phone}
                required
              />
            </div>
          </div>
          <div className=' px-5 py-3'>
            <label htmlFor="email" name='email'>Email</label> <br />
            <input type='email' placeholder='Enter your Email' name='email'
              className='w-80 p-2 border-1 rounded  opacity-50 mt-1' onChange={handleChange} value={email} required />
          </div>

          <div className=' px-5 py-3'>
            <label htmlFor="password">Password</label> <br />
            <input type='password' placeholder='Enter your password' name='password'
              className='w-80 p-2 border-1 rounded  opacity-50 mt-1' onChange={handleChange} value={password} required />
          </div>

          <div className='py-3'>
            <div className='flex justify-center pb-4' style={{ width: "100%" }}>

              {loader ?
                <div className="fixed inset-0 bg-[#FEFEFE] bg-opacity-40 flex justify-center items-center z-50">
                  <Loader />
                </div>
                :
                <button type='submit' className='bg-blue-600 text-white px-4 py-2 rounded-md 
               flex justify-center align-center'>{role ? `SignUp(${role})` : `SignUp`}</button>
              }
            </div>

            <div className=' flex justify-center  '>
              <Link to='/login' ><span className='opacity-75 text-center'>Already have a account, </span>
                <span className='font-semibold'>Login</span></Link>
            </div>
          </div>
        </form>
        <ToastContainer position="top-right" autoClose={5000} theme="light" />

      </div>

    </>
  );
};

export default SignUp;
