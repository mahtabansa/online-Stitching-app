import { configureStore } from '@reduxjs/toolkit'

import  {userReducer} from './userSlice.js'  // Correct!
import {ownerReducer} from './ownerSlice.js'

export const store = configureStore({
  reducer: {
    user: userReducer,owner:ownerReducer
  },
  devTools: process.env.NODE_ENV !== 'production'
})