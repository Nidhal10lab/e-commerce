import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { userService } from '../services/userService'

// Fetch all users
export const fetchUsers = createAsyncThunk(
  'users/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getAll()
      return response.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

// Toggle block status
export const toggleBlockUser = createAsyncThunk(
  'users/toggleBlock',
  async ({ id, isBlocked }, { rejectWithValue }) => {
    try {
      const response = await userService.update(id, { isBlocked: !isBlocked })
      return response.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

// Delete user (optional admin capability)
export const deleteUser = createAsyncThunk(
  'users/delete',
  async (id, { rejectWithValue }) => {
    try {
      await userService.delete(id)
      return id
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    items: [],
    loading: false,
    actionLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Toggle block status
      .addCase(toggleBlockUser.pending, (state) => {
        state.actionLoading = true
      })
      .addCase(toggleBlockUser.fulfilled, (state, action) => {
        state.actionLoading = false
        const index = state.items.findIndex(
          (u) => String(u.id) === String(action.payload.id)
        )
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload }
        }
      })
      .addCase(toggleBlockUser.rejected, (state, action) => {
        state.actionLoading = false
        state.error = action.payload
      })

      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.actionLoading = true
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.actionLoading = false
        state.items = state.items.filter(
          (u) => String(u.id) !== String(action.payload)
        )
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.actionLoading = false
        state.error = action.payload
      })
  },
})

export default usersSlice.reducer

