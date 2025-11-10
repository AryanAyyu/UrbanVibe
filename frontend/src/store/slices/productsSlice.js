import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import client from '../../api/client.js'

export const fetchProducts = createAsyncThunk('products/fetch', async (params) => {
  const { data } = await client.get('/products', { params })
  return data
})

export const fetchProduct = createAsyncThunk('products/fetchOne', async (id) => {
  const { data } = await client.get(`/products/${id}`)
  return data
})

const slice = createSlice({
  name: 'products',
  initialState: { items: [], current: null, status: 'idle' },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchProducts.fulfilled, (s, a) => { s.items = a.payload })
    b.addCase(fetchProduct.fulfilled, (s, a) => { s.current = a.payload })
  }
})

export default slice.reducer
