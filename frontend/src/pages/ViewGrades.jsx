import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styles from './ViewGrades.module.css'
import Header from '../components/Header'
import { useParams, useNavigate } from 'react-router-dom'

const ViewGrades = () => {
  const { course_code } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [course, setCourse] = useState(null)
  const [grades, setGrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingGrade, setEditingGrade] = useState(null)
  
  const [newGrade, setNewGrade] = useState({
    assignment_name: '',
    total_points: '',
    score_received: '',
    grade_date: new Date().toISOString().split('T')[0] // Default to today
  })

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

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch course info and grades in parallel
        const [courseRes, gradesRes] = await Promise.all([
          axios.get(`http://localhost:8000/courses/${course_code}`),
          axios.get(`http://localhost:8000/grades/${user.user_id}/${course_code}`)
        ])
        
        setCourse(courseRes.data)
        setGrades(gradesRes.data)
      } catch (err) {
        console.error('Failed to load data:', err)
        if (err.response?.status === 404) {
          setError('Course or grades not found')
        } else {
          setError('Failed to load data. Please try again.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [course_code, user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setNewGrade(prev => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    const { assignment_name, total_points, score_received, grade_date } = newGrade
    
    if (!assignment_name.trim()) {
      alert('Please enter an assignment name')
      return false
    }
    
    if (!total_points || parseFloat(total_points) <= 0) {
      alert('Please enter a valid total points value')
      return false
    }
    
    if (!score_received || parseFloat(score_received) < 0) {
      alert('Please enter a valid score received')
      return false
    }
    
    if (parseFloat(score_received) > parseFloat(total_points)) {
      alert('Score received cannot be greater than total points')
      return false
    }
    
    if (!grade_date) {
      alert('Please select a date')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    try {
      setSubmitting(true)
      const payload = {
        ...newGrade,
        user_id: user.user_id,
        course_code,
        total_points: parseFloat(newGrade.total_points),
        score_received: parseFloat(newGrade.score_received)
      }
      
      if (editingGrade) {
        await axios.put(`http://localhost:8000/grades/${editingGrade.grade_id}`, payload)
        setEditingGrade(null)
      } else {
        await axios.post('http://localhost:8000/grades', payload)
      }
      
      // Reset form
      setNewGrade({
        assignment_name: '',
        total_points: '',
        score_received: '',
        grade_date: new Date().toISOString().split('T')[0]
      })
      setShowForm(false)
      
      // Refresh grades
      const res = await axios.get(`http://localhost:8000/grades/${user.user_id}/${course_code}`)
      setGrades(res.data)
    } catch (err) {
      console.error('Grade submission failed:', err)
      alert('Could not save grade. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (grade) => {
    setEditingGrade(grade)
    setNewGrade({
      assignment_name: grade.assignment_name,
      total_points: grade.total_points.toString(),
      score_received: grade.score_received.toString(),
      grade_date: grade.grade_date
    })
    setShowForm(true)
  }

  const handleDelete = async (gradeId) => {
    if (!window.confirm('Are you sure you want to delete this grade?')) return
    
    try {
      await axios.delete(`http://localhost:8000/grades/${gradeId}`)
      const res = await axios.get(`http://localhost:8000/grades/${user.user_id}/${course_code}`)
      setGrades(res.data)
    } catch (err) {
      console.error('Failed to delete grade:', err)
      alert('Could not delete grade. Please try again.')
    }
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingGrade(null)
    setNewGrade({
      assignment_name: '',
      total_points: '',
      score_received: '',
      grade_date: new Date().toISOString().split('T')[0]
    })
  }

  const calculateStats = () => {
    if (grades.length === 0) return { average: 'N/A', total: 0, scored: 0 }
    
    const totalPoints = grades.reduce((acc, g) => acc + (g.total_points || 0), 0)
    const scoredPoints = grades.reduce((acc, g) => acc + (g.score_received || 0), 0)
    const average = totalPoints > 0 ? ((scoredPoints / totalPoints) * 100).toFixed(1) : 'N/A'
    
    return { average, total: totalPoints, scored: scoredPoints }
  }

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return styles.gradeA
    if (percentage >= 80) return styles.gradeB
    if (percentage >= 70) return styles.gradeC
    if (percentage >= 60) return styles.gradeD
    return styles.gradeF
  }

  const stats = calculateStats()

  if (loading) {
    return (
      <>
        <Header />
        <div className={styles.container}>
          <div className={styles.loadingSpinner}>
            <div className={styles.spinner}></div>
            <p>Loading grades...</p>
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
              onClick={() => navigate(`/course/${course_code}`)} 
              className={styles.backButton}
            >
              Back to Course
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
        <div className={styles.header}>
          <button 
            onClick={() => navigate(`/course/${course_code}`)} 
            className={styles.backButton}
            aria-label="Back to course"
          >
            ← Back
          </button>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Grades</h1>
            <p className={styles.courseInfo}>
              {course?.course_name} ({course_code})
            </p>
          </div>
        </div>

        <div className={styles.statsSection}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{stats.average}%</div>
              <div className={styles.statLabel}>Current Average</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{grades.length}</div>
              <div className={styles.statLabel}>Total Assignments</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{stats.scored}/{stats.total}</div>
              <div className={styles.statLabel}>Points Earned</div>
            </div>
          </div>
        </div>

        <div className={styles.actionBar}>
          <button 
            onClick={() => setShowForm(!showForm)} 
            className={`${styles.addButton} ${showForm ? styles.cancelButton : ''}`}
            disabled={submitting}
          >
            {showForm ? '✕ Cancel' : '+ Add Grade'}
          </button>
        </div>

        {showForm && (
          <div className={styles.formContainer}>
            <form className={styles.form} onSubmit={handleSubmit}>
              <h3 className={styles.formTitle}>
                {editingGrade ? 'Edit Grade' : 'Add New Grade'}
              </h3>
              
              <div className={styles.inputGroup}>
                <label htmlFor="assignment_name">Assignment Name</label>
                <input
                  id="assignment_name"
                  type="text"
                  name="assignment_name"
                  placeholder="e.g., Midterm Exam"
                  value={newGrade.assignment_name}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                />
              </div>

              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label htmlFor="score_received">Score Received</label>
                  <input
                    id="score_received"
                    type="number"
                    name="score_received"
                    placeholder="85"
                    min="0"
                    step="0.01"
                    value={newGrade.score_received}
                    onChange={handleChange}
                    required
                    disabled={submitting}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="total_points">Total Points</label>
                  <input
                    id="total_points"
                    type="number"
                    name="total_points"
                    placeholder="100"
                    min="0.01"
                    step="0.01"
                    value={newGrade.total_points}
                    onChange={handleChange}
                    required
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="grade_date">Date</label>
                <input
                  id="grade_date"
                  type="date"
                  name="grade_date"
                  value={newGrade.grade_date}
                  onChange={handleChange}
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
                  {submitting ? 'Saving...' : editingGrade ? 'Update Grade' : 'Add Grade'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className={styles.gradesSection}>
          <h2 className={styles.sectionTitle}>Grade History</h2>
          
          {grades.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📊</div>
              <h3>No grades yet</h3>
              <p>Add your first grade to start tracking your progress!</p>
            </div>
          ) : (
            <div className={styles.gradesList}>
              {grades.map((grade) => {
                const percentage = ((grade.score_received / grade.total_points) * 100).toFixed(1)
                return (
                  <div key={grade.grade_id} className={styles.gradeCard}>
                    <div className={styles.gradeHeader}>
                      <h3 className={styles.assignmentName}>{grade.assignment_name}</h3>
                      <div className={styles.gradeActions}>
                        <button 
                          onClick={() => handleEdit(grade)}
                          className={styles.editButton}
                          aria-label="Edit grade"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleDelete(grade.grade_id)}
                          className={styles.deleteButton}
                          aria-label="Delete grade"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    
                    <div className={styles.gradeBody}>
                      <div className={styles.scoreDisplay}>
                        <span className={styles.score}>
                          {grade.score_received}/{grade.total_points}
                        </span>
                        <span className={`${styles.percentage} ${getGradeColor(parseFloat(percentage))}`}>
                          {percentage}%
                        </span>
                      </div>
                      <div className={styles.gradeDate}>
                        {new Date(grade.grade_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ViewGrades