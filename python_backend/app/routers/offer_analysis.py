from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional, List
import tempfile
import os
import json
import logging
from pathlib import Path
from ..models.schemas import TextData, AnalysisResponse
from ..services.groq_service import GroqService
from ..utils.text_processing import process_file, combine_text_data

# Configure logging
logger = logging.getLogger(__name__)

router = APIRouter()
groq_service = GroqService()

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_offer(
    textData: str = Form(...),
    files: Optional[List[UploadFile]] = File(default=None),
    contentType: Optional[str] = Form(default=None)
):
    logger.info("Received analyze request")
    """
    Analyze investment offer from text and uploaded files
    """
    file_texts = []
    
    # Parse the text data from form
    text_data_dict = json.loads(textData)
    
    # Parse the textData JSON
    try:
        text_data_dict = json.loads(textData)
        logger.info("Successfully parsed text data")
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse text data: {str(e)}")
        raise HTTPException(status_code=400, detail="Invalid text data format")

    # Process uploaded files
    file_results = []
    if files:
        for file in files:
            try:
                suffix = Path(file.filename or '').suffix or '.tmp'
                with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
                    content = await file.read()
                    temp_file.write(content)
                    temp_file.flush()
                    
                    # Process the file
                    result = process_file(temp_file.name)
                    file_results.append(result)
                    logger.info(f"Processed file: {file.filename}")
                    
                    # Clean up
                    os.unlink(temp_file.name)
            except Exception as e:
                logger.error(f"Error processing file {file.filename}: {str(e)}")
                continue
    
    # Combine all data into structured format
    combined_data = combine_text_data(text_data_dict, file_results)
    
    # Add the structured data to the analysis input
    analysis_input = {
        "textData": text_data_dict,
        "processedData": combined_data,
        "documentCount": len(file_results),
        "documentsProcessed": all(result.get("success", False) for result in file_results)
    }
    
    # Analyze with enhanced context
    analysis_result = await groq_service.analyze_investment_offer(json.dumps(analysis_input, indent=2))
    
    return AnalysisResponse(**analysis_result)
