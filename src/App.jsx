import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase
const supabaseUrl = 'https://zuqyorzyztylsewmgkcc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cXlvcnp5enR5bHNld21na2NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNzQ4NTEsImV4cCI6MjA4MTY1MDg1MX0.pMl4aY8_baUFVRvpGcHk2OlGTP7a_g-sBlTbF68Jt8k'
const supabase = createClient(supabaseUrl, supabaseKey)

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: ''
  })
  const [status, setStatus] = useState('idle') // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('')
  const formRef = useRef(null)
  const containerRef = useRef(null)

  // 3D Tilt Effect
  useEffect(() => {
    const container = containerRef.current
    const form = formRef.current

    if (!container || !form) return

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const rotateX = ((y - centerY) / centerY) * -1 // Max 1deg
      const rotateY = ((x - centerX) / centerX) * 1

      form.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    }

    const handleMouseLeave = () => {
      form.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)'
      form.style.transition = 'transform 0.5s ease-out'
    }

    const handleMouseEnter = () => {
      form.style.transition = 'none'
    }

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)
    container.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
      container.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [status]) // Re-run if status changes (e.g. success view)

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const { error } = await supabase
        .from('waitlist')
        .insert([{
          name: formData.name,
          email: formData.email,
          role: formData.role
        }])

      if (error) throw error

      setStatus('success')
    } catch (err) {
      console.error('Error:', err)
      setStatus('error')
      setErrorMessage(err.message || 'Something went wrong.')
    }
  }

  return (
    <>
      <div class="background-blobs">
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>
        <div class="blob blob-3"></div>
      </div>

      <main className="container" ref={containerRef}>
        <header className="header animate-in">
          <div className="badge">Early Access</div>
          <h1>Join the AI Mentor Waitlist</h1>
          <p>Get early access to an AI mentor built for founders, agency owners, and entrepreneurs.</p>
        </header>

        {status === 'success' ? (
          <div
            className="waitlist-form animate-in"
            style={{ textAlign: 'center', padding: '4rem 2rem' }}
            ref={formRef}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 1.5rem', display: 'block' }}>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>You're on the list!</h2>
            <p style={{ color: '#4b5563' }}>Keep an eye on your inbox. We'll be in touch soon.</p>
          </div>
        ) : (
          <form className="waitlist-form animate-in" onSubmit={handleSubmit} ref={formRef}>
            {/* Identity Group */}
            <div className="form-section">
              <div className="input-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder="Jane Doe"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="jane@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label htmlFor="role">Role</label>
                <div className="select-wrapper">
                  <select
                    id="role"
                    name="role"
                    required
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="" disabled>Select one</option>
                    <option value="founder">Founder</option>
                    <option value="agency_owner">Agency owner</option>
                    <option value="freelancer">Freelancer</option>
                    <option value="student">Student</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {status === 'error' && (
              <div style={{ color: '#ef4444', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center' }}>
                {errorMessage}
              </div>
            )}

            <button type="submit" className="submit-btn" disabled={status === 'loading'}>
              {status === 'loading' ? 'Joining...' : 'Join the Waitlist'}
            </button>

            <p className="disclaimer">
              By joining, you agree to receive occasional updates about the product launch. No spam, ever.
            </p>
          </form>
        )}
      </main>
    </>
  )
}

export default App
