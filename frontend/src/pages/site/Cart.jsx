import { useDispatch, useSelector } from 'react-redux'
import { removeFromCart, clearCart } from '../../store/slices/cartSlice.js'
import { Link } from 'react-router-dom'

export default function Cart(){
  const { items } = useSelector((s)=>s.cart)
  const dispatch = useDispatch()
  const total = items.reduce((a,b)=>a + b.price * b.qty, 0)
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Cart</h1>
      {items.length===0 && <div>Your cart is empty.</div>}
      {items.map(i=> (
        <div key={i.id} className="flex items-center justify-between bg-white p-3 rounded border gap-3">
          <div className="flex items-center gap-3">
            <img src={i.image || 'https://via.placeholder.com/60'} alt={i.name} className="w-14 h-14 object-cover rounded" />
            <div>
              <div className="font-medium">{i.name}</div>
              <div className="text-sm text-gray-600">₹{i.price}</div>
            </div>
          </div>
          <div className="text-sm">Qty: {i.qty}</div>
          <div className="font-medium">₹{i.price * i.qty}</div>
          <button onClick={()=>dispatch(removeFromCart(i.id))} className="text-red-600">Remove</button>
        </div>
      ))}
      <div className="flex items-center justify-between">
        <div className="font-semibold">Total: ₹{total.toFixed(2)}</div>
        <div className="flex gap-2">
          <button onClick={()=>dispatch(clearCart())} className="border rounded px-3 py-1">Clear</button>
          <Link to="/checkout" className="bg-black text-white rounded px-3 py-1">Buy Now</Link>
        </div>
      </div>
    </div>
  )
}
