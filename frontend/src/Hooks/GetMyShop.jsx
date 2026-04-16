import React, { useEffect } from 'react'
import axios from 'axios';
import { useSelector ,useDispatch} from 'react-redux';
import { setMyShopData } from '../redux/ownerSlice.js';

const GetMyShop = () => {
      const {userData} = useSelector((state) => state.user);
      const dispatch = useDispatch();

   useEffect(  () => {
      if(!userData ) return;
      try { 
            const fetchMyShop = async () => {
            const response = await axios.get("http://localhost:8000/api/shops/my-shop", { withCredentials: true });
            dispatch(setMyShopData(response.data));
          };
          fetchMyShop();
      } catch (err) {
            console.log("error in fetching my shop", err);
      }

   }, [userData ])
}

export default GetMyShop