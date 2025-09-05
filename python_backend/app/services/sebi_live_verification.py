"""
Real-time SEBI Advisor Verification Service
This service directly checks SEBI's website for advisor verification
instead of maintaining a local database.
"""

import requests
from bs4 import BeautifulSoup
import re
from typing import Dict, Any, Optional
import time
from urllib.parse import urljoin, quote
import logging

logger = logging.getLogger(__name__)

class SEBILiveVerificationService:
    def __init__(self):
        self.base_url = "https://www.sebi.gov.in"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        })
        
    def verify_advisor_on_sebi_website(self, advisor_info: Dict[str, Any]) -> Dict[str, Any]:
        """
        Verify advisor by searching SEBI's official website
        """
        advisor_name = advisor_info.get('name', '').strip()
        registration_number = advisor_info.get('registrationNumber', '').strip()
        company_name = advisor_info.get('companyName', '').strip()
        
        # Initialize result
        result = {
            "status": "not_found",
            "isRegistered": False,
            "registrationStatus": "not_found",
            "riskLevel": "high",
            "warnings": [],
            "recommendations": [],
            "searchAttempts": [],
            "details": None,
            "verification_method": "live_sebi_search"
        }
        
        # Strategy 1: Try to find intermediaries page and search there
        search_results = self._search_intermediaries_page(advisor_name, registration_number, company_name)
        result["searchAttempts"].append(search_results)
        
        if search_results.get("found"):
            return self._process_found_advisor(search_results, result)
        
        # Strategy 2: Try general SEBI site search
        site_search_results = self._search_sebi_site(advisor_name, registration_number)
        result["searchAttempts"].append(site_search_results)
        
        if site_search_results.get("found"):
            return self._process_found_advisor(site_search_results, result)
        
        # Strategy 3: Check for known fraud patterns
        fraud_check = self._check_fraud_patterns(advisor_info)
        if fraud_check.get("is_suspicious"):
            result["status"] = "suspicious"
            result["riskLevel"] = "high"
            result["warnings"].extend(fraud_check.get("warnings", []))
            result["recommendations"].extend(fraud_check.get("recommendations", []))
            return result
        
        # If nothing found, return not found result
        result["warnings"].append("Advisor not found on SEBI official website")
        result["recommendations"].extend([
            "Request official SEBI registration certificate",
            "Verify advisor credentials through SEBI helpline",
            "Be cautious about investment advice from unregistered advisors",
            "Check SEBI website manually for advisor registration"
        ])
        
        return result
    
    def _search_intermediaries_page(self, name: str, reg_number: str, company: str) -> Dict[str, Any]:
        """
        Search the intermediaries page for advisor information
        """
        search_result = {
            "method": "intermediaries_page_search",
            "found": False,
            "error": None,
            "details": None
        }
        
        try:
            # Try the intermediaries page
            intermediaries_url = f"{self.base_url}/intermediaries.html"
            response = self.session.get(intermediaries_url, timeout=10)
            
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # Look for research analyst links
                ra_links = self._find_research_analyst_links(soup)
                
                for link in ra_links:
                    advisor_found = self._search_advisor_page(link, name, reg_number, company)
                    if advisor_found.get("found"):
                        search_result["found"] = True
                        search_result["details"] = advisor_found
                        return search_result
                        
        except Exception as e:
            search_result["error"] = str(e)
            logger.error(f"Error searching intermediaries page: {e}")
        
        return search_result
    
    def _search_sebi_site(self, name: str, reg_number: str) -> Dict[str, Any]:
        """
        Perform a general site search on SEBI website
        """
        search_result = {
            "method": "site_search",
            "found": False,
            "error": None,
            "details": None
        }
        
        try:
            # Create search queries
            search_queries = []
            if reg_number:
                search_queries.append(reg_number)
            if name:
                search_queries.append(f'"{name}"')
            
            for query in search_queries:
                # Try SEBI's search functionality (if available)
                search_url = f"{self.base_url}/search.html"
                search_params = {'q': query}
                
                response = self.session.get(search_url, params=search_params, timeout=10)
                
                if response.status_code == 200:
                    soup = BeautifulSoup(response.text, 'html.parser')
                    
                    # Look for registration-related content
                    if self._check_page_for_advisor_info(soup, name, reg_number):
                        search_result["found"] = True
                        search_result["details"] = {
                            "search_query": query,
                            "found_on_page": search_url
                        }
                        return search_result
                        
        except Exception as e:
            search_result["error"] = str(e)
            logger.error(f"Error in site search: {e}")
        
        return search_result
    
    def _find_research_analyst_links(self, soup: BeautifulSoup) -> list:
        """
        Find links related to research analysts on the page
        """
        ra_links = []
        
        for link in soup.find_all('a', href=True):
            href = link['href']
            text = link.get_text().lower()
            
            # Look for research analyst related links
            if any(keyword in text for keyword in ['research analyst', 'intermediary', 'advisor']):
                full_url = href if href.startswith('http') else urljoin(self.base_url, href)
                ra_links.append({
                    'url': full_url,
                    'text': link.get_text().strip()
                })
        
        return ra_links
    
    def _search_advisor_page(self, link_info: Dict, name: str, reg_number: str, company: str) -> Dict[str, Any]:
        """
        Search a specific page for advisor information
        """
        try:
            response = self.session.get(link_info['url'], timeout=10)
            
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')
                
                if self._check_page_for_advisor_info(soup, name, reg_number):
                    return {
                        "found": True,
                        "page_url": link_info['url'],
                        "page_title": link_info['text']
                    }
                    
        except Exception as e:
            logger.error(f"Error searching advisor page {link_info['url']}: {e}")
        
        return {"found": False}
    
    def _check_page_for_advisor_info(self, soup: BeautifulSoup, name: str, reg_number: str) -> bool:
        """
        Check if a page contains the advisor information we're looking for
        """
        page_text = soup.get_text().lower()
        
        # Check for registration number
        if reg_number and reg_number.lower() in page_text:
            return True
        
        # Check for name (with some flexibility)
        if name:
            name_parts = name.lower().split()
            if len(name_parts) >= 2:
                # Check if at least 2 parts of the name are present
                found_parts = sum(1 for part in name_parts if part in page_text)
                if found_parts >= 2:
                    return True
        
        return False
    
    def _check_fraud_patterns(self, advisor_info: Dict[str, Any]) -> Dict[str, Any]:
        """
        Check for known fraud patterns in advisor information
        """
        fraud_indicators = []
        
        name = advisor_info.get('name', '').lower()
        company = advisor_info.get('companyName', '').lower()
        email = advisor_info.get('contactInfo', {}).get('email', '').lower()
        phone = advisor_info.get('contactInfo', {}).get('phone', '')
        
        # Check for suspicious patterns
        if any(word in name for word in ['fake', 'scam', 'fraud', 'cheat']):
            fraud_indicators.append("Suspicious words in advisor name")
        
        if any(word in company for word in ['scam', 'fraud', 'fake', 'cheat', 'quick money']):
            fraud_indicators.append("Suspicious words in company name")
        
        if email and any(domain in email for domain in ['tempmail', '10minutemail', 'guerrilla']):
            fraud_indicators.append("Temporary email domain detected")
        
        if phone and (phone.startswith('+91-0000') or phone.count('0') > 7):
            fraud_indicators.append("Suspicious phone number pattern")
        
        # Check for unrealistic promises in any text
        text_content = ' '.join(str(v) for v in advisor_info.values()).lower()
        risky_phrases = [
            'guaranteed returns', '100% profit', 'no risk', 'get rich quick',
            'secret formula', 'limited time offer', 'act now', 'double your money'
        ]
        
        for phrase in risky_phrases:
            if phrase in text_content:
                fraud_indicators.append(f"Suspicious marketing phrase detected: '{phrase}'")
        
        is_suspicious = len(fraud_indicators) > 0
        
        return {
            "is_suspicious": is_suspicious,
            "fraud_indicators": fraud_indicators,
            "warnings": [f"Potential fraud indicator: {indicator}" for indicator in fraud_indicators],
            "recommendations": [
                "This appears to be a potentially fraudulent advisor",
                "Do not provide any money or personal information",
                "Report this advisor to SEBI immediately"
            ] if is_suspicious else []
        }
    
    def _process_found_advisor(self, search_results: Dict, result: Dict) -> Dict[str, Any]:
        """
        Process results when advisor is found
        """
        result["status"] = "found_on_sebi"
        result["isRegistered"] = True
        result["registrationStatus"] = "found"
        result["riskLevel"] = "low"
        result["details"] = search_results.get("details")
        result["recommendations"] = [
            "Advisor found on SEBI official website",
            "Cross-verify the registration details",
            "Ensure you're dealing with the correct person"
        ]
        result["warnings"] = [
            "Always verify advisor identity in person",
            "Check registration validity dates"
        ]
        
        return result
    
    def get_verification_info(self) -> Dict[str, Any]:
        """
        Get information about the verification service
        """
        return {
            "service_type": "live_sebi_verification",
            "description": "Real-time verification against SEBI official website",
            "base_url": self.base_url,
            "last_updated": "Real-time",
            "reliability": "High - directly from SEBI website"
        }

# Initialize the live verification service
sebi_live_service = SEBILiveVerificationService()
