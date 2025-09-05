import requests
import json
import os
from pathlib import Path

def fetch_all_sebi_advisors():
    """
    Fetch all advisor details from SEBI website
    """
    base_url = "https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognisedFpi=yes&intmId=14"
    all_records = []
    
    print("Starting to fetch SEBI advisor data...")
    
    for page in range(1, 700):  # total pages
        try:
            url = base_url.format(page)
            print(f"Fetching page {page}...")
            
            resp = requests.get(url, timeout=10)
            if resp.status_code != 200:
                print(f"Failed to fetch page {page}: Status {resp.status_code}")
                break
                
            data = resp.json()  # if it returns JSON
            if not data or not data.get("records"):
                print(f"No more data found at page {page}")
                break
                
            all_records.extend(data["records"])
            print(f"Page {page}: Added {len(data['records'])} records")
            
        except requests.RequestException as e:
            print(f"Request error on page {page}: {e}")
            break
        except json.JSONDecodeError as e:
            print(f"JSON decode error on page {page}: {e}")
            break
        except Exception as e:
            print(f"Unexpected error on page {page}: {e}")
            break

    print(f"Total advisors fetched: {len(all_records)}")
    return all_records

def save_advisor_data(advisor_data):
    """
    Save advisor data to JSON file
    """
    # Create data directory if it doesn't exist
    data_dir = Path(__file__).parent.parent / "data"
    data_dir.mkdir(exist_ok=True)
    
    file_path = data_dir / "sebi_advisors.json"
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(advisor_data, f, indent=2, ensure_ascii=False)
    
    print(f"Advisor data saved to: {file_path}")
    return file_path

def main():
    """
    Main function to fetch and save SEBI advisor data
    """
    try:
        advisors = fetch_all_sebi_advisors()
        if advisors:
            file_path = save_advisor_data(advisors)
            print(f"Successfully saved {len(advisors)} advisor records")
            
            # Print sample record for verification
            if advisors:
                print("\nSample record:")
                print(json.dumps(advisors[0], indent=2))
        else:
            print("No advisor data was fetched")
            
    except Exception as e:
        print(f"Error in main: {e}")

if __name__ == "__main__":
    main()
