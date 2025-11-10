import { useDispatch, useSelector } from 'react-redux'
import { removeFromWishlist } from '../../store/slices/wishlistSlice.js'

export default function Wishlist(){
  const { items } = useSelector((s)=>s.wishlist)
  const dispatch = useDispatch()
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Wishlist</h1>
      {items.length===0 && <div>No items yet.</div>}
      {items.map(i=> (
        <div key={i.id} className="flex items-center justify-between bg-white p-3 rounded border">
          <div>{i.name}</div>
          <button onClick={()=>dispatch(removeFromWishlist(i.id))} className="text-red-600">Remove</button>
        </div>
      ))}
    </div>
  )
}
