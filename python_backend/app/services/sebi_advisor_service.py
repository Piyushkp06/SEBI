import json
import os
from pathlib import Path
from typing import Dict, List, Optional, Any
import re
from difflib import SequenceMatcher

class SEBIAdvisorService:
    def __init__(self):
        self.advisor_data = []
        self.data_file = Path(__file__).parent.parent / "data" / "sebi_advisors.json"
        self.load_advisor_data()
    
    def load_advisor_data(self):
        """
        Load advisor data from JSON file
        """
        try:
            if self.data_file.exists():
                with open(self.data_file, 'r', encoding='utf-8') as f:
                    self.advisor_data = json.load(f)
                print(f"Loaded {len(self.advisor_data)} advisor records")
            else:
                print(f"Advisor data file not found: {self.data_file}")
                print("Run fetch_sebi_advisors.py first to download advisor data")
        except Exception as e:
            print(f"Error loading advisor data: {e}")
            self.advisor_data = []
    
    def normalize_name(self, name: str) -> str:
        """
        Normalize name for comparison
        """
        if not name:
            return ""
        # Remove extra spaces, convert to lowercase, remove special characters
        normalized = re.sub(r'[^\w\s]', '', name.lower().strip())
        normalized = ' '.join(normalized.split())
        return normalized
    
    def calculate_similarity(self, str1: str, str2: str) -> float:
        """
        Calculate similarity between two strings
        """
        return SequenceMatcher(None, str1, str2).ratio()
    
    def search_advisor_by_name(self, advisor_name: str, threshold: float = 0.8) -> List[Dict]:
        """
        Search for advisor by name with fuzzy matching
        """
        if not advisor_name or not self.advisor_data:
            return []
        
        normalized_search = self.normalize_name(advisor_name)
        matches = []
        
        for advisor in self.advisor_data:
            # Check various name fields that might exist in SEBI data
            name_fields = ['name', 'advisorName', 'entityName', 'companyName', 'firmName']
            
            for field in name_fields:
                if field in advisor and advisor[field]:
                    normalized_advisor_name = self.normalize_name(advisor[field])
                    similarity = self.calculate_similarity(normalized_search, normalized_advisor_name)
                    
                    if similarity >= threshold:
                        match = advisor.copy()
                        match['similarity_score'] = similarity
                        match['matched_field'] = field
                        matches.append(match)
                        break
        
        # Sort by similarity score (highest first)
        matches.sort(key=lambda x: x.get('similarity_score', 0), reverse=True)
        return matches
    
    def search_advisor_by_registration(self, registration_number: str) -> Optional[Dict]:
        """
        Search for advisor by registration number (exact match)
        """
        if not registration_number or not self.advisor_data:
            return None
        
        # Clean the registration number
        clean_reg = registration_number.strip().upper()
        
        for advisor in self.advisor_data:
            # Check various registration fields
            reg_fields = ['registrationNumber', 'regNo', 'licenseId', 'sebiRegNo']
            
            for field in reg_fields:
                if field in advisor and advisor[field]:
                    if advisor[field].strip().upper() == clean_reg:
                        return advisor
        
        return None
    
    def verify_advisor(self, advisor_info: Dict[str, Any]) -> Dict[str, Any]:
        """
        Verify advisor against SEBI database
        """
        result = {
            "status": "not_found",
            "isRegistered": False,
            "registrationStatus": "not_found",
            "riskLevel": "high",
            "warnings": [],
            "recommendations": [],
            "matches": [],
            "details": None
        }
        
        if not self.advisor_data:
            result["status"] = "error"
            result["warnings"].append("SEBI advisor database not available")
            result["recommendations"].append("Manual verification required")
            return result
        
        # Try to find by registration number first (most reliable)
        registration_number = advisor_info.get('registrationNumber') or advisor_info.get('licenseId')
        if registration_number:
            exact_match = self.search_advisor_by_registration(registration_number)
            if exact_match:
                # Check advisor status and verification
                status = exact_match.get('status', '').lower()
                is_verified = exact_match.get('sebiVerified', False)
                
                if status == 'active' and is_verified:
                    result["status"] = "verified"
                    result["isRegistered"] = True
                    result["registrationStatus"] = "active"
                    result["riskLevel"] = "low"
                    result["details"] = exact_match
                    result["recommendations"].append("Advisor found in SEBI database with valid registration")
                elif status == 'suspended' or not is_verified:
                    result["status"] = "suspicious"
                    result["isRegistered"] = False
                    result["registrationStatus"] = "suspended"
                    result["riskLevel"] = "high"
                    result["details"] = exact_match
                    result["warnings"].append("Advisor registration is suspended or invalid")
                    result["recommendations"].append("DO NOT PROCEED - Advisor may be fraudulent")
                    result["recommendations"].append("Report to SEBI if this advisor contacted you")
                else:
                    result["status"] = "unverified"
                    result["isRegistered"] = False
                    result["registrationStatus"] = "unknown"
                    result["riskLevel"] = "medium"
                    result["details"] = exact_match
                    result["warnings"].append("Unable to verify advisor status")
                    result["recommendations"].append("Manual verification required")
                
                return result
        
        # Try to find by name
        advisor_name = advisor_info.get('name') or advisor_info.get('advisorName')
        if advisor_name:
            name_matches = self.search_advisor_by_name(advisor_name, threshold=0.7)
            result["matches"] = name_matches[:5]  # Top 5 matches
            
            if name_matches:
                best_match = name_matches[0]
                similarity = best_match.get('similarity_score', 0)
                
                # Check advisor status for name matches too
                status = best_match.get('status', '').lower()
                is_verified = best_match.get('sebiVerified', False)
                
                if similarity >= 0.9:
                    if status == 'active' and is_verified:
                        result["status"] = "verified"
                        result["isRegistered"] = True
                        result["registrationStatus"] = "active"
                        result["riskLevel"] = "low"
                        result["recommendations"].append(f"Strong name match found (similarity: {similarity:.2%})")
                    elif status == 'suspended' or not is_verified:
                        result["status"] = "suspicious"
                        result["isRegistered"] = False
                        result["registrationStatus"] = "suspended"
                        result["riskLevel"] = "high"
                        result["warnings"].append(f"Strong name match but advisor is suspended/invalid (similarity: {similarity:.2%})")
                        result["recommendations"].append("DO NOT PROCEED - Advisor may be fraudulent")
                    else:
                        result["status"] = "unverified"
                        result["isRegistered"] = False
                        result["registrationStatus"] = "unknown"
                        result["riskLevel"] = "medium"
                        result["warnings"].append(f"Name match found but status unclear (similarity: {similarity:.2%})")
                    
                    result["details"] = best_match
                elif similarity >= 0.8:
                    result["status"] = "partial_match"
                    result["isRegistered"] = True
                    result["registrationStatus"] = "needs_verification"
                    result["riskLevel"] = "medium"
                    result["details"] = best_match
                    result["warnings"].append(f"Partial name match found (similarity: {similarity:.2%})")
                    result["recommendations"].append("Manual verification recommended due to partial match")
                else:
                    result["status"] = "low_confidence"
                    result["riskLevel"] = "medium"
                    result["warnings"].append("Low confidence matches found")
                    result["recommendations"].append("Consider manual verification")
        
        # If no matches found
        if result["status"] == "not_found":
            result["warnings"].append("Advisor not found in SEBI database")
            result["recommendations"].append("Verify advisor credentials manually")
            result["recommendations"].append("Request SEBI registration certificate")
        
        return result
    
    def get_stats(self) -> Dict[str, Any]:
        """
        Get statistics about the advisor database
        """
        return {
            "total_advisors": len(self.advisor_data),
            "data_file_exists": self.data_file.exists(),
            "data_file_path": str(self.data_file)
        }
