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

// Fetch all orders (Admin)
export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderService.getAll()
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

// Update order status (Admin)
export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await orderService.updateStatus(id, status)
      return response.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

// Delete order (Admin)
export const deleteOrder = createAsyncThunk(
  'orders/delete',
  async (id, { rejectWithValue }) => {
    try {
      await orderService.delete(id)
      return id
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
    actionLoading: false,
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
      // Fetch orders by user
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

      // Fetch all orders (Admin)
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
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

      // Update status (Admin)
      .addCase(updateOrderStatus.pending, (state) => {
        state.actionLoading = true
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.actionLoading = false
        const index = state.items.findIndex(
          (order) => String(order.id) === String(action.payload.id)
        )
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload }
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.actionLoading = false
        state.error = action.payload
      })

      // Delete order
      .addCase(deleteOrder.pending, (state) => {
        state.actionLoading = true
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.actionLoading = false
        state.items = state.items.filter(
          (order) => String(order.id) !== String(action.payload)
        )
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.actionLoading = false
        state.error = action.payload
      })
  },
})

export const { clearOrders } = ordersSlice.actions
export default ordersSlice.reducer
