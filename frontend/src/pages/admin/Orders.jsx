import { useEffect, useState } from 'react'
import client from '../../api/client.js'

export default function Orders(){
  const [orders, setOrders] = useState([])
  useEffect(()=>{ (async()=>{ const { data } = await client.get('/orders'); setOrders(data) })() },[])

  const setStatus = async (id, status) => {
    const { data } = await client.patch(`/orders/${id}/status`, { status })
    setOrders((prev)=> prev.map(o=> o._id===id? data: o))
  }
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Orders</h1>
      {orders.map(o=> (
        <div key={o._id} className="bg-white border rounded p-3">
          <div className="flex flex-wrap gap-4 text-sm text-gray-700">
            <div><span className="font-medium">Order ID:</span> {o.orderId}</div>
            <div><span className="font-medium">Date:</span> {new Date(o.createdAt).toLocaleString()}</div>
            <div><span className="font-medium">Customer:</span> {o.userId?.name || '-'} ({o.userId?.email || '-'})</div>
            <div><span className="font-medium">Total:</span> ₹{o.totalAmount}</div>
            <div><span className="font-medium">Status:</span> {o.orderStatus}</div>
          </div>
          <ul className="list-disc ml-5 mt-2 text-sm">
            {o.products?.map((p) => (
              <li key={p._id}>{p.product?.name || p.product} × {p.qty}</li>
            ))}
          </ul>
          {o.orderStatus === 'pending' && (
            <div className="mt-3">
              <button onClick={()=>setStatus(o._id, 'accepted')} className="px-3 py-1 text-white bg-green-600 rounded text-sm">Accept Order</button>
            </div>
          )}
          {o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled' && (
            <div className="mt-2">
              <button onClick={()=>setStatus(o._id, 'delivered')} className="px-3 py-1 text-white bg-black rounded text-sm">Mark Delivered</button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
