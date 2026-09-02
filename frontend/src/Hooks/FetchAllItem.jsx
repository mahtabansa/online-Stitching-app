
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setAllItems } from '../redux/userSlice.js';
const FetchAllItem = () => {
      const { userData} = useSelector((state) => state.user);
      const dispatch = useDispatch();

      useEffect(() => {
            if (userData) return;

            const setimer = setTimeout(async () => {
                 
                        try {
                              const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/items/all-items`);
                             
                              dispatch(setAllItems(response?.data));
                        } catch (err) {
                              console.log("error in fetching shops in my city", err);
                        }
                  
            }, 3000);

          
         return () => clearTimeout(setimer);

      }, [!userData])

}

export default FetchAllItem;