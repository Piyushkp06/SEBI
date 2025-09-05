from pydantic import BaseModel
from typing import Optional, List

class TextData(BaseModel):
    links: Optional[str] = None
    emails: Optional[str] = None
    companyName: Optional[str] = None
    advisorName: Optional[str] = None
    contactInfo: Optional[str] = None

class AdvisorVerification(BaseModel):
    userId: str
    licenseId: str
    regulator: str
    name: str

class AnalysisResponse(BaseModel):
    overallRisk: str
    riskScore: int
    riskKeywords: List[str]
    recommendations: List[str]
    redFlags: List[str]
    advisorStatus: str
    sebiRegistration: Optional[str]
    fraudProbability: int
    analysisDetails: str

class AdvisorResponse(BaseModel):
    status: str
    message: str
    isRegistered: bool
    details: Optional[dict]
