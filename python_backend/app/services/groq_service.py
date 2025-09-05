import os
import groq
import json
from typing import Dict, Any
from dotenv import load_dotenv
import os
from pathlib import Path
from .sebi_live_verification import SEBILiveVerificationService

# Load .env once globally
env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path, override=True)

class GroqService:
    def __init__(self):
        api_key = os.getenv("GROQ_API_KEY")
        print("Loaded API key:", os.getenv("GROQ_API_KEY"))

        if not api_key:
            raise ValueError("GROQ_API_KEY environment variable is not set")

        self.client = groq.Groq(
            api_key=api_key,
            base_url="https://api.groq.com/v1"
        )
        self.model = "mixtral-8x7b-32768"
        
        # Initialize SEBI live verification service
        self.sebi_service = SEBILiveVerificationService()


    async def analyze_investment_offer(self, text: str) -> Dict[str, Any]:
        """
        Analyze investment offer text using Groq API
        """
        system_prompt = """You are an expert financial fraud detector at SEBI (Securities and Exchange Board of India). 
        Your task is to analyze investment offers and detect potential fraud or suspicious activities.
        You will receive structured data including:
        1. Text input from the form
        2. Processed documents with extracted entities
        3. Investment details found in documents
        4. Contact information
        5. Key phrases identified

        Analyze all this information for:
        - Unrealistic returns or guarantees
        - Pressure tactics or urgency
        - Unregistered advisors or companies
        - Inconsistent contact information
        - Missing or suspicious SEBI registration
        - Historical fraud patterns
        - Red flags in document content

        Respond with a detailed JSON object containing:
        {
            "overallRisk": "high/medium/low",
            "riskScore": 0-100,
            "riskKeywords": ["list", "of", "suspicious", "terms"],
            "recommendations": ["list", "of", "recommendations"],
            "redFlags": ["list", "of", "specific", "concerns"],
            "advisorStatus": "registered/unregistered",
            "sebiRegistration": null or "registration number if found",
            "fraudProbability": 0-100,
            "analysisDetails": "detailed explanation",
            "documentAnalysis": {
                "suspiciousEntities": ["list of suspicious organizations or people found"],
                "moneyPatterns": ["suspicious patterns in monetary amounts"],
                "timeframeAnalysis": "analysis of investment timeframes",
                "contactVerification": "analysis of contact information consistency"
            },
            "legalCompliance": {
                "registrationStatus": "status of SEBI registration",
                "regulatoryIssues": ["list of regulatory concerns"],
                "complianceScore": 0-100
            }
        }
        """
        
        analysis_prompt = f"""Analyze this investment offer for potential fraud:
        {text}
        
        Consider:
        1. Unrealistic returns
        2. Pressure tactics
        3. Regulatory compliance
        4. Historical fraud patterns
        5. SEBI registration status
        """
        
        try:
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": analysis_prompt}
                ],
                temperature=0.1,
                max_tokens=2000,
            )
            
            return json.loads(completion.choices[0].message.content)
        except Exception as e:
            print(f"Error in Groq API call: {str(e)}")
            return {
                "overallRisk": "high",
                "riskScore": 100,
                "riskKeywords": ["api_error"],
                "recommendations": ["Unable to complete analysis. Please try again."],
                "redFlags": ["Analysis service error"],
                "advisorStatus": "unknown",
                "sebiRegistration": None,
                "fraudProbability": 100,
                "analysisDetails": f"Error during analysis: {str(e)}"
            }

    async def verify_advisor(self, advisor_data: Dict[str, str]) -> Dict[str, Any]:
        """
        Verify advisor credentials using live SEBI verification and AI analysis
        """
        # First check against SEBI website live
        sebi_result = self.sebi_service.verify_advisor_on_sebi_website(advisor_data)
        
        # If found on SEBI website, return that result with high confidence
        if sebi_result["status"] in ["found_on_sebi", "verified"]:
            return sebi_result
        
        # If marked as suspicious by fraud pattern detection, return immediately
        if sebi_result["status"] == "suspicious":
            return sebi_result
        
        # If not found on SEBI website, use AI analysis as backup
        system_prompt = """You are a SEBI compliance expert. Analyze the given advisor details for potential red flags.
        Since this advisor was not found on the official SEBI website, provide risk assessment and recommendations.
        
        Return a JSON object with:
        {
            "status": "unverified/suspicious/potential_fraud",
            "isRegistered": false,
            "registrationStatus": "not_found",
            "riskLevel": "high/medium/low", 
            "warnings": ["list of warning messages"],
            "recommendations": ["list of recommendations"],
            "details": {
                "analysis": "detailed analysis of the advisor information",
                "red_flags": ["list of identified red flags"],
                "missing_info": ["list of missing critical information"]
            },
            "verification_method": "ai_analysis_with_live_sebi_check"
        }"""
        
        analysis_prompt = f"""
        Analyze these advisor credentials that were NOT FOUND on official SEBI website:
        Name: {advisor_data.get('name', 'Not provided')}
        License ID: {advisor_data.get('licenseId', 'Not provided')}
        Registration Number: {advisor_data.get('registrationNumber', 'Not provided')}
        Company: {advisor_data.get('companyName', 'Not provided')}
        Contact: {advisor_data.get('contactInfo', 'Not provided')}
        
        Check for:
        - Missing SEBI registration (major red flag)
        - Incomplete or suspicious information
        - Common fraud patterns
        - Recommendations for investor protection
        """
        
        try:
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": analysis_prompt}
                ],
                temperature=0.1,
                max_tokens=1000,
            )
            
            ai_result = json.loads(completion.choices[0].message.content)
            
            # Combine SEBI result with AI analysis
            combined_result = sebi_result.copy()
            combined_result.update(ai_result)
            combined_result["sebi_check"] = "not_found"
            combined_result["ai_analysis"] = ai_result.get("details", {})
            
            return combined_result
            
        except Exception as e:
            # Return SEBI result with error info
            sebi_result["ai_analysis_error"] = str(e)
            return sebi_result
