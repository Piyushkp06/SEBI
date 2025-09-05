from fastapi import APIRouter, Form, HTTPException
from typing import Optional
import json
from ..services.groq_service import GroqService

router = APIRouter()
groq_service = GroqService()

@router.post("/verify")
async def verify_advisor(
    name: str = Form(...),
    licenseId: Optional[str] = Form(None),
    registrationNumber: Optional[str] = Form(None),
    companyName: Optional[str] = Form(None),
    contactInfo: Optional[str] = Form(None)
):
    """
    Verify advisor credentials against SEBI website
    """
    advisor_data = {
        "name": name,
        "licenseId": licenseId,
        "registrationNumber": registrationNumber,
        "companyName": companyName,
        "contactInfo": contactInfo
    }
    
    verification_result = await groq_service.verify_advisor(advisor_data)
    return verification_result

@router.post("/verify-extracted")
async def verify_extracted_advisor(
    advisorInfo: str = Form(...)
):
    """
    Verify advisor from extracted information
    """
    try:
        advisor_data = json.loads(advisorInfo)
        
        # Prepare data for verification
        verification_data = {
            "name": advisor_data.get("advisorName"),
            "licenseId": advisor_data.get("credentials", {}).get("licenseId"),
            "registrationNumber": advisor_data.get("credentials", {}).get("registrationNumber"),
            "companyName": advisor_data.get("companyName"),
            "contactInfo": json.dumps(advisor_data.get("contactInfo", {}))
        }
        
        verification_result = await groq_service.verify_advisor(verification_data)
        return {
            "success": True,
            "verification": verification_result,
            "originalExtraction": advisor_data
        }
        
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=400, detail="Invalid advisor information format")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Verification error: {str(e)}")

@router.get("/status")
async def get_verification_status():
    """
    Get status of the verification service
    """
    return {
        "service": "SEBI Live Advisor Verification",
        "status": "active",
        "verification_method": "live_sebi_website_check",
        "features": [
            "Real-time SEBI website verification",
            "Fraud pattern detection",
            "Risk assessment",
            "Investment offer analysis"
        ]
    }
