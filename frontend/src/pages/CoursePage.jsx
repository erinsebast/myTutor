import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import styles from './CoursePage.module.css' 
import axios from 'axios'

const CoursePage = () => {
  const { course_code } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check if user is authenticated
    const userData = localStorage.getItem('user')
    if (!userData) {
      navigate('/login')
      return
    }
    
    try {
      setUser(JSON.parse(userData))
    } catch (err) {
      console.error('Invalid user data in localStorage:', err)
      navigate('/login')
      return
    }
  }, [navigate])

  useEffect(() => {
    if (!user || !course_code) return

    const fetchCourse = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const res = await axios.get(`http://localhost:8000/courses/${course_code}`)
        setCourse(res.data)
      } catch (err) {
        console.error('Failed to fetch course:', err)
        if (err.response?.status === 404) {
          setError('Course not found')
        } else {
          setError('Failed to load course. Please try again.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [course_code, user])

  const handleViewGrades = () => {
    navigate(`/course/${course_code}/grades`)
  }

  const handleStartStudySession = () => {
    navigate(`/course/${course_code}/study`)
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className={styles.container}>
          <div className={styles.loadingSpinner}>
            <div className={styles.spinner}></div>
            <p>Loading course...</p>
          </div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header />
        <div className={styles.container}>
          <div className={styles.errorMessage}>
            <h2>Oops! Something went wrong</h2>
            <p>{error}</p>
            <button 
              onClick={() => navigate('/dashboard')} 
              className={styles.backButton}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </>
    )
  }

  if (!course) {
    return (
      <>
        <Header />
        <div className={styles.container}>
          <div className={styles.errorMessage}>
            <h2>Course not found</h2>
            <p>The course you're looking for doesn't exist or you don't have access to it.</p>
            <button 
              onClick={() => navigate('/dashboard')} 
              className={styles.backButton}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.courseHeader}>
          <button 
            onClick={() => navigate('/dashboard')} 
            className={styles.backButton}
            aria-label="Back to dashboard"
          >
            ← Back
          </button>
          <h1 className={styles.courseTitle}>{course.course_name}</h1>
        </div>
        
        <div className={styles.courseInfo}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Course Code:</span>
            <span className={styles.value}>{course.course_code}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Semester:</span>
            <span className={styles.value}>{course.semester}</span>
          </div>
        </div>

        <div className={styles.actionSection}>
          <h2>Quick Actions</h2>
          <div className={styles.buttonGroup}>
            <button 
              onClick={handleViewGrades}
              className={`${styles.actionButton} ${styles.gradesButton}`}
              aria-label="View and edit grades"
            >
              <span className={styles.buttonIcon}>📊</span>
              <span className={styles.buttonText}>View/Edit Grades</span>
            </button>
            <button 
              onClick={handleStartStudySession}
              className={`${styles.actionButton} ${styles.studyButton}`}
              aria-label="Start study session"
            >
              <span className={styles.buttonIcon}>⏱</span>
              <span className={styles.buttonText}>Start Study Session</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default CoursePage