import requests
import json

def test_advisor_endpoints():
    """Test the advisor verification endpoints"""
    
    base_url = "http://localhost:5000/api/v1"
    
    print("🧪 Testing SEBI Advisor API Endpoints")
    print("=" * 50)
    
    # Test 1: Valid advisor verification
    print("\n🟢 Test 1: Valid Advisor Verification")
    data = {
        'name': 'John Smith',
        'registrationNumber': 'INH000000001',
        'companyName': 'Smith Investment Advisory'
    }
    
    try:
        response = requests.post(f"{base_url}/advisors/verify", data=data, timeout=10)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Status: {result.get('status')}")
            print(f"Risk Level: {result.get('riskLevel')}")
            print(f"Registered: {result.get('isRegistered')}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {str(e)}")
    
    # Test 2: Fraudulent advisor
    print("\n🔴 Test 2: Fraudulent Advisor Verification")
    data = {
        'name': 'Fraud Advisor',
        'registrationNumber': 'FAKE001',
        'companyName': 'Scam Investment Corp'
    }
    
    try:
        response = requests.post(f"{base_url}/advisors/verify", data=data, timeout=10)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Status: {result.get('status')}")
            print(f"Risk Level: {result.get('riskLevel')}")
            print(f"Registered: {result.get('isRegistered')}")
            if result.get('warnings'):
                print(f"Warnings: {result['warnings']}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {str(e)}")
    
    # Test 3: Extract advisor info
    print("\n🔍 Test 3: Extract Advisor Info")
    text_data = {
        "offerText": "Investment opportunity from John Smith at Smith Investment Advisory. Contact: john.smith@smithadvisory.com, Phone: +91-9876543210. SEBI Registration: INH000000001",
        "description": "Test investment offer with advisor information"
    }
    
    form_data = {
        'textData': json.dumps(text_data)
    }
    
    try:
        response = requests.post(f"{base_url}/offers/extract-advisor", data=form_data, timeout=10)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Success: {result.get('success')}")
            advisor_info = result.get('advisorInfo')
            if advisor_info:
                print(f"Advisor Found: {advisor_info.get('advisorFound')}")
                print(f"Advisor Name: {advisor_info.get('advisorName')}")
                print(f"Registration: {advisor_info.get('credentials', {}).get('registrationNumber')}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {str(e)}")
    
    print("\n✅ API Testing completed!")

if __name__ == "__main__":
    test_advisor_endpoints()
