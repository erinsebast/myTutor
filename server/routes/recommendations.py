from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from server.schemas.recommendation import RecommendationCreate, RecommendationOut
from server.database import models
from server.database.db import get_db

router = APIRouter()

@router.post("/recommendations", response_model=RecommendationOut)
def save_recommendation(rec: RecommendationCreate, db: Session = Depends(get_db)):
    db_rec = models.Recommendations(**rec.dict())
    db.add(db_rec)
    db.commit()
    db.refresh(db_rec)
    return db_rec

@router.get("/recommendations", response_model=list[RecommendationOut])
def get_all_recommendations(db: Session = Depends(get_db)):
    return db.query(models.Recommendations).all()