from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from server.schemas.grade import GradeCreate, GradeOut
from server.database import models
from server.database.db import get_db

router = APIRouter()

@router.post("/grades", response_model=GradeOut)
def add_grade(grade: GradeCreate, db: Session = Depends(get_db)):
    db_grade = models.Grades(**grade.dict())
    db.add(db_grade)
    db.commit()
    db.refresh(db_grade)
    return db_grade

@router.get("/grades", response_model=list[GradeOut])
def get_all_grades(db: Session = Depends(get_db)):
    return db.query(models.Grades).all()