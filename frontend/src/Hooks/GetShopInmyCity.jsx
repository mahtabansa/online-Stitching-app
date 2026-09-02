import React, { useEffect } from 'react'
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setShopsInMyCity } from '../redux/userSlice.js';
const GetShopInmyCity = () => {
      const { userData, shopsInMyCity, address } = useSelector((state) => state.user);
      const dispatch = useDispatch();
      let city1 = address.length > 0 ? address?.city : userData?.address?.city;
      let city2 = address?.city;
      city1 = city2;
      
      useEffect(() => {
            if (!city1 || !city2 ||
                  userData?.length === 0 ||
                  shopsInMyCity?.length > 0 ||
                  userData?.role === "tailor"
            ) return;

            const fetchShopsInMyCity = async () => {
                  try {
                        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/shops/shops-in-my-city/${city1}`, { withCredentials: false });
                        dispatch(setShopsInMyCity(response.data));
                  } catch (err) {
                        console.log("error in fetching shops in my city", err);
                  }
            };
            fetchShopsInMyCity();

      }, [!shopsInMyCity, userData, city1, city2, dispatch]);

}

export default GetShopInmyCity
