// src/layouts/DashboardLayout.jsx
import React from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

const DashboardLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flexGrow: 1, paddingTop: '4rem', paddingLeft: '2rem', paddingRight: '2rem' }}>
        {children}
      </div>
    </div>
  )
}

export default DashboardLayout