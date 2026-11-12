import { createSlice } from '@reduxjs/toolkit'

let nextToastId = 1

const toastSlice = createSlice({
  name: 'toast',
  initialState: {
    toasts: [],
  },
  reducers: {
    addToast: (state, action) => {
      const { message, type = 'info', duration = 3500 } = action.payload || {}
      const id = action.payload?.id || `${Date.now()}-${nextToastId++}`
      state.toasts.push({
        id,
        message,
        type, // 'success' | 'error' | 'warning' | 'info'
        duration,
      })
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(t => t.id !== action.payload)
    },
    clearToasts: (state) => {
      state.toasts = []
    },
  },
})

export const { addToast, removeToast, clearToasts } = toastSlice.actions

// Convenience action dispatchers
export const showToast = (message, type = 'info', duration = 3500) => (dispatch) => {
  const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  dispatch(addToast({ id, message, type, duration }))
}

export default toastSlice.reducer

