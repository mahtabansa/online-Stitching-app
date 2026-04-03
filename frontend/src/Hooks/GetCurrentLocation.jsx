import axios from 'axios';
import React, { use, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentAddress, setCurrentCity, setCurrentState, setCurrentLocation } from '../redux/userSlice.js';



const GetCurrentLocation = () => {
      const apikey = import.meta.env.VITE_GEOCODING_APIKEY;
      const { userData } = useSelector(state => state.user);
      const dispatch = useDispatch();

      useEffect(() => {
           
            if (!userData) return;
            if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(async (position) => {
                        const locationData = {
                              latitude: position.coords.latitude,
                              longitude: position.coords.longitude,
                        }
                        dispatch(setCurrentLocation(locationData));
                        const latitude = position.coords.latitude;
                        const longitude = position.coords.longitude;

                        const response = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&type=postcode&format=json&apiKey=${apikey}`);

                        const result = response.data.results[0].
                              city_district
                              || response.data.results[0].city;
                    
                        const fullAddress = response.data.results[0].address_line2 + " " + response.data.results[0].address_line1 + " " + " " + response.data.results[0].state + " " + response.data.results[0].country
                        dispatch(setCurrentCity(result));
                        dispatch(setCurrentAddress(fullAddress));
                        dispatch(setCurrentState(response.data.results[0].state))

                  })
                  return
            } else {
                  console.log('Geolocation is not supported by this browser.')
            }
      })
      return null
}

export default GetCurrentLocation