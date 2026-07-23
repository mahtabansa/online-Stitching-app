import { useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
  setItemsInMyCity,
  setItemsLoading,
} from "../redux/userSlice";

const GetItemsInMyCity = () => {
  const { currentCity, userData, shopsInMyCity ,itemsInMyCity} = useSelector(
    (state) => state.user
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (
      !currentCity ||
      userData?.role === "tailor" ||
     
      itemsInMyCity?.length > 0
    ) {
      return;
    }

    const fetchItems = async () => {
      dispatch(setItemsLoading(true));

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/items/get-items-incity/${currentCity}`,
          {
            withCredentials: true,
          }
        );

        console.log("Items fetched");

        dispatch(setItemsInMyCity(response.data));
      } catch (err) {
        console.error("Error fetching items:", err);
      } finally {
        dispatch(setItemsLoading(false));
      }
    };

    fetchItems();
  }, [currentCity, itemsInMyCity, userData, dispatch]);

  return null;
};

export default GetItemsInMyCity;