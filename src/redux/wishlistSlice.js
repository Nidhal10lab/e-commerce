import { createSlice } from '@reduxjs/toolkit'
let savedWishlist = []
try {
  savedWishlist = JSON.parse(localStorage.getItem('wishlist')) || []
} catch {
  savedWishlist = []
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items:savedWishlist,
  },
  reducers: {
    addToWishlist: (state, action) => {
      const exists = state.items.some(item => item.id === action.payload.id)
      if (!exists) {
        state.items.push(action.payload)
      }
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload)
    },
    clearWishlist: (state) => {
      state.items = []
    },
  },
})

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer
