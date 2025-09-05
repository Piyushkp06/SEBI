from .document_processor import DocumentProcessor
from typing import Dict, List, Any

document_processor = DocumentProcessor()

def process_file(file_path: str) -> Dict[str, Any]:
    """
    Process a file and extract structured information
    """
    return document_processor.process_document(file_path)

def combine_text_data(text_data: dict, file_results: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Combine text data and processed file contents into a structured analysis input
    """
    combined_data = {
        "text_input": {
            "links": text_data.get('links', ''),
            "emails": text_data.get('emails', ''),
            "company_name": text_data.get('companyName', ''),
            "advisor_name": text_data.get('advisorName', ''),
            "contact_info": text_data.get('contactInfo', '')
        },
        "documents": [],
        "entities": {
            "organizations": set(),
            "people": set(),
            "money": set(),
            "percentages": set(),
            "dates": set()
        },
        "investment_details": {
            "returns_mentioned": [],
            "risk_statements": [],
            "timeframes": [],
            "investment_amounts": []
        },
        "contact_information": {
            "emails": set(),
            "phones": set(),
            "websites": set()
        },
        "key_phrases": set()
    }
    
    # Process each file result
    for result in file_results:
        if result.get("success", False):
            doc_data = {
                "text": result["text"],
                "language": result["language"],
                "entities": result["entities"],
                "investment_details": result["investment_details"]
            }
            combined_data["documents"].append(doc_data)
            
            # Merge entities
            for entity_type, entities in result["entities"].items():
                combined_data["entities"][entity_type].update(entities)
            
            # Merge investment details
            for detail_type, details in result["investment_details"].items():
                combined_data["investment_details"][detail_type].extend(details)
            
            # Merge contact information
            for info_type, info in result["contact_info"].items():
                combined_data["contact_information"][info_type].update(info)
            
            # Merge key phrases
            combined_data["key_phrases"].update(result["key_phrases"])
    
    # Convert sets to lists for JSON serialization
    combined_data["entities"] = {k: list(v) for k, v in combined_data["entities"].items()}
    combined_data["contact_information"] = {k: list(v) for k, v in combined_data["contact_information"].items()}
    combined_data["key_phrases"] = list(combined_data["key_phrases"])
    
    return combined_data
