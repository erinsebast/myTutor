import React from 'react'
import styles from './Home.module.css'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'

const Home = () => {
  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      <Header />
      <section>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '800' }}>
          Your Personal Academic Coach
        </h1>
        <p style={{
          fontSize: '1.2rem',
          marginTop: '1rem',
          maxWidth: '600px',
          margin: 'auto',
          color: '#ccc'
        }}>
          An AI-powered assistant that helps you log sessions, monitor progress,
          and generate smart study plans personalized to you.
        </p>
        <button
          onClick={() => navigate('/login')}
          className={styles.glowingButton}
          style={{
            marginTop: '2rem',
            padding: '1rem 2rem',
            fontSize: '1rem',
            backgroundColor: '#facc15',
            color: 'black',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600'
          }}
        >
          Start Your Journey
        </button>
      </section>
    </div>
  )
}

export default Home