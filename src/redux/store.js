import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import cartReducer from './cartSlice'
import wishlistReducer from './wishlistSlice'
import productsReducer from './productsSlice'
import ordersReducer from './ordersSlice'
import adminAuthReducer from './adminAuthSlice'
import usersReducer from './usersSlice'
import toastReducer from './toastSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    products: productsReducer,
    orders: ordersReducer,
    adminAuth: adminAuthReducer,
    users: usersReducer,
    toast: toastReducer,
  },
})

store.subscribe(() => {
  const state = store.getState()
  localStorage.setItem('wishlist', JSON.stringify(state.wishlist.items))
  localStorage.setItem('cart', JSON.stringify(state.cart.items))
})
