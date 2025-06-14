import React, { useState, useEffect } from 'react'
import styles from './Login.module.css'
import { useNavigate, Link } from 'react-router-dom'
import Header from '../components/Header.jsx'
import axios from 'axios'

const Login = () => {
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('Email is required')
      return false
    }
    
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address')
      return false
    }
    
    if (!formData.password) {
      setError('Password is required')
      return false
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    try {
      setLoading(true)
      setError('')
      
      const response = await axios.post('http://localhost:8000/login', {
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      })
      
      console.log('User logged in:', response.data)
      
      // Store user data
      localStorage.setItem('user', JSON.stringify(response.data))
      
      // Navigate to dashboard
      navigate('/dashboard')
      
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message)
      
      if (error.response?.status === 401) {
        setError('Invalid email or password')
      } else if (error.response?.status === 404) {
        setError('Account not found. Please check your email or register.')
      } else if (error.response?.status >= 500) {
        setError('Server error. Please try again later.')
      } else {
        setError('Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.glow}></div>
        
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <h2 className={styles.heading}>Welcome Back</h2>
            <p className={styles.subtext}>Sign in to your account to continue</p>
          </div>

          {error && (
            <div className={styles.errorMessage} role="alert">
              {error}
            </div>
          )}

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                className={`${styles.input} ${error && !formData.email ? styles.inputError : ''}`}
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                required
                autoComplete="email"
                aria-describedby={error ? "error-message" : undefined}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <div className={styles.passwordContainer}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  className={`${styles.input} ${styles.passwordInput} ${error && !formData.password ? styles.inputError : ''}`}
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  autoComplete="current-password"
                  aria-describedby={error ? "error-message" : undefined}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={togglePasswordVisibility}
                  disabled={loading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className={`${styles.button} ${loading ? styles.buttonLoading : ''}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className={styles.spinner}></span>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className={styles.formFooter}>
            <p className={styles.switchText}>
              Don't have an account?{' '}
              <Link to="/register" className={styles.switchLink}>
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login