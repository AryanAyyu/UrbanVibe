import { configureStore } from '@reduxjs/toolkit'
import auth from './slices/authSlice.js'
import products from './slices/productsSlice.js'
import cart from './slices/cartSlice.js'
import wishlist from './slices/wishlistSlice.js'

export default configureStore({
  reducer: { auth, products, cart, wishlist },
})
