import { createSlice } from '@reduxjs/toolkit'

let parsedUser = null
try {
  const storedUser = localStorage.getItem('fyniUser')
  if (storedUser && storedUser !== 'undefined') {
    parsedUser = JSON.parse(storedUser)
  }
} catch {
  parsedUser = null
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: parsedUser,
    isAuthenticated: !!parsedUser,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
      localStorage.setItem('fyniUser', JSON.stringify(action.payload))
      window.dispatchEvent(new Event('authChanged'))
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      localStorage.removeItem('fyniUser')
      window.dispatchEvent(new Event('authChanged'))
    },
  },
})
export const { loginSuccess, logout } = authSlice.actions
export default authSlice.reducer
