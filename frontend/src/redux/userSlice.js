import { createSlice, configureStore } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    role: null,
    currentState: null,
    currentCity: null,
    currentAddress: null,
    shopsInMyCity: null,
    ItemsInMyCity: null,
    ItemCard: [],
    TotalAmount: 0,
    Myorder:{
      orders:[]
    },
    location: null,

  },
  reducers: {
    setUserData: (state, actions) => {
      state.userData = actions.payload;
    },
    ClearUser: (state) => {
      state.userData = null;
    },
    setCurrentState: (state, actions) => {
      state.currentState = actions.payload;
    },
    setCurrentCity: (state, actions) => {
      state.currentCity = actions.payload;
    },
    setCurrentAddress: (state, actions) => {
      state.currentAddress = actions.payload;
    },

    setCurrentLocation: (state, actions) => {
      state.location = actions.payload;
    },
    setRole: (state, actions) => {
      state.role = actions.payload;
    },
    setShopsInMyCity: (state, actions) => {
      state.shopsInMyCity = actions.payload;
    },
    setItemsInMyCity: (state, actions) => {
      state.ItemsInMyCity = actions.payload;
    },
    setAddToCard: (state, actions) => {
      const newItem = actions.payload;
      state.ItemCard.push(newItem);
      const existingItem = state.ItemCard.find((i) => i._id === newItem._id);
      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        state.ItemCard.push(newItem);
      }

      state.TotalAmount = state.ItemCard.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
    },

    updateQuantity: (state, actions) => {
      const { id, quantity } = actions.payload;
      const item = state.ItemCard.find((i) => i._id === id);
      if (item) {
        item.quantity = quantity;
      }
      state.TotalAmount = state.ItemCard.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
    },

    removeItemFromCard: (state, actions) => {
      const { id } = actions.payload;
      const updatedcardItems = state.ItemCard.filter((i) => i._id !== id);
      state.ItemCard = updatedcardItems;
      state.TotalAmount = state.ItemCard.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
    },

    AddMyOrders:(state,actions)=>{
      const newItems = actions.payload

      state.Myorder.orders = [newItems,...state.Myorder.orders]
    }

  },
});
export const {
  setUserData,
  setRole,
  setCurrentCity,
  setCurrentState,
  setCurrentAddress,
  setCurrentLocation,
  setShopsInMyCity,
  setItemsInMyCity,
  setAddToCard,
  updateQuantity,
  AddMyOrders,
  removeItemFromCard,
  ClearUser,
} = userSlice.actions;

export const userReducer = userSlice.reducer;
export default userSlice.reducer;
