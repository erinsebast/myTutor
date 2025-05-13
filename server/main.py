from fastapi import FastAPI
from .database import models
from .database.db import engine
from server.routes import courses, catalog, grades, recommendations, users, sessions

models.Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(courses.router)
app.include_router(catalog.router)
app.include_router(grades.router)
app.include_router(recommendations.router)
app.include_router(users.router)
app.include_router(sessions.router)

@app.get("/")
def read_root():
    return {"message": "myTutor backend running!"}