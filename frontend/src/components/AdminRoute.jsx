import { Outlet, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function AdminRoute() {
  const { user } = useSelector((s) => s.auth)
  if (!user) return <Navigate to="/login" />
  if (!user.isAdmin) return <Navigate to="/" />
  return <Outlet />
}
