import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios'
import Choose from '../Choose.jsx';
import { useSelector } from 'react-redux';
import { setUserData } from '../redux/userSlice.js';
import { useDispatch } from 'react-redux';

const SignUp = () => {
  const userRole = useSelector((state) => state.user.role); // 🔥 to get role in case needed
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [role, setRole] = useState(null);
  const [showPopup, setShowPopup] = useState(true);
  const { name, phone, email, password } = formData;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setShowPopup(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userRole) {
      alert("Please select role first");
      return;
    }

    try {
     const response = await axios.post(
        "http://localhost:8000/api/auth/signup",
        { ...formData, role:userRole }, 
        { withCredentials: true }
      );
      console.log("response", response.data);
      toast.success("Signup successful!");
      dispatch(setUserData(response.data));

      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
   
      {!role && !userRole   ? (
       
        <Choose onSelect={handleRoleSelect} forceOpen={true} />
     
      ) : (
        
    <div className=' bg-[#FEFEFE] flex justify-center p-5 m-5'>
       
      <form onSubmit={handleSubmit} className='bg-gray-200 h-120 w-100 rounded-lg shadow-xl' >
        <span onClick={() => navigate('/')} className='flex justify-end pr-2 pt-2 
                           '><i className="fa-solid fa-xmark"></i></span>

        <div className=' px-5 '>
          <label htmlFor="text">Name</label> <br />
          <input type='text' placeholder='Enter your name' name='name'
            className='w-80 p-2 border-1 rounded opacity-50' onChange={handleChange} value={name} required/>
        </div>

        <div className=' px-5 py-3'>
          <label htmlFor="phone" name='phone'>Phone</label> <br />
          <input type='text' placeholder='Enter your phone' name='phone'
            className='w-80 p-2 border-1 rounded opacity-50' onChange={handleChange} value={phone} required />
        </div>

        <div className=' px-5 py-3'>
          <label htmlFor="email" name='email'>Email</label> <br />
          <input type='email' placeholder='Enter your Email' name='email'
            className='w-80 p-2 border-1 rounded opacity-50' onChange={handleChange} value={email} required/>
        </div>

        <div className=' px-5 py-3'>
          <label htmlFor="password">Password</label> <br />
          <input type='password' placeholder='Enter your password' name='password'
            className='w-80 p-2 border-1 rounded opacity-50' onChange={handleChange} value={password} required/>
        </div>


        <div className='py-5'>
          <div className='flex justify-center pb-4' style={{ width: "100%" }}>
            <button type='submit' className='bg-blue-600 text-white px-4 py-2 rounded-md 
               flex justify-center align-center'>SignUp</button>
          </div>

          <div className=' flex justify-center '>
            <Link to='/login' ><span className='opacity-75 text-center'>Already have a account, </span>
              <span className='font-semibold'>Login</span></Link>
          </div>
        </div>
      </form>
      <ToastContainer position="top-right" autoClose={5000} theme="light" />

    </div>
      )}
    </>
  );
};

export default SignUp;