from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from server.schemas.grade import GradeCreate, GradeOut
from server.database import models
from server.database.db import get_db

router = APIRouter()

@router.post("/grades")
def create_grade(grade: GradeCreate, db: Session = Depends(get_db)):
    new_grade = models.Grades(**grade.dict())
    db.add(new_grade)
    db.commit()
    db.refresh(new_grade)
    return new_grade

@router.get("/grades/{user_id}/{course_code}")
def get_grades(user_id: int, course_code: str, db: Session = Depends(get_db)):
    return db.query(models.Grades).filter_by(user_id=user_id, course_code=course_code).all()