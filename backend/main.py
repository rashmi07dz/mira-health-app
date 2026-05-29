from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.patients import router

app = FastAPI(title="MIRA Health API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

@app.get("/")
def root():
    return {"message": "MIRA Health API is running"}
