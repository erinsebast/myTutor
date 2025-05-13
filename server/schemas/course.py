from typing import Optional
from pydantic import BaseModel

class TranscriptCourseCreate(BaseModel):
    user_id: int
    course_code: str
    course_name: Optional[str] = None  # allow null
    semester: str
    grade: Optional[str] = None        # allow null

class TranscriptCourseOut(TranscriptCourseCreate):
    course_id: int  # or whatever your PK is named
    class Config:
        from_attributes = True
