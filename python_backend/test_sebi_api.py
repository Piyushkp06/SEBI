import requests
import time
from urllib.parse import urljoin

def test_sebi_endpoints():
    """Test various SEBI endpoint combinations to find working API"""
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Referer': 'https://www.sebi.gov.in/'
    }
    
    base_urls = [
        "https://www.sebi.gov.in/",
        "https://www.sebi.gov.in/sebiweb/",
        "https://www.sebi.gov.in/intermediaries/",
    ]
    
    endpoints = [
        "intermediaries/ResearchAnalystList.action",
        "sebiweb/intermediaries/ResearchAnalystList.action",
        "api/intermediaries/ResearchAnalystList",
        "intermediaries/research-analysts",
        "sebiweb/intermediaries/research-analysts",
        "intermediaries",
        "sebiweb/intermediaries"
    ]
    
    for base_url in base_urls:
        for endpoint in endpoints:
            try:
                url = urljoin(base_url, endpoint)
                if "action" in endpoint:
                    url += "?pageNo=1"
                
                print(f"Testing: {url}")
                resp = requests.get(url, headers=headers, timeout=10)
                print(f"  Status: {resp.status_code}")
                print(f"  Content-Type: {resp.headers.get('content-type', 'Unknown')}")
                print(f"  Content Length: {len(resp.text)}")
                
                if resp.status_code == 200:
                    print(f"  ✅ SUCCESS! First 200 chars: {resp.text[:200]}")
                    if resp.headers.get('content-type', '').startswith('application/json'):
                        try:
                            data = resp.json()
                            print(f"  JSON keys: {list(data.keys()) if isinstance(data, dict) else 'Not a dict'}")
                        except:
                            print("  Not valid JSON")
                else:
                    print(f"  ❌ Failed")
                
                print("-" * 60)
                time.sleep(1)  # Be respectful to the server
                
            except Exception as e:
                print(f"  Error: {str(e)}")
                print("-" * 60)

if __name__ == "__main__":
    test_sebi_endpoints()
