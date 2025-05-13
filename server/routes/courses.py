from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from server.database import models
from server.schemas.course import TranscriptCourseCreate, TranscriptCourseOut
from server.database.db import get_db

router = APIRouter()

@router.post("/courses", response_model=TranscriptCourseOut)
def create_course(course: TranscriptCourseCreate, db: Session = Depends(get_db)):
    db_course = models.TranscriptCourse(**course.dict())
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course

@router.get("/courses", response_model=list[TranscriptCourseOut])
def get_courses(db: Session = Depends(get_db)):
    return db.query(models.TranscriptCourse).all()
