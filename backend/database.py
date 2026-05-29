from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
from pathlib import Path

env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "mira_health")

print(f"Connecting to: {MONGODB_URL[:50]}...")

client = AsyncIOMotorClient(MONGODB_URL)
db = client[DB_NAME]
patients_collection = db["patients"]
