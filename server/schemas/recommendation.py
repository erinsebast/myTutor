from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class RecommendationBase(BaseModel):
    generated_text: Optional[str]

class RecommendationCreate(RecommendationBase):
    user_id: int

class RecommendationOut(RecommendationBase):
    rec_id: int
    user_id: int
    generated_at: datetime

    class Config:
        orm_mode = True
