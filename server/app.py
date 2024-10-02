from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import ORIGIN_ENDPOINT

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[ORIGIN_ENDPOINT],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}
