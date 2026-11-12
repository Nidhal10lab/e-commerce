import { createSlice } from '@reduxjs/toolkit'

let savedCart = []
try {
  const stored = localStorage.getItem('cart')
  if (stored && stored !== 'undefined') {
    savedCart = JSON.parse(stored) || []
  }
} catch {
  savedCart = []
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: savedCart,
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, selectedSize, quantity = 1 } = action.payload
      const key = `${product.id}-${selectedSize}`
      const existing = state.items.find(item => item.key === key)

      if (existing) {
        existing.quantity += quantity
      } else {
        state.items.push({
          key,
          product,
          selectedSize,
          quantity,
        })
      }
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.key !== action.payload)
    },

    updateQuantity: (state, action) => {
      const { key, quantity } = action.payload
      const item = state.items.find(item => item.key === key)
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(i => i.key !== key)
        } else {
          item.quantity = quantity
        }
      }
    },

    clearCart: (state) => {
      state.items = []
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer
