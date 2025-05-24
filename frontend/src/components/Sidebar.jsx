// src/components/Sidebar.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Sidebar = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('user')
    window.location.href = '/' 
  }
  return (
    <aside style={{
      width: '220px',
      background: '#1e293b',
      color: 'white',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem'
    }}>
      <h2 
        style={{ cursor: 'pointer', marginBottom: '2rem' }} 
        onClick={() => navigate('/')}
      >
        myTutor
      </h2>
      
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <button onClick={() => navigate('/dashboard')} style={btnStyle}>📋 Dashboard</button>
        <button onClick={() => navigate('/grades/COSC3360')} style={btnStyle}>📈 Grades</button>
        <button onClick={() => navigate('/study')} style={btnStyle}>⏱ Study Session</button>
        <button onClick={() => navigate('/ai')} style={btnStyle}>🤖 AI Feedback</button>
      </nav>

      <button onClick={handleLogout} style={{ ...btnStyle, marginTop: '2rem', color: 'white' }}>
        🔓 Log Out
      </button>

    </aside>
  )
}
const btnStyle = {
  background: 'none',
  border: 'none',
  color: 'white',
  fontSize: '1rem',
  cursor: 'pointer',
  textAlign: 'left'
}

export default Sidebar