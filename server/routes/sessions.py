from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from server.schemas.session import StudySessionCreate, StudySessionOut
from server.database import models
from server.database.db import get_db

router = APIRouter()

@router.post("/study-sessions", response_model=StudySessionOut)
def create_session(session: StudySessionCreate, db: Session = Depends(get_db)):
    db_session = models.StudySessions(**session.dict())
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

@router.get("/study-sessions", response_model=list[StudySessionOut])
def get_sessions(db: Session = Depends(get_db)):
    return db.query(models.StudySessions).all()