import React, { useEffect } from 'react'
import axios from 'axios';
import { useSelector ,useDispatch} from 'react-redux';
import { setShopsInMyCity } from '../redux/userSlice.js';     
const GetShopInmyCity = () => {
      const city = useSelector((state) => state.user.currentCity);
      console.log("city",city)
      const userData = useSelector((state) => state.user.userData);
      const dispatch = useDispatch();
 useEffect(() => {
          if(!city || userData?.role === "tailor" ) return;
            const fetchShopsInMyCity = async () => {
            try {
                  const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/shops/shops-in-my-city/${city}`, { withCredentials: false });
                  console.log("response",response)
                  dispatch(setShopsInMyCity(response.data));
            } catch (err) {
                  console.log("error in fetching shops in my city", err);
            }
          };
          fetchShopsInMyCity();

      }, [city])

}

export default GetShopInmyCity
