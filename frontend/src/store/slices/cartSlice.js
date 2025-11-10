import { createSlice } from '@reduxjs/toolkit'

const saved = JSON.parse(localStorage.getItem('cart') || '[]')
const slice = createSlice({
  name: 'cart',
  initialState: { items: saved },
  reducers: {
    addToCart(state, action) {
      const item = action.payload
      const found = state.items.find((i) => i.id === item.id)
      if (found) found.qty += item.qty || 1
      else state.items.push({ ...item, qty: item.qty || 1 })
      localStorage.setItem('cart', JSON.stringify(state.items))
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload)
      localStorage.setItem('cart', JSON.stringify(state.items))
    },
    clearCart(state) { state.items = []; localStorage.setItem('cart', '[]') }
  }
})

export const { addToCart, removeFromCart, clearCart } = slice.actions
export default slice.reducer
