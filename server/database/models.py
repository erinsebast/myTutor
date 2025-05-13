from sqlalchemy import Column, Integer, String, Text, Date, DateTime, ForeignKey, func
from .db import Base
from sqlalchemy import ForeignKey


class TranscriptCourse(Base):
    __tablename__ = "transcript_courses"

    course_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"))
    course_code = Column(String(20))
    course_name = Column(String(100))
    semester = Column(String(20))
    grade = Column(String(2))

class Users(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(100), nullable=False, unique=True)
    password = Column(String(50), nullable=True)
    major = Column(String(100), nullable=True)
    full_name = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class StudySessions(Base):
    __tablename__ = "study_sessions"

    session_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    course_code = Column(String(20), ForeignKey("course_catalog.course_code"), nullable=True)
    duration_minutes = Column(Integer, nullable=True)
    session_date = Column(Date, nullable=True)
    notes = Column(Text, nullable=True) 

class Recommendations(Base):
    __tablename__ = "recommendations"

    rec_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    generated_text = Column(Text, nullable=True) 
    generated_at = Column(DateTime(timezone=True), server_default=func.now())

class Grades(Base):
    __tablename__ = "grades"

    grade_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    course_code = Column(String(20), ForeignKey("course_catalog.course_code"), nullable=True)
    assignment_name = Column(String(100), nullable=True)
    total_points = Column(Integer, nullable=True)
    score_received = Column(Integer, nullable=True)
    grade_date = Column(Date, nullable=True)

class CourseCatalog(Base):
    __tablename__ = "course_catalog"

    course_code = Column(String(20), primary_key=True, nullable=False)
    course_name = Column(String(100), nullable=True)
    department = Column(String(50), nullable=True)