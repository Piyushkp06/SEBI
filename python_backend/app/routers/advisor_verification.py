from fastapi import APIRouter, Form
from ..models.schemas import AdvisorVerification, AdvisorResponse
from ..services.groq_service import GroqService

router = APIRouter()
groq_service = GroqService()

@router.post("/verify", response_model=AdvisorResponse)
async def verify_advisor(
    userId: str = Form(...),
    licenseId: str = Form(...),
    regulator: str = Form(...),
    name: str = Form(...)
):
    """
    Verify advisor credentials against SEBI database
    """
    advisor_data = {
        "userId": userId,
        "licenseId": licenseId,
        "regulator": regulator,
        "name": name
    }
    
    verification_result = await groq_service.verify_advisor(advisor_data)
    return AdvisorResponse(**verification_result)
