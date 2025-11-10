import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import client from '../../api/client.js'
import img1 from "./assets/Hero2.png"
import img2 from "./assets/Hero3.png"
import img3 from "./assets/Hero4.png"
import img4 from "./assets/Hero5.png"
import AutoScrollInfinite from './AutoScrollInfinite.jsx'

export default function Home() {

const imgs = [
      img1,
      img2,
      img3,
      img4,
    ];

  const [featured, setFeatured] = useState([])
  const [recent, setRecent] = useState([])

  useEffect(() => {
    (async () => {
      const [fRes, rRes] = await Promise.all([
        client.get('/products', { params: { featured: true, limit: 4 } }),
        client.get('/products', { params: { sort: 'newest', limit: 4 } }),
      ])
      setFeatured(fRes.data || [])
      setRecent(rRes.data || [])
    })()
  }, [])

  const Grid = ({ items }) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((p) => (
        <Link key={p._id} to={`/product/${p._id}`} className="border rounded p-3 bg-white hover:shadow">
          <img src={p.images?.[0] || 'https://via.placeholder.com/300x300'} alt={p.name} className="w-full h-40 object-cover rounded" />
          <div className="mt-2 font-medium line-clamp-1">{p.name}</div>
          <div className="text-sm text-gray-600">₹{p.price}</div>
        </Link>
      ))}
    </div>
  )

  return (
    <div className="space-y-8">
      <section className="bg-black text-white rounded p-8 text-center">
        <h1 className="text-3xl font-bold">UrbanVibe</h1>
        <p className="text-gray-200">Streetwear & Casual Essentials</p>
      </section>

      <section>
        <div className="grid gap-4 md:grid-cols-3 md:grid-rows-2">
          <Link to="/categories" className="md:row-span-2 overflow-hidden rounded relative h-56 md:h-64">
            <img
              src="https://i.pinimg.com/736x/09/8c/68/098c68ef387f3f3950f5b40183468656.jpg"
              alt="New Collection"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute bottom-6 left-6 text-white">
              <div className="text-3xl md:text-4xl font-extrabold tracking-wide">NEW</div>
              <div className="text-3xl md:text-4xl font-extrabold tracking-wide">COLLECTION</div>
            </div>
          </Link>

          <Link to="/categories?category=Men" className="group relative rounded overflow-hidden h-28 md:h-32">
            <img src="https://i.pinimg.com/1200x/22/0d/2c/220d2c35673601972c13e24cb818ace2.jpg" alt="Men" className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-70 group-hover:blur-[1px]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white font-semibold text-lg drop-shadow">Men</span>
            </div>
          </Link>
          <Link to="/categories?category=Women" className="group relative rounded overflow-hidden h-28 md:h-32">
            <img src="https://i.pinimg.com/1200x/a1/82/a7/a182a704d8a762cb4f6f2f90135fe8c9.jpg" alt="Women" className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-70 group-hover:blur-[1px]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white font-semibold text-lg drop-shadow">Women</span>
            </div>
          </Link>
          <Link to="/categories?category=Kids" className="group relative rounded overflow-hidden h-28 md:h-32">
            <img src="https://i.pinimg.com/1200x/9a/54/9e/9a549ebf523ce8bfb8fdd0daf972e70c.jpg" alt="Kids" className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-70 group-hover:blur-[1px]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white font-semibold text-lg drop-shadow">Kids</span>
            </div>
          </Link>
          <Link to="/categories?category=Accessories" className="group relative rounded overflow-hidden h-28 md:h-32">
            <img src="https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=1200&auto=format&fit=crop" alt="Accessories" className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-70 group-hover:blur-[1px]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white font-semibold text-lg drop-shadow">Accessories</span>
            </div>
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Featured Products</h2>
        <Grid items={featured} />
      </section>

      {/* Scroll Images  */}
      <AutoScrollInfinite images={imgs}/>

      <section>
        <h2 className="text-xl font-semibold mb-4">Recent Products</h2>
        <Grid items={recent} />
      </section>
    </div>
  )
}
