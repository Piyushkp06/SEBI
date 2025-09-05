import requests
from bs4 import BeautifulSoup
import re

def investigate_intermediaries_page():
    """Investigate the intermediaries page to find advisor data sources"""
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
    }
    
    try:
        print("🔍 Investigating intermediaries page...")
        resp = requests.get('https://www.sebi.gov.in/intermediaries.html', headers=headers, timeout=15)
        print(f"Status: {resp.status_code}")
        
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.text, 'html.parser')
            
            # Look for Research Analyst related links
            print("\n📋 Looking for Research Analyst links...")
            analyst_links = []
            for link in soup.find_all('a', href=True):
                text = link.get_text().lower()
                href = link['href']
                if 'research' in text and 'analyst' in text:
                    full_url = href if href.startswith('http') else f"https://www.sebi.gov.in{href}"
                    analyst_links.append({
                        'text': link.get_text().strip(),
                        'url': full_url
                    })
                    print(f"  📊 {link.get_text().strip()} -> {full_url}")
            
            # Look for any data tables or lists on the page
            print("\n📋 Looking for data tables...")
            tables = soup.find_all('table')
            print(f"Found {len(tables)} tables on the page")
            
            # Look for JavaScript that might contain API calls
            print("\n📋 Looking for JavaScript API calls...")
            scripts = soup.find_all('script')
            api_patterns = [
                r'ajax.*url.*["\']([^"\']+)["\']',
                r'fetch.*["\']([^"\']+)["\']',
                r'XMLHttpRequest.*["\']([^"\']+)["\']',
                r'\.action["\']',
                r'ResearchAnalyst',
                r'intermediaries.*action'
            ]
            
            for i, script in enumerate(scripts):
                if script.string:
                    for pattern in api_patterns:
                        matches = re.findall(pattern, script.string, re.IGNORECASE)
                        if matches:
                            print(f"  🔍 Script {i+1} - Pattern '{pattern}' found:")
                            for match in matches:
                                print(f"    {match}")
            
            # Test the Research Analyst links we found
            if analyst_links:
                print(f"\n🚀 Testing {len(analyst_links)} Research Analyst links...")
                for link in analyst_links:
                    try:
                        print(f"\n🔍 Testing: {link['url']}")
                        resp = requests.get(link['url'], headers=headers, timeout=10)
                        print(f"  Status: {resp.status_code}")
                        
                        if resp.status_code == 200:
                            # Check if this page has the data we need
                            soup = BeautifulSoup(resp.text, 'html.parser')
                            
                            # Look for pagination or data loading indicators
                            forms = soup.find_all('form')
                            if forms:
                                print(f"  📝 Found {len(forms)} forms - potential data submission")
                                for form in forms:
                                    action = form.get('action', '')
                                    if action:
                                        print(f"    Form action: {action}")
                            
                            # Look for tables with data
                            tables = soup.find_all('table')
                            if tables:
                                print(f"  📊 Found {len(tables)} tables")
                                for j, table in enumerate(tables):
                                    rows = table.find_all('tr')
                                    if len(rows) > 1:  # Has header + data
                                        print(f"    Table {j+1}: {len(rows)} rows")
                                        # Show first few headers
                                        headers_row = rows[0].find_all(['th', 'td'])
                                        if headers_row:
                                            header_texts = [h.get_text().strip() for h in headers_row[:3]]
                                            print(f"      Headers: {header_texts}")
                        
                    except Exception as e:
                        print(f"  ❌ Error: {str(e)}")
        
    except Exception as e:
        print(f"❌ Error investigating intermediaries page: {str(e)}")

if __name__ == "__main__":
    investigate_intermediaries_page()
