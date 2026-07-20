import React, { useEffect } from 'react'
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setItemsInMyCity, setItemsLoading } from '../redux/userSlice.js';


const GetItemsInMyCity = () => {
      const { currentCity } = useSelector((state) => state.user);

      // yahan par agr user location ko on nhi karta hai to userDta ke andar jo city hai us city ko bhej kar items ko dikhana hai ye bhi banana hai
      const userData = useSelector((state) => state.user.userData);

      const dispatch = useDispatch();

      useEffect(() => {
            if (!currentCity || userData?.role === "tailor") return;
            dispatch(setItemsLoading(true))
            try {
                  const fetchMyShop = async () => {
                        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/items/get-items-incity/${currentCity}`, { withCredentials: true });
                        console.log("response", response)
                        dispatch(setItemsInMyCity(response.data));
                  };
                  fetchMyShop();
            } catch (err) {
                  console.log("error in fetching my shop", err);
            } finally {
                  dispatch(setItemsLoading(false));
            }

      }, [currentCity])
}

export default GetItemsInMyCity