from pydantic import BaseModel
from datetime import date
from typing import Optional

class GradeBase(BaseModel):
    course_code: Optional[str]
    assignment_name: Optional[str]
    total_points: Optional[int]
    score_received: Optional[int]
    grade_date: Optional[date]

class GradeCreate(GradeBase):
    user_id: int

class GradeOut(GradeBase):
    grade_id: int
    user_id: int

    class Config:
        orm_mode = True