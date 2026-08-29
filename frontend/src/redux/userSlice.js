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
    itemsLoading: false,
    ItemCard: [],
    CheckOutItem: [],
    TotalAmount: 0,
    Myorder: {
      orders: [],
    },
    location: null,
    searchResults: [],
    isSearching: false,
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
    setAddToCard: (state, action) => {
      const newItem = action.payload;

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
    setCheckOut: (state, actions) => {
      const newItem = actions.payload;
      if (!newItem) {
        return;
      }
      const existingItem = state.CheckOutItem.find(
        (i) => i._id === newItem._id,
      );
      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        state.CheckOutItem.push(newItem);
      }
      state.TotalAmount = state.CheckOutItem.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
    },
    clearCheckOut: (state) => {
      state.CheckOutItem = [];
      state.CheckOutTotalAmount = 0; // ya TotalAmount, jo bhi field use kar rahe ho
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

    SetMyOrders: (state, action) => {
      state.Myorder.orders = action.payload;
    },
    AddMyOrders: (state, action) => {
      state.Myorder.orders.unshift(action.payload);
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    setIsSearching: (state, action) => {
      state.isSearching = action.payload;
    },
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const order = state.Myorder.orders.find((o) => o._id === orderId);
      if (!status) {
        console.log(`update status can not be null`);
      } else if (order) {
        order.status = status;
      }
    },
    cancelOrder: (state, action) => {
      const { orderId ,status,cancelReason} = action.payload;
      const order = state.Myorder.orders.find((o) => o._id === orderId);
      if (order) {
        order.status = status;
        order.cancelReason = cancelReason;
      }
    },

    updatePickupTime: (state, action) => {
      const { orderId, pickupTime } = action.payload;

      const order = state.Myorder.orders.find((o) => o._id === orderId);
      if (order && order.shopOrder?.[0]) {
        order.shopOrder[0].pickup = pickupTime;
      }
    },
    updateProfileImage: (state, actions) => {
      const { userId, user } = actions.payload;

      if (!userId || !user) {
        console.log(`user Not found`);
        return;
      }
      if (!state.userData) {
        console.log("userData is null, cannot update");
        return;
      }

      if (String(state.userData._id) === String(userId)) {
        state.userData.image = user.image;
      } else {
        console.log(`user id mismatch`);
      }
    },
    setItemsLoading:(state,actions)=>{
      state.itemsLoading = actions.payload
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
  setItemsLoading,
  setAddToCard,
  updateQuantity,
  AddMyOrders,
  SetMyOrders,
  removeItemFromCard,
  ClearUser,
  setSearchResults,
  setIsSearching,
  updateOrderStatus,
  setCheckOut,
  clearCheckOut,
  updatePickupTime,
  updateProfileImage,
  cancelOrder
} = userSlice.actions;

export const userReducer = userSlice.reducer;
export default userSlice.reducer;
