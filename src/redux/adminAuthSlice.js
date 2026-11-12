import { createSlice } from '@reduxjs/toolkit'

let parsedAdmin = null
try {
  const storedAdmin = localStorage.getItem('fyniAdmin')
  if (storedAdmin && storedAdmin !== 'undefined') {
    parsedAdmin = JSON.parse(storedAdmin)
  }
} catch {
  parsedAdmin = null
}

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState: {
    admin: parsedAdmin,
    isAdminAuthenticated: !!parsedAdmin,
    error: null,
  },
  reducers: {
    adminLoginSuccess: (state, action) => {
      state.admin = action.payload
      state.isAdminAuthenticated = true
      state.error = null
      localStorage.setItem('fyniAdmin', JSON.stringify(action.payload))
      window.dispatchEvent(new Event('adminAuthChanged'))
    },
    adminLogout: (state) => {
      state.admin = null
      state.isAdminAuthenticated = false
      state.error = null
      localStorage.removeItem('fyniAdmin')
      window.dispatchEvent(new Event('adminAuthChanged'))
    },
    setAdminError: (state, action) => {
      state.error = action.payload
    },
    clearAdminError: (state) => {
      state.error = null
    },
  },
})

export const { adminLoginSuccess, adminLogout, setAdminError, clearAdminError } = adminAuthSlice.actions
export default adminAuthSlice.reducer

