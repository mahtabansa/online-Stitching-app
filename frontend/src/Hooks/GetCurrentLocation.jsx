import axios from "axios";
import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setCurrentLocation, setAddress } from "../redux/userSlice.js";

const GetCurrentLocation = () => {
  const apikey = import.meta.env.VITE_GEOCODING_APIKEY;

  const dispatch = useDispatch();

  // Last location where API was called
  const lastApiLocation = useRef(null);

  // Calculate distance between two locations
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // Earth radius in meters

    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by this browser.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;


        const currentLocation = {
          latitude,
          longitude,
        };
        console.log("Current Location:", currentLocation);

        // Redux me current location update
        dispatch(setCurrentLocation(currentLocation));

        // First location -> API call
        if (!lastApiLocation.current) {
          lastApiLocation.current = currentLocation;

          await getAddress(latitude, longitude);

          return;
        }

        // Distance from last API call location
        const distance = getDistance(
          lastApiLocation.current.latitude,
          lastApiLocation.current.longitude,
          latitude,
          longitude
        );

        console.log("Distance moved:", distance.toFixed(2), "meters");

        // Only API call when distance >= 100 meters
        if (distance >= 100) {
          console.log("Moved more than 100 meters. Calling API...");

          lastApiLocation.current = currentLocation;

          await getAddress(latitude, longitude);
        }
      },
      (error) => {
        console.log("Location error:", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    );

    // Cleanup
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const getAddress = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&type=postcode&format=json&apiKey=${apikey}`
      );

      const result =
        response.data.results[0]?.city ||
        response.data.results[0]?.county;

      const state = response.data.results[0]?.state;

      dispatch(
        setAddress({
          city: result,
          state: state,
        })
      );

      // console.log("API called");
      // console.log("City:", result);
      // console.log("State:", state);
    } catch (error) {
      console.log("Geocoding error:", error);
    }
  };

  return null;
};

export default GetCurrentLocation;