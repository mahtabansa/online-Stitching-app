import { createSlice, configureStore } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    role:null,
    currentState: null,
    currentCity: null,
    currentAddress: null,
    shopsInMyCity: null,
    // ItemsInMyCity: null
    location:null,
    
  },
  reducers: {
    setUserData: (state, actions) => {
      state.userData = actions.payload;
    },
    ClearUser:(state)=>{
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
    // setItemsInMyCity: (state, actions) => {
    //   state.ItemsInMyCity = actions.payload;
    // },
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
  // setItemsInMyCity,
  ClearUser
} = userSlice.actions;


export const userReducer = userSlice.reducer;
export default userSlice.reducer;
