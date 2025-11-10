import { useEffect, useState } from 'react'
import client from '../../api/client.js'

export default function AdminProducts(){
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({ name:'', price:'', category:'', brand:'', description:'', stock:0, size:'', color:'', imageUrls:'' })
  const [files, setFiles] = useState([])

  const load = async ()=>{ const { data } = await client.get('/products'); setProducts(data) }
  useEffect(()=>{ load() },[])

  const submit = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    Object.entries(form).forEach(([k,v])=> fd.append(k, v))
    Array.from(files).forEach((f)=> fd.append('images', f))
    await client.post('/admin/product', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    setForm({ name:'', price:'', category:'', brand:'', description:'', stock:0, size:'', color:'', imageUrls:'' }); setFiles([])
    await load()
  }

  const del = async (id)=>{ await client.delete(`/admin/product/${id}`); await load() }
  const toggleFeatured = async (p) => {
    try {
      await client.patch(`/admin/product/${p._id}/featured`, { featured: !p.featured })
      await load()
    } catch (e) {
      const msg = e?.response?.data?.message || 'Failed to update featured state'
      alert(msg)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Products</h1>
      <form onSubmit={submit} className="grid md:grid-cols-2 gap-3 bg-white p-4 rounded border">
        <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="border rounded px-3 py-2" required />
        <input placeholder="Price" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} className="border rounded px-3 py-2" required />
        <input placeholder="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="border rounded px-3 py-2" required />
        <input placeholder="Brand" value={form.brand} onChange={e=>setForm({...form,brand:e.target.value})} className="border rounded px-3 py-2" />
        <input placeholder="Color" value={form.color} onChange={e=>setForm({...form,color:e.target.value})} className="border rounded px-3 py-2" />
        <input placeholder="Sizes (comma separated)" value={form.size} onChange={e=>setForm({...form,size:e.target.value})} className="border rounded px-3 py-2 md:col-span-2" />
        <input placeholder="Image URLs (comma separated)" value={form.imageUrls} onChange={e=>setForm({...form,imageUrls:e.target.value})} className="border rounded px-3 py-2 md:col-span-2" />
        <textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="border rounded px-3 py-2 md:col-span-2" />
        <input type="number" placeholder="Stock" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} className="border rounded px-3 py-2" />
        <input type="file" multiple onChange={e=>setFiles(e.target.files)} className="md:col-span-2" />
        <button className="bg-black text-white rounded px-4 py-2 md:col-span-2">Add Product</button>
      </form>

      <div className="grid md:grid-cols-3 gap-4">
        {products.map(p=> (
          <div key={p._id} className="bg-white border rounded p-3">
            <img src={p.images?.[0] || 'https://via.placeholder.com/300x300'} alt={p.name} className="w-full h-40 object-cover rounded" />
            <div className="mt-2 font-medium">{p.name}</div>
            {p.color && <div className="text-xs text-gray-500">Color: {p.color}</div>}
            <div className="text-xs mt-1">Featured: <span className={p.featured? 'text-green-600':'text-gray-500'}>{String(p.featured)}</span></div>
            <div className="text-sm text-gray-600">₹{p.price}</div>
            <div className="flex gap-2 mt-2">
              <button onClick={()=>del(p._id)} className="text-red-600">Delete</button>
              <button onClick={()=>toggleFeatured(p)} className="text-blue-600">{p.featured? 'Unfeature':'Make Featured'}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
