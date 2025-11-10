import { useState } from 'react'
import emailjs from '@emailjs/browser'

export default function Contact(){
  const [form, setForm] = useState({ name:'', email:'', phone:'', message:'' })
  const [sending, setSending] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setSending(true)
    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      if (!serviceId || !templateId || !publicKey) throw new Error('EmailJS env not configured')

      const params = {
        from_name: form.name,
        from_email: form.email,
        phone: form.phone,
        message: form.message,
      }
      await emailjs.send(serviceId, templateId, params, { publicKey })
      alert('Message sent successfully!')
      setForm({ name:'', email:'', phone:'', message:'' })
    } catch (e) {
      alert(e?.message || 'Failed to send message')
    } finally { setSending(false) }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold mb-4">Contact Us</h1>
      <p className="text-gray-700 mb-6">We’re here to help! Whether you have questions about your order, need support with returns, or just want to say hello — feel free to reach out.</p>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 border rounded">
          <h2 className="font-semibold mb-2">Customer Support</h2>
          <p>📧 Email: <strong>support@urbanvibe.com</strong></p>
          <p>📱 Phone / WhatsApp: <strong>+91 9XXXXXXXXX</strong></p>
          <p>⏰ Support Hours: Monday – Saturday | 10:00 AM – 7:00 PM (IST)</p>
        </div>
        <div className="bg-white p-4 border rounded">
          <h2 className="font-semibold mb-2">Business / Collaboration</h2>
          <p>For partnerships, influencer collaboration, or wholesale queries:</p>
          <p>📩 <strong>business@urbanvibe.com</strong></p>
        </div>
      </div>

      <div className="bg-white p-4 border rounded mb-8">
        <h2 className="font-semibold mb-2">Track / Return Your Order</h2>
        <ul className="list-disc ml-5 text-sm">
          <li>🔗 www.urbanvibe.com/track-order</li>
          <li>🔗 www.urbanvibe.com/returns</li>
        </ul>
      </div>

      <div className="bg-white p-4 border rounded mb-8">
        <h2 className="font-semibold mb-2">Office Address</h2>
        <p>UrbanVibe Clothing (Head Office)</p>
        <p>Sector xx, Road xx</p>
        <p>City – State, PIN: xxxxxx</p>
        <p>India</p>
      </div>

      <div className="bg-white p-4 border rounded mb-8">
        <h2 className="font-semibold mb-2">Connect With Us</h2>
        <ul className="list-disc ml-5 text-sm">
          <li>📸 Instagram: @urbanvibe</li>
          <li>📘 Facebook: UrbanVibe</li>
          <li>🐦 Twitter (X): @urbanvibe</li>
          <li>🎥 YouTube: UrbanVibe Official</li>
        </ul>
      </div>

      <div className="bg-white p-4 border rounded">
        <h2 className="font-semibold mb-4">Have a Question?</h2>
        <form onSubmit={submit} className="grid gap-3">
          <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="Name" className="border rounded px-3 py-2" required />
          <input type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} placeholder="Email" className="border rounded px-3 py-2" required />
          <input value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} placeholder="Phone (optional)" className="border rounded px-3 py-2" />
          <textarea value={form.message} onChange={e=>setForm({...form, message:e.target.value})} placeholder="Message" className="border rounded px-3 py-2" rows={5} required />
          <button disabled={sending} className="bg-black text-white rounded px-4 py-2">{sending? 'Sending...':'Submit'}</button>
        </form>
      </div>
    </div>
  )
}
