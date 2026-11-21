import { configureStore } from '@reduxjs/toolkit'
import { ProductReducer } from './slices/productSlice'
export const store = configureStore({
  reducer: {
    product:ProductReducer
  }
})