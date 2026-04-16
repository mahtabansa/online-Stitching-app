import React from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { AddMyOrders } from '../redux/userSlice.js'
const GetMyOrder = () => {
      const url = import.meta.env.VITE_SERVER_URL
      const dispatch = useDispatch();
      const { userData } = useSelector((state) => state.user)

      useEffect(() => {
            if(!userData) return 
            try {
                  const fetchOrders = async () => {
                        const result = await axios.get(`${url}/api/order/get-my-orders`, { withCredentials: true });
                        
                        dispatch(AddMyOrders(result.data.orders))
                  }
                      fetchOrders();
                 
            } catch (err) {
                  console.log("err while getting my orders",err)
            }
         


      }, [userData])
}

export default GetMyOrder