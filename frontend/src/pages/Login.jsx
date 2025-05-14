import React, { useState } from 'react'
import styles from './Login.module.css'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'
import axios from 'axios'

const Login = () => {
    const navigate = useNavigate()
    
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
    
        try {
          const response = await await axios.post('http://localhost:8000/login', formData, {
            headers: {
              'Content-Type': 'application/json'
            }
          })          
          console.log('User logged:', response.data)
          navigate('/dashboard')
        } catch (error) {
          console.error('Log in failed:', error.response?.data || error.message)
          alert('Could not log in. Check console for details.')
        }
      }

    return (
        <>
            <Header/>
            <div className={styles.container}>
                <h2>Login</h2>
                <form className={styles.form} onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="email"
                    placeholder="Email"
                    className={styles.input}
                    value={formData.email}
                    onChange={handleChange}
                    />
                
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className={styles.input}
                    value={formData.password}
                     onChange={handleChange}
                    />
                <button type="submit" className={styles.button}>
                Login
                </button>
                </form>
            </div>
        
        </>
    )
  }
  
  export default Login