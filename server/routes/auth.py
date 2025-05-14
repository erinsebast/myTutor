from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from server.database import db, models
from pydantic import BaseModel

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(db.get_db)):
    user = db.query(models.Users).filter(models.Users.email == data.email).first()
    if not user or user.password != data.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"message": "Login successful", "user_id": user.user_id}