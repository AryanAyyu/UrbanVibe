import { Link } from 'react-router-dom'

export default function Footer(){
  return (
    <footer className="mt-10 bg-[#800020] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 grid gap-8 md:grid-cols-4">
        <div>
          <div className="font-bold text-xl">UrbanVibe</div>
          <p className="text-sm text-gray-200 mt-2">Streetwear & Casual Essentials. Stay in vibe.</p>
        </div>
        <div>
          <div className="font-semibold mb-3">Shop</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/categories" className="hover:underline hover:text-gray-200">All Categories</Link></li>
            <li><Link to="/categories?category=Men" className="hover:underline hover:text-gray-200">Men</Link></li>
            <li><Link to="/categories?category=Women" className="hover:underline hover:text-gray-200">Women</Link></li>
            <li><Link to="/categories?category=Accessories" className="hover:underline hover:text-gray-200">Accessories</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">Support</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/help-center" className="hover:underline hover:text-gray-200">Help Center</Link></li>
            <li><Link to="/shipping-returns" className="hover:underline hover:text-gray-200">Shipping & Returns</Link></li>
            <li><Link to="/order-status" className="hover:underline hover:text-gray-200">Order Status</Link></li>
            <li><Link to="/contact" className="hover:underline hover:text-gray-200">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">Stay Updated</div>
          <form onSubmit={(e)=>e.preventDefault()} className="space-y-2">
            <input type="email" placeholder="Email address" className="w-full border rounded px-3 py-2" />
            <button className="w-full bg-black text-white rounded px-3 py-2">Subscribe</button>
          </form>
          <div className="flex gap-3 mt-4 text-gray-200">
            <a href="#" aria-label="Instagram" className="hover:text-white">IG</a>
            <a href="#" aria-label="Twitter" className="hover:text-white">X</a>
            <a href="#" aria-label="YouTube" className="hover:text-white">YT</a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4 text-xs text-gray-200 flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} UrbanVibe. All rights reserved.</div>
          <div className="flex gap-3">
            <a href="#" className="hover:underline hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:underline hover:text-white">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
