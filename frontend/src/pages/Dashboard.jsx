import React, { useState, useEffect } from 'react'
import styles from './Dashboard.module.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import DashboardLayout from '../layouts/DashboardLayout'

const Dashboard = () => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))
  const [showForm, setShowForm] = useState(false)
  const [courses, setCourses] = useState([])
  const [newCourse, setNewCourse] = useState({
    course_code: '',
    course_name: '',
    semester: ''
  })

  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:8000/courses')
      setCourses(res.data)
    } catch (err) {
      console.error('Failed to fetch courses:', err)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:8000/courses', {
        ...newCourse,
        user_id: user.user_id
      })
      setShowForm(false)
      setNewCourse({ course_code: '', course_name: '', semester: '' })
      fetchCourses()
    } catch (err) {
      alert('Failed to add course.')
    }
  }

  return (
    <DashboardLayout>
      <div className={styles.mainContent}>
        <h1 className={styles.heading}>Welcome back!</h1>

        <button onClick={() => setShowForm(!showForm)} className={styles.addButton}>
          {showForm ? 'Cancel' : '+ Add Course'}
        </button>

        {showForm && (
          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              type="text"
              name="course_code"
              placeholder="Course Code"
              value={newCourse.course_code}
              onChange={(e) => setNewCourse({ ...newCourse, course_code: e.target.value })}
            />
            <input
              type="text"
              name="course_name"
              placeholder="Course Name"
              value={newCourse.course_name}
              onChange={(e) => setNewCourse({ ...newCourse, course_name: e.target.value })}
            />
            <input
              type="text"
              name="semester"
              placeholder="Semester"
              value={newCourse.semester}
              onChange={(e) => setNewCourse({ ...newCourse, semester: e.target.value })}
            />
            <button type="submit" className={styles.button}>Save Course</button>
          </form>
        )}

        <div className={styles.cardGrid}>
          {courses.map(course => (
            <div
              key={course.course_code}
              className={styles.courseCard}
              onClick={() => navigate(`/grades/${course.course_code}`)}
            >
              <h3>{course.course_name}</h3>
              <p>{course.course_code}</p>
              <p>{course.semester}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard