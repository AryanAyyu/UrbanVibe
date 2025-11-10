import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import client from '../../api/client.js'

const saved = localStorage.getItem('auth')
const initial = saved ? JSON.parse(saved) : { user: null, token: null, status: 'idle', error: null }

export const loginThunk = createAsyncThunk('auth/login', async ({ email, password }) => {
  const { data } = await client.post('/auth/login', { email, password })
  return data
})

export const registerThunk = createAsyncThunk('auth/register', async (payload) => {
  const { data } = await client.post('/auth/register', payload)
  return data
})

const slice = createSlice({
  name: 'auth',
  initialState: initial,
  reducers: {
    logout(state) { state.user = null; state.token = null; localStorage.removeItem('token'); localStorage.removeItem('auth') },
    setAuth(state, action) { state.user = action.payload.user; state.token = action.payload.token; }
  },
  extraReducers: (b) => {
    b.addCase(loginThunk.fulfilled, (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      localStorage.setItem('token', state.token)
      localStorage.setItem('auth', JSON.stringify({ user: state.user, token: state.token }))
    })
    b.addCase(registerThunk.fulfilled, (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      localStorage.setItem('token', state.token)
      localStorage.setItem('auth', JSON.stringify({ user: state.user, token: state.token }))
    })
  }
})

export const { logout, setAuth } = slice.actions
export default slice.reducer
