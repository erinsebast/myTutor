import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../components/Header'
import styles from './CoursePage.module.css' 
import axios from 'axios'

const CoursePage = () => {
  const { course_code } = useParams()
  const user = JSON.parse(localStorage.getItem('user'))
  const [course, setCourse] = useState(null)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/courses`)
        const found = res.data.find(c => c.course_code === course_code)
setCourse(found)
      } catch (err) {
        console.error('Failed to fetch course:', err)
      }
    }

    fetchCourse()
  }, [course_code, user.user_id])

  if (!course) return <p>Loading...</p>

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1>{course.course_name}</h1>
        <p><strong>Code:</strong> {course.course_code}</p>
        <p><strong>Semester:</strong> {course.semester}</p>

        <div className={styles.buttonGroup}>
          <button onClick={() => alert('TODO: Link to grades page')}>📊 View/Edit Grades</button>
          <button onClick={() => alert('TODO: Start study session')}>⏱ Start Study Session</button>
        </div>
      </div>
    </>
  )
}

export default CoursePage