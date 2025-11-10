import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../../store/slices/productsSlice.js'
import { Link } from 'react-router-dom'

const CATS = ['Men','Women','Kids','Accessories']

export default function Categories() {
  const location = useLocation()
  const [category, setCategory] = useState(() => {
    const params = new URLSearchParams(location.search)
    return params.get('category') || ''
  })
  const [q, setQ] = useState('')
  const [sort, setSort] = useState('newest')
  const dispatch = useDispatch()
  const { items } = useSelector((s) => s.products)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const cat = params.get('category') || ''
    setCategory(cat)
  }, [location.search])

  useEffect(() => { dispatch(fetchProducts({ q, category, sort })) }, [dispatch, q, category, sort])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search products" className="border rounded px-3 py-2" />
        <select value={category} onChange={(e)=>setCategory(e.target.value)} className="border rounded px-3 py-2">
          <option value="">All Categories</option>
          {CATS.map(c=> <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={sort} onChange={(e)=>setSort(e.target.value)} className="border rounded px-3 py-2">
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((p) => (
          <Link key={p._id} to={`/product/${p._id}`} className="border rounded p-3 bg-white hover:shadow">
            <img src={p.images?.[0] || 'https://via.placeholder.com/300x300'} alt={p.name} className="w-full h-40 object-cover rounded" />
            <div className="mt-2 font-medium line-clamp-1">{p.name}</div>
            <div className="text-sm text-gray-600">₹{p.price}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
