from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from server.schemas.catalog import CourseCatalogCreate, CourseCatalogOut
from server.database import models
from server.database.db import get_db

router = APIRouter()

@router.post("/catalog", response_model=CourseCatalogOut)
def create_course(course: CourseCatalogCreate, db: Session = Depends(get_db)):
    db_course = models.CourseCatalog(**course.dict())
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course

@router.get("/catalog", response_model=list[CourseCatalogOut])
def get_all_courses(db: Session = Depends(get_db)):
    return db.query(models.CourseCatalog).all()