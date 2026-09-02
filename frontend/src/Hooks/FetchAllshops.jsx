
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setAllShops} from '../redux/userSlice.js';
const FetchAllshops = () => {
      const { userData ,shopsInMyCity } = useSelector((state) => state.user);
      const dispatch = useDispatch();
       
      useEffect(() => {
            if (userData || shopsInMyCity ) return;

            const setimer = setTimeout(async () => {
                 
                        try {
                              const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/shops/all-shops`);
                              
                              dispatch(setAllShops(response?.data));
                        } catch (err) {
                              console.log("error in fetching shops in my city", err);
                        }
                  
            }, 3000);

          
         return () => clearTimeout(setimer);

      }, [!userData,!shopsInMyCity])

}

export default FetchAllshops;