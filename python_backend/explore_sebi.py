import requests
from bs4 import BeautifulSoup
import time

def explore_sebi_website():
    """Explore SEBI website to find where advisor data is actually located"""
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
    }
    
    try:
        # Start with the main page
        print("🔍 Exploring SEBI main page...")
        resp = requests.get('https://www.sebi.gov.in', headers=headers, timeout=10)
        print(f"Main page status: {resp.status_code}")
        
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.text, 'html.parser')
            
            # Look for links related to intermediaries, advisors, research analysts
            relevant_links = []
            for link in soup.find_all('a', href=True):
                href = link['href'].lower()
                text = link.get_text().lower()
                
                if any(keyword in href or keyword in text for keyword in 
                      ['intermediar', 'advisor', 'research', 'analyst', 'register']):
                    full_url = href if href.startswith('http') else f"https://www.sebi.gov.in{href}"
                    relevant_links.append({
                        'url': full_url,
                        'text': link.get_text().strip(),
                        'href': href
                    })
            
            print(f"\n📋 Found {len(relevant_links)} relevant links:")
            for i, link in enumerate(relevant_links[:10], 1):  # Show first 10
                print(f"{i}. {link['text']} -> {link['url']}")
            
            # Try some of the promising links
            promising_urls = [
                'https://www.sebi.gov.in/intermediaries.html',
                'https://www.sebi.gov.in/intermediaries/research-analysts.html',
                'https://www.sebi.gov.in/intermediaries/investment-advisers.html',
            ]
            
            for url in promising_urls:
                try:
                    print(f"\n🔍 Testing: {url}")
                    resp = requests.get(url, headers=headers, timeout=10)
                    print(f"  Status: {resp.status_code}")
                    if resp.status_code == 200:
                        # Look for API endpoints or data tables
                        soup = BeautifulSoup(resp.text, 'html.parser')
                        scripts = soup.find_all('script')
                        for script in scripts:
                            if script.string and ('ajax' in script.string.lower() or 
                                                'api' in script.string.lower() or
                                                'json' in script.string.lower()):
                                print(f"  📜 Found potential API call in script")
                                lines = script.string.split('\n')
                                for line in lines:
                                    if any(keyword in line.lower() for keyword in ['ajax', 'api', 'url', 'endpoint']):
                                        print(f"    {line.strip()}")
                                        
                except Exception as e:
                    print(f"  ❌ Error accessing {url}: {str(e)}")
        
        print("\n" + "="*60)
        print("🤔 SEBI API Analysis Summary:")
        print("- The original API endpoint appears to be blocked/changed")
        print("- SEBI website has anti-bot protection (Status 530)")
        print("- Manual investigation needed to find current data source")
        print("="*60)
                    
    except Exception as e:
        print(f"❌ Error exploring SEBI website: {str(e)}")

if __name__ == "__main__":
    explore_sebi_website()
