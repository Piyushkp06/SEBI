from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import offer_analysis, advisor_verification
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = FastAPI(
    title="SEBI AI Analysis API",
    description="API for analyzing investment offers and advisor verification",
    version="1.0.0"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Use consistent prefixes
app.include_router(offer_analysis.router, prefix="/api/v1/offers", tags=["Investment Offers"])
app.include_router(advisor_verification.router, prefix="/api/v1/advisors", tags=["Advisor Verification"])

# Add a simple health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "SEBI AI Analysis API is running"}

@app.get("/")
async def root():
    return {"message": "Welcome to SEBI AI Analysis API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)
