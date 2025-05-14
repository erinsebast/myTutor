import React, { useState } from 'react'
import styles from './Register.module.css'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'
import axios from 'axios'

const Register = () => {
    const navigate = useNavigate()
    
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        major: '',
        classYear: ''
    })
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
    
        try {
          const response = await axios.post('http://localhost:8000/users', formData)
          console.log('User created:', response.data)
          navigate('/login') // or wherever you want to redirect
        } catch (error) {
          console.error('Registration failed:', error.response?.data || error.message)
          alert('Could not register. Check console for details.')
        }
      }

    return (
        <>
            <Header />
            <div className={styles.container}>
                <h2>Register</h2>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="full_name"
                        placeholder="Full Name"
                        className={styles.input}
                        value={formData.full_name}
                        onChange={handleChange}
                    />
                    <input
                        type="email"
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
                    <input
                        type="text"
                        name="major"
                        placeholder="Major"
                        className={styles.input}
                        value={formData.major}
                        onChange={handleChange}
                    />
                    <select name = "classYear" value = {formData.classYear} onChange={handleChange}>
                        <option value="">Select Year</option>
                        <option value="Freshman">Freshman</option>
                        <option value="Sophomore">Sophomore</option>
                        <option value="Junior">Junior</option>
                        <option value="Senior">Senior</option>
                    </select>
                    <button type="submit" className={styles.button}>
                        Create Account
                    </button>
                </form>
            </div>
        </>
    )
    
  }
  
  export default Register