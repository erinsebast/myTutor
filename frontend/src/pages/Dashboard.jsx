import React, { useState, useEffect } from 'react'
import styles from './Dashboard.module.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import DashboardLayout from '../layouts/DashboardLayout'

const Dashboard = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [newCourse, setNewCourse] = useState({
    course_code: '',
    course_name: '',
    semester: ''
  })

  useEffect(() => {
    // Check if user is authenticated
    const userData = localStorage.getItem('user')
    if (!userData) {
      navigate('/login')
      return
    }
    
    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    } catch (err) {
      console.error('Invalid user data in localStorage:', err)
      navigate('/login')
      return
    }
  }, [navigate])

  const fetchCourses = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      setError(null)
      const res = await axios.get(`http://localhost:8000/courses?user_id=${user.user_id}`)
      setCourses(res.data)
    } catch (err) {
      console.error('Failed to fetch courses:', err)
      setError('Failed to load courses. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchCourses()
    }
  }, [user])

  const handleInputChange = (field, value) => {
    setNewCourse(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    const { course_code, course_name, semester } = newCourse
    
    if (!course_code.trim()) {
      alert('Please enter a course code')
      return false
    }
    
    if (!course_name.trim()) {
      alert('Please enter a course name')
      return false
    }
    
    if (!semester.trim()) {
      alert('Please enter a semester')
      return false
    }

    // Check for duplicate course code
    if (courses.some(course => course.course_code.toLowerCase() === course_code.toLowerCase())) {
      alert('A course with this code already exists')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    try {
      setSubmitting(true)
      await axios.post('http://localhost:8000/courses', {
        ...newCourse,
        user_id: user.user_id
      })
      
      // Reset form and close it
      setShowForm(false)
      setNewCourse({ course_code: '', course_name: '', semester: '' })
      
      // Refresh courses list
      await fetchCourses()
    } catch (err) {
      console.error('Failed to add course:', err)
      if (err.response?.status === 409) {
        alert('A course with this code already exists')
      } else {
        alert('Failed to add course. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setNewCourse({ course_code: '', course_name: '', semester: '' })
  }

  const handleCourseClick = (courseCode) => {
    navigate(`/course/${courseCode}`)
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <DashboardLayout>
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <h1 className={styles.heading}>Welcome back, {user.name || 'Student'}!</h1>
          <p className={styles.subtitle}>Manage your courses and track your progress</p>
        </div>

        <div className={styles.actionBar}>
          <button 
            onClick={() => setShowForm(!showForm)} 
            className={`${styles.addButton} ${showForm ? styles.cancelButton : ''}`}
            disabled={submitting}
          >
            {showForm ? '✕ Cancel' : '+ Add Course'}
          </button>
        </div>

        {showForm && (
          <div className={styles.formContainer}>
            <form className={styles.form} onSubmit={handleSubmit}>
              <h3 className={styles.formTitle}>Add New Course</h3>
              
              <div className={styles.inputGroup}>
                <label htmlFor="course_code">Course Code</label>
                <input
                  id="course_code"
                  type="text"
                  placeholder="e.g., CS101"
                  value={newCourse.course_code}
                  onChange={(e) => handleInputChange('course_code', e.target.value)}
                  required
                  disabled={submitting}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="course_name">Course Name</label>
                <input
                  id="course_name"
                  type="text"
                  placeholder="e.g., Introduction to Computer Science"
                  value={newCourse.course_name}
                  onChange={(e) => handleInputChange('course_name', e.target.value)}
                  required
                  disabled={submitting}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="semester">Semester</label>
                <input
                  id="semester"
                  type="text"
                  placeholder="e.g., Fall 2024"
                  value={newCourse.semester}
                  onChange={(e) => handleInputChange('semester', e.target.value)}
                  required
                  disabled={submitting}
                />
              </div>

              <div className={styles.formActions}>
                <button 
                  type="button" 
                  onClick={handleCancelForm}
                  className={styles.cancelFormButton}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={styles.submitButton}
                  disabled={submitting}
                >
                  {submitting ? 'Adding...' : 'Add Course'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className={styles.coursesSection}>
          <h2 className={styles.sectionTitle}>Your Courses</h2>
          
          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p>Loading your courses...</p>
            </div>
          ) : error ? (
            <div className={styles.errorState}>
              <p>{error}</p>
              <button onClick={fetchCourses} className={styles.retryButton}>
                Try Again
              </button>
            </div>
          ) : courses.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📚</div>
              <h3>No courses yet</h3>
              <p>Add your first course to get started!</p>
            </div>
          ) : (
            <div className={styles.cardGrid}>
              {courses.map(course => (
                <div
                  key={course.course_code}
                  className={styles.courseCard}
                  onClick={() => handleCourseClick(course.course_code)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleCourseClick(course.course_code)
                    }
                  }}
                >
                  <div className={styles.cardHeader}>
                    <h3 className={styles.courseName}>{course.course_name}</h3>
                  </div>
                  <div className={styles.cardBody}>
                    <p className={styles.courseCode}>{course.course_code}</p>
                    <p className={styles.courseSemester}>{course.semester}</p>
                  </div>
                  <div className={styles.cardFooter}>
                    <span className={styles.viewMore}>View Details →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard