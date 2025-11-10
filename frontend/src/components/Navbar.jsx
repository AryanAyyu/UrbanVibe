import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/slices/authSlice.js'

export default function Navbar() {
  const { user } = useSelector((s) => s.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const onLogout = () => { dispatch(logout()); navigate('/'); }

  const cartCount = useSelector((s)=> s.cart.items.reduce((a,b)=> a + (b.qty||1), 0))
  const wishCount = useSelector((s)=> s.wishlist.items.length)

  const [open, setOpen] = useState(false)
  return (
    <nav className="bg-[#800020] text-white">
      <div className="max-w-7xl mx-auto p-4 flex items-center gap-4">
        <Link to="/" className="font-bold text-xl">UrbanVibe</Link>
        <Link to="/categories" className="hover:text-gray-200">Categories</Link>

        <div className="ml-auto flex items-center gap-3">
          {user && (
            <span className="hidden sm:inline text-sm">Hi, {user.name || (user.isAdmin ? 'Admin' : 'User')}</span>
          )}
          <Link to="/wishlist" className="relative inline-flex items-center justify-center w-9 h-9 rounded hover:bg-white/10" aria-label="Wishlist">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M12.1 8.64l-.1.1-.11-.11C10.14 6.86 7.28 6.86 5.53 8.6c-1.76 1.76-1.76 4.62 0 6.37L12 21.44l6.47-6.47c1.76-1.75 1.76-4.61 0-6.37-1.75-1.75-4.61-1.75-6.37 0z"/>
            </svg>
            {wishCount>0 && <span className="absolute -top-1 -right-1 text-[10px] bg-black text-white rounded-full px-1.5 py-0.5">{wishCount}</span>}
          </Link>
          <Link to="/cart" className="relative inline-flex items-center justify-center w-9 h-9 rounded hover:bg-white/10" aria-label="Cart">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M7 4h-2l-1 2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h9v-2h-8.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h5.72c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.3.12-.46 0-.55-.45-1-1-1h-14.31l-.94-2zm3 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm8 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
            {cartCount>0 && <span className="absolute -top-1 -right-1 text-[10px] bg-black text-white rounded-full px-1.5 py-0.5">{cartCount}</span>}
          </Link>

          {!user && <Link to="/login" className="px-3 py-1 rounded bg-black text-white hover:bg-black/90">Login</Link>}

          {user && (
            <div className="relative">
              <button onClick={()=>setOpen(o=>!o)} className="w-9 h-9 inline-flex items-center justify-center rounded hover:bg-white/10" aria-label="Menu">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/>
                </svg>
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg overflow-hidden z-20">
                  <Link onClick={()=>setOpen(false)} to="/profile" className="block px-3 py-2 hover:bg-gray-100">Profile</Link>
                  {!user.isAdmin && <Link onClick={()=>setOpen(false)} to="/orders" className="block px-3 py-2 hover:bg-gray-100">My Orders</Link>}
                  <Link onClick={()=>setOpen(false)} to="/order-status" className="block px-3 py-2 hover:bg-gray-100">Order Status</Link>
                  <Link onClick={()=>setOpen(false)} to="/help-center" className="block px-3 py-2 hover:bg-gray-100">Help Center</Link>
                  <Link onClick={()=>setOpen(false)} to="/contact" className="block px-3 py-2 hover:bg-gray-100">Contact</Link>
                  {user.isAdmin && <Link onClick={()=>setOpen(false)} to="/admin/dashboard" className="block px-3 py-2 hover:bg-gray-100">Admin</Link>}
                  <button onClick={()=>{ setOpen(false); onLogout() }} className="w-full text-left px-3 py-2 hover:bg-gray-100">Logout</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
