import axios from 'axios'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { setUserData ,ClearUser } from '../redux/userSlice.js'
import { useDispatch, useSelector } from 'react-redux'
const serverurl = import.meta.env.VITE_SERVER_URL;


const GetCurrentUser = () => {
   const userData = useSelector((state)=>state.user.userData);
   const [loading,setLoading] = useState(false);
   const dispatch = useDispatch();
  useEffect(() => {
   
      if(userData ) return; 
    const fetchUser = async () => {
      try {
        const result = await axios.get(
          `${serverurl}/api/user/current-user`,
          { withCredentials: true }
        );
        
       dispatch(setUserData(result.data))
      
      } catch (err) {
        dispatch(ClearUser()); 
        
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [!userData]);

  return loading;

}


export default GetCurrentUser