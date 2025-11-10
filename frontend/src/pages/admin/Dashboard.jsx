import { Link } from 'react-router-dom'

export default function Dashboard(){
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/admin/products" className="p-6 bg-white border rounded">Manage Products</Link>
        <Link to="/admin/orders" className="p-6 bg-white border rounded">View Orders</Link>
      </div>
    </div>
  )
}
