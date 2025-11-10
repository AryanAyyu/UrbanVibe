import { useEffect, useMemo, useState } from 'react'
import client from '../../api/client.js'

export default function OrderStatus(){
  const [orders, setOrders] = useState([])
  const [q, setQ] = useState('')
  useEffect(()=>{ (async()=>{ const { data } = await client.get('/orders/me'); setOrders(data) })() },[])

  const filtered = useMemo(()=>{
    const term = q.trim().toLowerCase()
    if (!term) return orders
    return orders.filter(o => (o.orderId||'').toLowerCase().includes(term))
  }, [q, orders])

  const cancel = async (id) => {
    if(!confirm('Cancel this order?')) return
    const { data } = await client.patch(`/orders/${id}/cancel`)
    setOrders(prev => prev.map(o => o._id === id ? data : o))
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Order Status</h1>
      <div className="flex gap-2 items-center">
        <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search by Order ID (e.g., UV-20250101-XXXXXX)" className="border rounded px-3 py-2 w-full max-w-md" />
      </div>

      {filtered.length===0 && <div className="text-sm text-gray-600">No orders found.</div>}

      <div className="space-y-3">
        {filtered.map(o => (
          <div key={o._id} className="bg-white border rounded p-3">
            <div className="flex flex-wrap gap-4 text-sm text-gray-700">
              <div><span className="font-medium">Order ID:</span> {o.orderId}</div>
              <div><span className="font-medium">Placed:</span> {new Date(o.createdAt).toLocaleString()}</div>
              <div><span className="font-medium">Total:</span> ₹{o.totalAmount}</div>
              <div><span className="font-medium">Status:</span> {o.orderStatus}</div>
            </div>
            <ul className="list-disc ml-5 mt-2 text-sm">
              {o.products?.map((p) => (
                <li key={p._id}>{p.product?.name || p.product} × {p.qty}</li>
              ))}
            </ul>
            {o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled' && (
              <div className="mt-3">
                <button onClick={()=>cancel(o._id)} className="px-3 py-1 text-white bg-red-600 rounded text-sm">Cancel Order</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
