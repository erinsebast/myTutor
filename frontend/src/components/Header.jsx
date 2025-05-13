import React from 'react'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const navigate = useNavigate()

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
        <h2 style={{ fontWeight: 800, margin: 0 }}>myTutor</h2>
        
        {/* Center nav links */}
        <nav style={{ display: 'flex', gap: '2rem' }}>
          <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Home</a>
          <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Features</a>
          <a href="#" style={{ color: 'white', textDecoration: 'none' }}>About</a>
        </nav>
      </div>

      {/* Right */}
      <button
        onClick={() => navigate('/login')}
        style={{
          backgroundColor: '#facc15',
          color: 'black',
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
    </header>
  )
}

export default Header