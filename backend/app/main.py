from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from app.database import engine, Base
from app.routers import auth, profile, schemes, eligibility, passbook, applications, chatbot, admin
from seed.seed_schemes import seed_database

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SchemeSetu API",
    description="Backend API for SchemeSetu — Personalized welfare scheme discovery & application assistant",
    version="1.0.0"
)

client_origin = os.getenv("CLIENT_ORIGIN")
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]
if client_origin:
    origins.append(client_origin)
else:
    origins.append("*")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(schemes.router)
app.include_router(eligibility.router)
app.include_router(passbook.router)
app.include_router(applications.router)
app.include_router(chatbot.router)
app.include_router(admin.router)

@app.on_event("startup")
def startup_event():
    seed_database()

@app.get("/")
def root():
    return {
        "message": "Welcome to SchemeSetu API",
        "docs": "/docs",
        "disclaimer": "SchemeSetu is an independent prototype and is not affiliated with the Government of India."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
