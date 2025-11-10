import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { registerThunk } from '../../store/slices/authSlice.js'
import { useNavigate } from 'react-router-dom'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    const res = await dispatch(registerThunk({ name, email, password }))
    if (res.meta.requestStatus === 'fulfilled') navigate('/')
  }

  return (
    <div className="max-w-sm mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Sign Up</h1>
      <form onSubmit={submit} className="space-y-3">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" className="w-full border rounded px-3 py-2" required />
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full border rounded px-3 py-2" required />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full border rounded px-3 py-2" required />
        <button className="w-full bg-black text-white rounded py-2">Create account</button>
      </form>
    </div>
  )
}
