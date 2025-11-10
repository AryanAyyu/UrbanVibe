import { createSlice } from '@reduxjs/toolkit'

const saved = JSON.parse(localStorage.getItem('wishlist') || '[]')
const slice = createSlice({
  name: 'wishlist',
  initialState: { items: saved },
  reducers: {
    addToWishlist(state, action) {
      const item = action.payload
      if (!state.items.find((i) => i.id === item.id)) state.items.push(item)
      localStorage.setItem('wishlist', JSON.stringify(state.items))
    },
    removeFromWishlist(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload)
      localStorage.setItem('wishlist', JSON.stringify(state.items))
    }
  }
})

export const { addToWishlist, removeFromWishlist } = slice.actions
export default slice.reducer
