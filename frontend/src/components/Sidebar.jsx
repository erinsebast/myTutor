// src/components/Sidebar.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Sidebar = () => {
  const navigate = useNavigate()
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