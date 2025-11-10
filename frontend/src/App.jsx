import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/site/Home.jsx'
import Categories from './pages/site/Categories.jsx'
import ProductDetails from './pages/site/ProductDetails.jsx'
import Login from './pages/site/Login.jsx'
import Signup from './pages/site/Signup.jsx'
import Cart from './pages/site/Cart.jsx'
import Wishlist from './pages/site/Wishlist.jsx'
import Checkout from './pages/site/Checkout.jsx'
import Orders from './pages/site/Orders.jsx'
import Profile from './pages/site/Profile.jsx'
import HelpCenter from './pages/content/HelpCenter.jsx'
import ShippingReturns from './pages/content/ShippingReturns.jsx'
import Contact from './pages/content/Contact.jsx'
import OrderStatus from './pages/site/OrderStatus.jsx'
import AdminDashboard from './pages/admin/Dashboard.jsx'
import AdminProducts from './pages/admin/Products.jsx'
import AdminOrders from './pages/admin/Orders.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import AdminRoute from './components/AdminRoute.jsx'

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div
        className="w-full"
        style={{
          backgroundImage: "url('https://i.pinimg.com/1200x/ce/fa/bb/cefabbcebea8d7e10f383ba5fd81ec98.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-7xl mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/shipping-returns" element={<ShippingReturns />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/order-status" element={<OrderStatus />} />

            <Route element={<AdminRoute />}> 
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
      <Footer />
    </div>
  )
}
