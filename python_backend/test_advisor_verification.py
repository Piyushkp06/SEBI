"""
Test script to verify the SEBI live advisor verification functionality
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.services.sebi_live_verification import SEBILiveVerificationService

def test_live_advisor_verification():
    """Test the live advisor verification with sample data"""
    
    print("🧪 Testing SEBI Live Advisor Verification Service")
    print("=" * 50)
    
    # Initialize service
    sebi_service = SEBILiveVerificationService()
    
    # Get service info
    service_info = sebi_service.get_verification_info()
    print(f"Service Type: {service_info['service_type']}")
    print(f"Description: {service_info['description']}")
    print(f"Base URL: {service_info['base_url']}")
    print(f"Reliability: {service_info['reliability']}")
    
    # Test 1: Real advisor (you can replace with actual SEBI registered advisor)
    print("\n🟢 Test 1: Legitimate-looking Advisor")
    test_advisor_1 = {
        "name": "Ashish Dhawan",
        "registrationNumber": "INH000000123",
        "companyName": "ChrysCapital Management"
    }
    
    print(f"Testing advisor: {test_advisor_1['name']}")
    result1 = sebi_service.verify_advisor_on_sebi_website(test_advisor_1)
    print(f"Status: {result1['status']}")
    print(f"Risk Level: {result1['riskLevel']}")
    print(f"Registered: {result1['isRegistered']}")
    print(f"Verification Method: {result1['verification_method']}")
    if result1.get('warnings'):
        print(f"Warnings: {result1['warnings'][:2]}")  # Show first 2 warnings
    
    # Test 2: Suspicious advisor
    print("\n🔴 Test 2: Suspicious/Fraudulent Advisor")
    test_advisor_2 = {
        "name": "Fake Advisor Scammer",
        "registrationNumber": "FAKE001",
        "companyName": "Quick Money Scam Corp",
        "contactInfo": {
            "email": "scammer@tempmail.com",
            "phone": "+91-0000000000"
        }
    }
    
    print(f"Testing advisor: {test_advisor_2['name']}")
    result2 = sebi_service.verify_advisor_on_sebi_website(test_advisor_2)
    print(f"Status: {result2['status']}")
    print(f"Risk Level: {result2['riskLevel']}")
    print(f"Registered: {result2['isRegistered']}")
    if result2.get('warnings'):
        print(f"Warnings: {result2['warnings'][:2]}")  # Show first 2 warnings
    
    # Test 3: Unknown advisor
    print("\n🟡 Test 3: Unknown Advisor")
    test_advisor_3 = {
        "name": "John Smith",
        "registrationNumber": "INH000000999",
        "companyName": "Smith Investment Advisory"
    }
    
    print(f"Testing advisor: {test_advisor_3['name']}")
    result3 = sebi_service.verify_advisor_on_sebi_website(test_advisor_3)
    print(f"Status: {result3['status']}")
    print(f"Risk Level: {result3['riskLevel']}")
    print(f"Registered: {result3['isRegistered']}")
    if result3.get('searchAttempts'):
        print(f"Search Attempts: {len(result3['searchAttempts'])}")
    
    # Test 4: Advisor with risky content
    print("\n🟠 Test 4: Advisor with Suspicious Marketing")
    test_advisor_4 = {
        "name": "Quick Rich Investment",
        "companyName": "Guaranteed Returns Ltd",
        "description": "Get guaranteed returns of 100% profit in just 30 days! No risk investment!"
    }
    
    print(f"Testing advisor: {test_advisor_4['name']}")
    result4 = sebi_service.verify_advisor_on_sebi_website(test_advisor_4)
    print(f"Status: {result4['status']}")
    print(f"Risk Level: {result4['riskLevel']}")
    if result4.get('warnings'):
        print(f"Warnings: {result4['warnings'][:2]}")
    
    print("\n" + "="*50)
    print("🎯 SEBI Live Verification Summary:")
    print("- Checks SEBI's official website in real-time")
    print("- Detects fraud patterns in advisor information")
    print("- Provides risk assessment and recommendations")
    print("- No local data storage required")
    print("✅ Testing completed!")

if __name__ == "__main__":
    test_live_advisor_verification()
