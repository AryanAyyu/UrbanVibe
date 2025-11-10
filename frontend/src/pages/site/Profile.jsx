import { useEffect, useState } from 'react'
import client from '../../api/client.js'

export default function Profile(){
  const [me, setMe] = useState(null)
  const [orders, setOrders] = useState([])
  const [form, setForm] = useState({ name: '', password: '' })
  const [saving, setSaving] = useState(false)

  useEffect(()=>{ (async()=>{
    try{
      const meRes = await client.get('/auth/me');
      setMe(meRes.data); setForm(f=>({ ...f, name: meRes.data.name }))
      try{
        const ordersRes = await client.get('/orders/me');
        setOrders(ordersRes.data)
      }catch(err){
        console.error('Failed to load orders', err)
        alert('Could not load your orders right now.')
      }
    }catch(err){
      console.error('Failed to load profile', err)
      alert('Your session may have expired. Please login again.')
    }
  })() },[])

  const save = async (e)=>{
    e.preventDefault(); setSaving(true)
    try{
      const { data } = await client.put('/auth/me', { name: form.name, password: form.password || undefined })
      setMe(data); setForm({ name: data.name, password: '' })
      alert('Profile updated')
    } finally{ setSaving(false) }
  }

  if(!me) return <div>Loading...</div>

  const cancel = async (id) => {
    if(!confirm('Cancel this order?')) return
    const { data } = await client.patch(`/orders/${id}/cancel`)
    setOrders(prev => prev.map(o => o._id === id ? data : o))
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded border">
        <h2 className="text-lg font-semibold mb-3">Profile</h2>
        <form onSubmit={save} className="space-y-3">
          <div>
            <label className="text-sm text-gray-600">Name</label>
            <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input value={me.email} disabled className="w-full border rounded px-3 py-2 bg-gray-100" />
          </div>
          <div>
            <label className="text-sm text-gray-600">New Password</label>
            <input type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} className="w-full border rounded px-3 py-2" placeholder="Leave blank to keep current" />
          </div>
          <button disabled={saving} className="bg-black text-white rounded px-4 py-2">{saving ? 'Saving...' : 'Save changes'}</button>
        </form>
      </div>

      <div className="bg-white p-4 rounded border">
        <h2 className="text-lg font-semibold mb-3">Order History</h2>
        {orders.length===0 && <div className="text-sm text-gray-600">No orders yet.</div>}
        <div className="space-y-3">
          {orders.map(o => (
            <div key={o._id} className="border rounded p-3">
              <div className="text-sm text-gray-700 flex flex-wrap gap-4">
                <div><span className="font-medium">Order ID:</span> {o.orderId}</div>
                <div><span className="font-medium">Date:</span> {new Date(o.createdAt).toLocaleString()}</div>
                <div><span className="font-medium">Total:</span> ₹{o.totalAmount}</div>
                <div><span className="font-medium">Status:</span> {o.orderStatus}</div>
              </div>
              <ul className="list-disc ml-5 mt-2 text-sm">
                {o.products?.map((p) => (
                  <li key={p._id}>{p.product?.name || p.product} × {p.qty}</li>
                ))}
              </ul>
            </div>
          ))}
          {orders.map(o => (
            <div key={o._id} className="mt-2">
              {o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled' && (
                <button onClick={()=>cancel(o._id)} className="px-3 py-1 text-white bg-red-600 rounded text-sm">Cancel Order</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
