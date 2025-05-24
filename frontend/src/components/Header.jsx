import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')))

  // 🔁 Watch for login changes (triggered by login/logout)
  useEffect(() => {
    const checkLogin = () => {
      setUser(JSON.parse(localStorage.getItem('user')))
    }

    window.addEventListener('storage', checkLogin)
    return () => window.removeEventListener('storage', checkLogin)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    navigate('/')
  }

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        background: 'black',
        color: 'white',
        zIndex: 1000,
        boxSizing: 'border-box'
      }}
    >
      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
      <h2
  style={{ fontWeight: 800, margin: 0, cursor: 'pointer' }}
  onClick={() => navigate('/')}
>
  myTutor
</h2>

        
        {/* Center nav links */}
        <nav style={{ display: 'flex', gap: '2rem' }}>
          <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Home</a>
          <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Features</a>
          <a href="#" style={{ color: 'white', textDecoration: 'none' }}>About</a>
          {user && (
  <a
    onClick={() => navigate('/dashboard')}
    style={{ color: 'white', textDecoration: 'none', cursor: 'pointer' }}
  >
    Dashboard
  </a>
)}

        </nav>
      </div>

      {/* Right */}
      {!user ? (
        <button
          onClick={() => navigate('/login')}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            border: 'none',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
        >
          Log In
        </button>
      ) : (
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#1d4ed8',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            border: 'none',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
        >
          Log Out
        </button>
      )}
    </header>
  )
}

export default Header