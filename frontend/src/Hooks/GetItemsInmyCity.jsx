import { useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
  setItemsInMyCity,
  setItemsLoading,
} from "../redux/userSlice";

const GetItemsInMyCity = () => {
  const { address, userData, itemsInMyCity} = useSelector(
    (state) => state.user
  );
  let city = address.length > 0 ? address?.city : userData?.address?.city;
  let city2 = address?.city;
  city = city2;

  const dispatch = useDispatch();

  useEffect(() => {
    if (
      !city || !city2 ||
      userData?.role === "tailor" ||
      itemsInMyCity?.length > 0
    ) return;

    const fetchItems = async () => {
      dispatch(setItemsLoading(true));

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/items/get-items-incity/${city}`,
          {
            withCredentials: true,
          }
        );

        dispatch(setItemsInMyCity(response.data));
      } catch (err) {
        console.error("Error fetching items:", err);
      } finally {
        dispatch(setItemsLoading(false));
      }
    };

    fetchItems();
  }, [ city2 ,itemsInMyCity, userData, dispatch]);

  return null;
};

export default GetItemsInMyCity;