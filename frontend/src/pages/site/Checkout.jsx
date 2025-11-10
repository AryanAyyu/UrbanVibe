import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import client from '../../api/client.js'
import { clearCart, removeFromCart } from '../../store/slices/cartSlice.js'

export default function Checkout(){
  const { items } = useSelector((s)=>s.cart)
  const location = useLocation()
  const buyNowItems = location.state?.buyNow || null
  const { user } = useSelector((s)=>s.auth)
  const dispatch = useDispatch()

  const itemsToBuy = buyNowItems || items
  const subtotal = itemsToBuy.reduce((a,b)=>a + b.price * b.qty, 0)
  const delivery = subtotal > 1999 ? 0 : (itemsToBuy.length > 0 ? 99 : 0)
  const total = subtotal + delivery

  const placeOrder = async () => {
    if(!user) return alert('Please login first')
    const totalAmount = total
    const products = itemsToBuy.map(i=> ({ product: i.id, qty: i.qty, price: i.price }))
    const { data } = await client.post('/orders', { products, totalAmount, address: 'Address here' })
    if (data?._id) {
      alert('Order placed')
      if (!buyNowItems) {
        dispatch(clearCart())
      }
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Checkout</h1>

      <div className="space-y-3">
        {itemsToBuy.map(i => (
          <div key={i.id} className="flex items-center justify-between bg-white p-3 rounded border gap-3">
            <div className="flex items-center gap-3">
              <img src={i.image || 'https://via.placeholder.com/60'} alt={i.name} className="w-14 h-14 object-cover rounded" />
              <div>
                <div className="font-medium">{i.name}</div>
                <div className="text-sm text-gray-600">Qty: {i.qty}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="font-medium">₹{(i.price * i.qty).toFixed(2)}</div>
              {!buyNowItems && (
                <button onClick={()=>dispatch(removeFromCart(i.id))} className="text-red-600 text-sm">Remove</button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded border max-w-md ml-auto space-y-2">
        <div className="flex justify-between text-sm"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between text-sm"><span>Delivery</span><span>{delivery === 0 ? 'Free' : `₹${delivery.toFixed(2)}`}</span></div>
        <div className="border-t pt-2 flex justify-between font-semibold"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
        <button disabled={itemsToBuy.length===0} onClick={placeOrder} className="w-full mt-2 bg-black text-white rounded px-4 py-2 disabled:opacity-50">Place Order</button>
        <div className="text-xs text-gray-500">Free delivery for orders above ₹1999. ₹99 delivery charge otherwise.</div>
      </div>
    </div>
  )
}
