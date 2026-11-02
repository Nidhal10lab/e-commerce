import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { orderService } from '../services/orderService'

// Fetch orders for a given user
export const fetchOrdersByUser = createAsyncThunk(
  'orders/fetchByUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await orderService.getByUserId(userId)
      return response.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

// Place a new order
export const placeOrder = createAsyncThunk(
  'orders/place',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await orderService.create(orderData)
      return response.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [],
    loading: false,
    error: null,
    placingOrder: false,
  },
  reducers: {
    clearOrders: (state) => {
      state.items = []
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch orders
      .addCase(fetchOrdersByUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOrdersByUser.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchOrdersByUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Place order
      .addCase(placeOrder.pending, (state) => {
        state.placingOrder = true
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.placingOrder = false
        state.items.unshift(action.payload)
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.placingOrder = false
        state.error = action.payload
      })
  },
})

export const { clearOrders } = ordersSlice.actions
export default ordersSlice.reducer
