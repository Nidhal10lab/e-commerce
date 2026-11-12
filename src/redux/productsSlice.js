import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { productService } from '../services/productService'

// Async thunk to fetch all products from JSON Server
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getAll()
      return response.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

// Add a new product
export const addProduct = createAsyncThunk(
  'products/add',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await productService.create(productData)
      return response.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

// Update a product
export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await productService.patch(id, data)
      return response.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

// Soft Delete a product (Marks as isSoftDeleted: true, stock: 0)
export const softDeleteProduct = createAsyncThunk(
  'products/softDelete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await productService.patch(id, {
        isSoftDeleted: true,
        stock: 0,
      })
      return response.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

// Restore a soft-deleted product
export const restoreProduct = createAsyncThunk(
  'products/restore',
  async ({ id, stock = 15 }, { rejectWithValue }) => {
    try {
      const response = await productService.patch(id, {
        isSoftDeleted: false,
        stock: Number(stock) || 15,
      })
      return response.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

// Hard Delete a product (Permanently deletes from json-server)
export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (id, { rejectWithValue }) => {
    try {
      await productService.delete(id)
      return id
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    loading: false,
    actionLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Add product
      .addCase(addProduct.pending, (state) => {
        state.actionLoading = true
        state.error = null
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.actionLoading = false
        state.items.unshift(action.payload)
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.actionLoading = false
        state.error = action.payload
      })

      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.actionLoading = true
        state.error = null
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.actionLoading = false
        const index = state.items.findIndex(
          (item) => String(item.id) === String(action.payload.id)
        )
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload }
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.actionLoading = false
        state.error = action.payload
      })

      // Soft delete product
      .addCase(softDeleteProduct.pending, (state) => {
        state.actionLoading = true
        state.error = null
      })
      .addCase(softDeleteProduct.fulfilled, (state, action) => {
        state.actionLoading = false
        const index = state.items.findIndex(
          (item) => String(item.id) === String(action.payload.id)
        )
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload }
        }
      })
      .addCase(softDeleteProduct.rejected, (state, action) => {
        state.actionLoading = false
        state.error = action.payload
      })

      // Restore product
      .addCase(restoreProduct.pending, (state) => {
        state.actionLoading = true
        state.error = null
      })
      .addCase(restoreProduct.fulfilled, (state, action) => {
        state.actionLoading = false
        const index = state.items.findIndex(
          (item) => String(item.id) === String(action.payload.id)
        )
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload }
        }
      })
      .addCase(restoreProduct.rejected, (state, action) => {
        state.actionLoading = false
        state.error = action.payload
      })

      // Hard Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.actionLoading = true
        state.error = null
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.actionLoading = false
        state.items = state.items.filter(
          (item) => String(item.id) !== String(action.payload)
        )
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.actionLoading = false
        state.error = action.payload
      })
  },
})

export default productsSlice.reducer
