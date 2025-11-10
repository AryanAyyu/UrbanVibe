import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginThunk } from '../../store/slices/authSlice.js'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const { user } = useSelector((s)=>s.auth)
  const navigate = useNavigate()

  useEffect(()=>{ if(user) navigate(user.isAdmin? '/admin/dashboard' : '/') },[user,navigate])

  const submit = async (e) => {
    e.preventDefault()
    const res = await dispatch(loginThunk({ email, password }))
    if (res.meta.requestStatus === 'fulfilled') {
      const isAdmin = res.payload.user?.isAdmin
      navigate(isAdmin ? '/admin/dashboard' : '/')
    }
  }

  return (
    <div className="max-w-sm mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Login</h1>
      <form onSubmit={submit} className="space-y-3">
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full border rounded px-3 py-2" required />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full border rounded px-3 py-2" required />
        <button className="w-full bg-black text-white rounded py-2">Login</button>
      </form>
      <p className="text-sm mt-3">No account? <Link to="/signup" className="underline">Sign up</Link></p>
    </div>
  )
}
