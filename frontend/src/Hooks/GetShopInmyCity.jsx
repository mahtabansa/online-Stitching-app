import React, { useEffect } from 'react'
import axios from 'axios';
import { useSelector ,useDispatch} from 'react-redux';
import { setShopsInMyCity } from '../redux/userSlice.js';     
const GetShopInmyCity = () => {
      const city = useSelector((state) => state.user.currentCity);
      const dispatch = useDispatch();
 useEffect(() => {
          if(!city ) return;
            const fetchShopsInMyCity = async () => {
            try {
                  const response = await axios.get(`http://localhost:8000/api/shops/shops-in-my-city/${city}`, { withCredentials: true });
                  dispatch(setShopsInMyCity(response.data));
            } catch (err) {
                  console.log("error in fetching shops in my city", err);
            }
          };
          fetchShopsInMyCity();

      }, [city])

}

export default GetShopInmyCity