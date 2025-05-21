import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styles from './ViewGrades.module.css' // Optional for styling
import Header from '../components/Header'
import { useParams } from 'react-router-dom'

const ViewGrades = () => {
  const { course_code } = useParams() // Get course_code from URL
  const user = JSON.parse(localStorage.getItem('user'))
  const [grades, setGrades] = useState([])
  const [newGrade, setNewGrade] = useState({
    assignment_name: '',
    total_points: '',
    score_received: '',
    grade_date: ''
  })

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/grades/${user.user_id}/${course_code}`)
        setGrades(res.data)
      } catch (err) {
        console.error('Failed to load grades:', err)
      }
    }
    fetchGrades()
  }, [course_code, user.user_id])

  const handleChange = (e) => {
    setNewGrade({ ...newGrade, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = { ...newGrade, user_id: user.user_id, course_code }
      await axios.post('http://localhost:8000/grades', payload)
      setNewGrade({ assignment_name: '', total_points: '', score_received: '', grade_date: '' })
      const res = await axios.get(`http://localhost:8000/grades/${user.user_id}/${course_code}`)
      setGrades(res.data)
    } catch (err) {
      console.error('Grade submission failed:', err)
      alert('Could not submit grade')
    }
  }

  const calcAverage = () => {
    const total = grades.reduce((acc, g) => acc + (g.total_points || 0), 0)
    const scored = grades.reduce((acc, g) => acc + (g.score_received || 0), 0)
    return total > 0 ? ((scored / total) * 100).toFixed(1) : 'N/A'
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <h2>Grades for {course_code}</h2>
        <p>Average: <strong>{calcAverage()}%</strong></p>

        <ul>
          {grades.map((grade) => (
            <li key={grade.grade_id}>
              {grade.assignment_name} – {grade.score_received}/{grade.total_points} ({grade.grade_date})
            </li>
          ))}
        </ul>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            name="assignment_name"
            placeholder="Assignment Name"
            value={newGrade.assignment_name}
            onChange={handleChange}
          />
          <input
            type="number"
            name="score_received"
            placeholder="Score Received"
            value={newGrade.score_received}
            onChange={handleChange}
          />
          <input
            type="number"
            name="total_points"
            placeholder="Total Points"
            value={newGrade.total_points}
            onChange={handleChange}
          />
          <input
            type="date"
            name="grade_date"
            value={newGrade.grade_date}
            onChange={handleChange}
          />
          <button type="submit">Add Grade</button>
        </form>
      </div>
    </>
  )
}

export default ViewGrades