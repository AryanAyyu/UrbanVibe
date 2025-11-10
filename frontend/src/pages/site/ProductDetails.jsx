import { useEffect, useMemo, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProduct } from '../../store/slices/productsSlice.js'
import { addToCart } from '../../store/slices/cartSlice.js'
import { addToWishlist } from '../../store/slices/wishlistSlice.js'
import client from '../../api/client.js'

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { current: p } = useSelector((s)=>s.products)
  const { user } = useSelector((s)=>s.auth)
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [related, setRelated] = useState([])
  const [canRate, setCanRate] = useState(false)

  useEffect(()=>{ dispatch(fetchProduct(id)) },[dispatch,id])
  useEffect(()=>{
    (async()=>{
      if(user && !user.isAdmin){
        try{
          const { data } = await client.get(`/products/${id}/can-rate`)
          setCanRate(!!data?.canRate)
        }catch{ setCanRate(false) }
      } else { setCanRate(false) }
    })()
  },[id, user])
  useEffect(()=>{
    if(!p?.category) return
    ;(async()=>{
      const { data } = await client.get('/products', { params: { category: p.category, limit: 4 } })
      const filt = data.filter(x=> x._id !== p._id).slice(0,3)
      setRelated(filt)
    })()
  },[p])
  const avg = useMemo(()=>{
    const val = p?.ratingAverage || 0
    return Math.round(val * 10) / 10
  },[p])

  const submitRating = async () => {
    if(!user) return alert('Please login to rate')
    if(!rating) return
    const { data } = await client.post(`/products/${p._id}/rate`, { value: rating })
    dispatch(fetchProduct(p._id))
  }

  if(!p) return <div>Loading...</div>

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6 items-start">
        <div className="w-full max-w-md">
          <img src={p.images?.[0] || 'https://via.placeholder.com/600x600'} alt={p.name} className="w-full h-auto rounded border" />
        </div>
        <div>
        <h1 className="text-2xl font-semibold">{p.name}</h1>
        <div className="text-xl my-2">₹{p.price}</div>
        <p className="text-gray-700 mb-4">{p.description}</p>
        <div className="flex items-center gap-3 mb-4">
          <div className="text-sm text-gray-700">Avg: {avg} ({p.ratingCount || 0})</div>
          {canRate && (
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1,2,3,4,5].map(n=> (
                  <button key={n} onMouseEnter={()=>setHover(n)} onMouseLeave={()=>setHover(0)} onClick={()=>setRating(n)} aria-label={`${n} star`} className="p-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={(hover||rating) >= n ? '#fbbf24' : '#e5e7eb'} stroke="#000" strokeWidth="1.25" className="w-6 h-6">
                      <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.787 1.402 8.168L12 18.896l-7.336 3.87 1.402-8.168L.132 9.211l8.2-1.193z"/>
                    </svg>
                  </button>
                ))}
              </div>
              <button onClick={submitRating} className="px-3 py-1 rounded border">Submit</button>
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <button onClick={()=>dispatch(addToCart({ id: p._id, name: p.name, price: p.price, image: p.images?.[0] }))} className="px-4 py-2 bg-black text-white rounded">Add to Cart</button>
          <button onClick={()=>dispatch(addToWishlist({ id: p._id, name: p.name }))} className="px-4 py-2 border rounded">Wishlist</button>
          <button onClick={()=>navigate('/checkout', { state: { buyNow: [{ id: p._id, name: p.name, price: p.price, image: p.images?.[0], qty: 1 }] } })} className="px-4 py-2 border rounded bg-white/70">Buy Now</button>
        </div>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Related Products</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {related.map(r => (
            <Link key={r._id} to={`/product/${r._id}`} className="block rounded border bg-white/70 backdrop-blur">
              <img src={r.images?.[0] || 'https://via.placeholder.com/400x400'} alt={r.name} className="w-full h-40 object-cover rounded-t" />
              <div className="p-3">
                <div className="font-medium text-sm line-clamp-1">{r.name}</div>
                <div className="text-sm">₹{r.price}</div>
              </div>
            </Link>
          ))}
          {related.length===0 && <div className="text-sm text-gray-600">No related products.</div>}
        </div>
      </div>
    </div>
  )
}
