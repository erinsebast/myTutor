import React, { useState } from 'react'
import styles from './Register.module.css'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'
import axios from 'axios'

const Dashboard = () => {
    return (
        <>
            <Header />
            <div className={styles.container}>
                <h1 className = {styles.heading}>Welcome back!</h1>

                <button className={styles.addButton}>
                    + Add Course
                </button>

                <div className={styles.courseGrid}>

                </div>
            </div>
        </>

    )

}
  
  export default Dashboard