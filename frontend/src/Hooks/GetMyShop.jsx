import React, { useEffect } from 'react'
import axios from 'axios';
import { useSelector ,useDispatch} from 'react-redux';
import { setMyShopData } from '../redux/ownerSlice.js';

const GetMyShop = () => {
      const {userData } = useSelector((state) => state.user);
      const {myShopData } = useSelector((state) => state.owner);
      
      const dispatch = useDispatch();

   useEffect(  () => {
      if(!userData || myShopData || userData?.role==="customer" ) return;
      try { 
            const fetchMyShop = async () => {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/shops/my-shop`, { withCredentials: true });
            console.log("response",response)
            dispatch(setMyShopData(response.data));
          };
          fetchMyShop();
      } catch (err) {
            console.log("error in fetching my shop", err);
      }

   }, [userData || myShopData])
}

export default GetMyShop