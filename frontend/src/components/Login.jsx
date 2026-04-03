import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
const Login = () => {
      const navigate = useNavigate();
      const [formData, setFormData] = useState({ email: "", password: "" });

      const { email, password } = formData
      const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData({ ...formData, [name]: value });
      }

      const handleError = (err) =>
            toast.error(err, {
                  position: "bottom-left",
            });
      const handleSuccess = (msg) =>
            toast.success(msg, {
                  position: "bottom-left",
            });

      const handlesubmit = async (e) => {

            e.preventDefault();
            try {
                  const { data } = await axios.post("http://localhost:8000/api/auth/login", 
                        { ...formData }, { withCredentials: true });
           
           navigate("/");
           setFormData({ email: "", password: "" })

        
    } catch (err) {
       
        handleError(err.response?.data?.message || "Error in login");
        console.log("error in login controller", err);
    }
      } 
      return (
            <div className='bg-[#FEFEFE] flex justify-center p-5 m-5'>

                  <form onSubmit={handlesubmit} className='bg-gray-200 h-100 w-100 rounded-lg shadow-xl' >
                        <span onClick={() => navigate('/')} className='flex justify-end pr-2 pt-2 
                           '><i className="fa-solid fa-xmark"></i></span>

                        <h1 className='text-center text-xl'>Login</h1>

                        <div className=' px-5 py-3'>
                              <label htmlFor="email" name='email'>Email</label> <br />
                              <input type='email' placeholder='Enter your Email' name='email'
                                    className='w-80 p-2 border-1 rounded opacity-50' value={email} onChange={handleChange} required />
                        </div>

                        <div className=' px-5 py-3'>
                              <label htmlFor="password">Password</label> <br />
                              <input type='password' placeholder='Enter your password' name='password'
                                    className='w-80 p-2 border-1 rounded opacity-50' value={password} onChange={handleChange} required/>
                        </div>

                        <div className='py-5'>
                              <div className='flex justify-center pb-4' style={{ width: "100%" }}>
                                    <button className='bg-blue-600 text-white px-4 py-2 rounded-md 
                               flex justify-center align-center' type='submit' onClick={handlesubmit}>Login</button>
                              </div>

                              <div className='  flex justify-center '>
                                    <span onClick={() => navigate('/signup')}><span className='opacity-75 text-center'>Don't have account, </span>
                                          <span className='font-semibold'>Signup</span></span>
                              </div>
                        </div>

                  </form>
                 <ToastContainer />

            </div>
      )
}

export default Login