import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import client from '../../api/client.js'

export default function Orders(){
  const [orders, setOrders] = useState([])
  const [rating, setRating] = useState({})
  const [hover, setHover] = useState({})
  const [rated, setRated] = useState({}) // key: `${orderId}:${productId}` => true
  const user = useSelector((s)=>s.auth.user)
  useEffect(()=>{ (async()=>{ const { data } = await client.get('/orders/me'); setOrders(data) })() },[])

  // Compute and load which items are already rated by this user for each order
  useEffect(()=>{ (async()=>{
    if(!user || orders.length===0) return
    // Collect unique product ids
    const productIds = new Set()
    orders.forEach(o=> o.products?.forEach(p=> productIds.add(p.product?._id || p.product)))
    const idArr = Array.from(productIds)
    // Fetch all products
    const prods = await Promise.all(idArr.map(async(pid)=>{
      try{ const { data } = await client.get(`/products/${pid}`); return { pid, data } }catch{ return { pid, data: null } }
    }))
    const byId = Object.fromEntries(prods.map(x=> [x.pid, x.data]))
    const next = {}
    orders.forEach(o=>{
      o.products?.forEach(p=>{
        const pid = p.product?._id || p.product
        const key = `${o._id}:${pid}`
        const prod = byId[pid]
        const isRated = !!prod?.ratings?.some(r => String(r.user) === String(user.id) && String(r.orderId) === String(o._id))
        next[key] = isRated
      })
    })
    setRated(next)
  })() },[orders, user])

  const cancel = async (id) => {
    if(!confirm('Cancel this order?')) return
    const { data } = await client.patch(`/orders/${id}/cancel`)
    setOrders(prev => prev.map(o => o._id === id ? data : o))
  }

  const submitRating = async (productId, orderId) => {
    const val = rating[productId]
    if(!val) { alert('Please select stars first'); return }
    try{
      await client.post(`/products/${productId}/rate`, { value: val, orderId })
      alert('Thanks for rating!')
      setRating(r=>({ ...r, [productId]: 0 }))
      setHover(h=>({ ...h, [productId]: 0 }))
      setRated(m=>({ ...m, [`${orderId}:${productId}`]: true }))
    }catch(err){
      const msg = err?.response?.data?.message || 'Could not submit rating'
      alert(msg)
    }
  }
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">My Orders</h1>
      {orders.length===0 && <div>No orders yet.</div>}
      {orders.map(o=> (
        <div key={o._id} className="bg-white border rounded p-3">
          <div className="flex flex-wrap gap-4 text-sm text-gray-700">
            <div><span className="font-medium">Order ID:</span> {o.orderId}</div>
            <div><span className="font-medium">Date:</span> {new Date(o.createdAt).toLocaleString()}</div>
            <div><span className="font-medium">Total:</span> ₹{o.totalAmount}</div>
            <div><span className="font-medium">Status:</span> {o.orderStatus}</div>
          </div>
          <div className="ml-1 mt-2 space-y-2">
            {o.products?.map((p) => {
              const pid = p.product?._id || p.product
              return (
                <div key={p._id} className="flex items-center justify-between pr-2">
                  <div className="text-sm list-item ml-4">{p.product?.name || p.product} × {p.qty}</div>
                  {o.orderStatus === 'delivered' && !rated[`${o._id}:${pid}`] && (
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1,2,3,4,5].map(n => (
                          <button
                            key={n}
                            onMouseEnter={()=>setHover(h=>({...h, [pid]: n}))}
                            onMouseLeave={()=>setHover(h=>({...h, [pid]: 0}))}
                            onClick={()=>setRating(r=>({...r, [pid]: n}))}
                            aria-label={`${n} star`}
                            className="p-0.5"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={(hover[pid]||rating[pid]||0) >= n ? '#fbbf24' : '#e5e7eb'} stroke="#000" strokeWidth="1.25" className="w-5 h-5">
                              <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.787 1.402 8.168L12 18.896l-7.336 3.87 1.402-8.168L.132 9.211l8.2-1.193z"/>
                            </svg>
                          </button>
                        ))}
                      </div>
                      <button onClick={()=>submitRating(pid, o._id)} disabled={!rating[pid]} className="px-2 py-0.5 rounded border text-xs disabled:opacity-50">Rate</button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          {o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled' && (
            <div className="mt-3">
              <button onClick={()=>cancel(o._id)} className="px-3 py-1 text-white bg-red-600 rounded text-sm">Cancel Order</button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
