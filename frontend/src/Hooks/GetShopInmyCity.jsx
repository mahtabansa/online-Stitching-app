import React, { useEffect } from 'react'
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setShopsInMyCity } from '../redux/userSlice.js';
const GetShopInmyCity = () => {
      const { userData, shopsInMyCity ,currentCity} = useSelector((state) => state.user);
      const dispatch = useDispatch();
      useEffect(() => {
            if (
                  !currentCity ||
                  shopsInMyCity?.length > 0 ||
                  userData?.role === "tailor"
            ) return;
            const fetchShopsInMyCity = async () => {
                  try {
                        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/shops/shops-in-my-city/${currentCity}`, { withCredentials: false });
                        console.log("response", response)
                        dispatch(setShopsInMyCity(response.data));
                  } catch (err) {
                        console.log("error in fetching shops in my city", err);
                  }
            };
            fetchShopsInMyCity();

      }, [currentCity,!shopsInMyCity, userData])

}

export default GetShopInmyCity
