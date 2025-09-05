import os
import groq
import json
from typing import Dict, Any
from dotenv import load_dotenv
import os
from pathlib import Path

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
        Verify advisor credentials using Groq API
        """
        system_prompt = """You are a SEBI database expert. Analyze the given advisor details and determine if they appear legitimate.
        Respond with a JSON object containing verification status and details."""
        
        analysis_prompt = f"""
        Check these advisor credentials:
        Name: {advisor_data['name']}
        License ID: {advisor_data['licenseId']}
        Regulator: {advisor_data['regulator']}
        User ID: {advisor_data['userId']}
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
            
            return json.loads(completion.choices[0].message.content)
        except Exception as e:
            return {
                "status": "error",
                "message": f"Error checking advisor credentials: {str(e)}",
                "isRegistered": False,
                "details": None
            }
