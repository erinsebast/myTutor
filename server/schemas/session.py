from pydantic import BaseModel
from typing import Optional
from datetime import date

class StudySessionBase(BaseModel):
    course_code: Optional[str]
    duration_minutes: Optional[int]
    session_date: Optional[date]
    notes: Optional[str]

class StudySessionCreate(StudySessionBase):
    user_id: int

class StudySessionOut(StudySessionBase):
    session_id: int
    user_id: int

    class Config:
        orm_mode = True