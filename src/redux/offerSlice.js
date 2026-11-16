import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { productService } from '../services/productService'

export const fetchOffers = createAsyncThunk(
  'offers/fetchOffers',
  async ( _, { rejectWithValue }) => {
    try {
      const response = await productService.getAll()
      return response.data.filter(product => {
        const price = product.price
        const originalPrice = product.originalPrice
        return  originalPrice > price
      })
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)
//we used extrareducer because it is external we use create asyncthunk
const offerSlice = createSlice({
  name: 'offers',
  initialState: {
    items: [],
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.items = action.payload
      })
  },
})

export default offerSlice.reducer
