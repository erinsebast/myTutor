from pydantic import BaseModel
from typing import Optional

class CourseCatalogBase(BaseModel):
    course_name: Optional[str]
    department: Optional[str]

class CourseCatalogCreate(CourseCatalogBase):
    course_code: str

class CourseCatalogOut(CourseCatalogCreate):
    class Config:
        orm_mode = True