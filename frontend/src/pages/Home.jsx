import React, { useEffect } from 'react'
import styles from './Home.module.css'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'

const Home = () => {
  const navigate = useNavigate()

  // Redirect if already logged in
  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        JSON.parse(userData)
        navigate('/dashboard')
      } catch (err) {
        // Invalid data, clear it
        localStorage.removeItem('user')
      }
    }
  }, [navigate])

  const handleGetStarted = () => {
    navigate('/register')
  }

  const handleLearnMore = () => {
    // Smooth scroll to features section
    document.getElementById('features')?.scrollIntoView({ 
      behavior: 'smooth' 
    })
  }

  return (
    <div className={styles.container}>
      <Header />
      
      {/* Animated background elements */}
      <div className={styles.glow}></div>
      <div className={styles.secondaryGlow}></div>
      
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heading}>
            Your Personal Academic Coach
          </h1>
          <p className={styles.subtext}>
            An AI-powered assistant that helps you log sessions, monitor progress,
            and generate smart study plans personalized to your learning style.
          </p>
          
          <div className={styles.buttonGroup}>
            <button
              onClick={handleGetStarted}
              className={`${styles.primaryButton} ${styles.glowingButton}`}
            >
              Start Your Journey
            </button>
            <button
              onClick={handleLearnMore}
              className={styles.secondaryButton}
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.features}>
        <div className={styles.featuresContainer}>
          <h2 className={styles.featuresTitle}>Why Choose Our Platform?</h2>
          
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📊</div>
              <h3>Grade Tracking</h3>
              <p>Monitor your academic performance with detailed grade analytics and progress visualization.</p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>⏱️</div>
              <h3>Study Sessions</h3>
              <p>Track your study time and build consistent learning habits with our session timer.</p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🎯</div>
              <h3>Smart Planning</h3>
              <p>Get personalized study recommendations based on your performance and goals.</p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📚</div>
              <h3>Course Management</h3>
              <p>Organize all your courses in one place with easy-to-use management tools.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2>Ready to Transform Your Learning?</h2>
          <p>Join thousands of students who have improved their academic performance.</p>
          <button
            onClick={handleGetStarted}
            className={styles.ctaButton}
          >
            Get Started Free
          </button>
        </div>
      </section>
    </div>
  )
}

export default Home