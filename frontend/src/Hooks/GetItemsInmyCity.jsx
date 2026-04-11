import React, { useEffect } from 'react'
import axios from 'axios';
import { useSelector ,useDispatch} from 'react-redux';
import { setItemsInMyCity } from '../redux/userSlice.js';


const GetItemsInMyCity = () => {
      const {currentCity} = useSelector((state) => state.user);
  
      // yahan par agr user location ko on nhi karta hai to userDta ke andar jo city hai us city ko bhej kar items ko dikhana hai ye bhi banana hai
      
   
      const dispatch = useDispatch();
      const url = import.meta.env.VITE_SERVER_URL

   useEffect(  () => {
      if(!currentCity) return;
      try { 
            const fetchMyShop = async () => {
            const response = await axios.get(`${url}/api/items/get-items-incity/${currentCity}`, { withCredentials: true });
            dispatch(setItemsInMyCity(response.data));
          };
          fetchMyShop();
      } catch (err) {
            console.log("error in fetching my shop", err);
      }

   }, [currentCity])
}

export default GetItemsInMyCity