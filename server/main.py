from fastapi import FastAPI
from .database import models
from .database.db import engine
from server.routes import courses, catalog, grades, recommendations, users, sessions
from fastapi.middleware.cors import CORSMiddleware
from server.routes import auth

models.Base.metadata.create_all(bind=engine)

app = FastAPI()
# Allow frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # 👈 your Vite frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(courses.router)
app.include_router(catalog.router)
app.include_router(grades.router)
app.include_router(recommendations.router)
app.include_router(users.router)
app.include_router(sessions.router)
app.include_router(auth.router)

@app.get("/")
def read_root():
    return {"message": "myTutor backend running!"}