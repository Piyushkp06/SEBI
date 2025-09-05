"""
Script to run the FastAPI server with proper initialization of all models and dependencies.
"""
import os
import sys
import logging
import uvicorn
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def check_dependencies():
    """Check and install required dependencies"""
    try:
        import spacy
        import nltk
        import pytesseract
        from pdf2image.pdf2image import convert_from_path
    except ImportError as e:
        logger.error(f"Missing dependency: {str(e)}")
        logger.info("Installing missing dependencies...")
        try:
            import subprocess
            subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        except Exception as e:
            logger.error(f"Failed to install dependencies: {str(e)}")
            sys.exit(1)

def setup_nltk():
    """Download required NLTK data"""
    try:
        import nltk
        nltk.download('punkt', quiet=True)
        logger.info("NLTK data downloaded successfully")
    except Exception as e:
        logger.error(f"Failed to download NLTK data: {str(e)}")
        sys.exit(1)

def setup_spacy():
    """Download and set up spaCy model"""
    try:
        import spacy
        try:
            spacy.load("en_core_web_sm")
            logger.info("spaCy model already installed")
        except OSError:
            logger.info("Downloading spaCy model...")
            import subprocess
            subprocess.check_call([sys.executable, "-m", "spacy", "download", "en_core_web_sm"])
            logger.info("spaCy model downloaded successfully")
    except Exception as e:
        logger.error(f"Failed to set up spaCy: {str(e)}")
        sys.exit(1)

def check_ocr_dependencies():
    """Check Tesseract and Poppler installation"""
    import shutil
    
    # Check Tesseract
    if not shutil.which('tesseract'):
        logger.warning("""
        Tesseract OCR is not installed. PDF OCR functionality will be limited.
        
        To install Tesseract:
        - Windows (using Chocolatey): choco install tesseract
        - Linux: sudo apt-get install tesseract-ocr
        - macOS: brew install tesseract
        """)
    
    # Check Poppler
    if not shutil.which('pdftoppm'):
        logger.warning("""
        Poppler is not installed. PDF processing will be limited.
        
        To install Poppler:
        - Windows (using Chocolatey): choco install poppler
        - Linux: sudo apt-get install poppler-utils
        - macOS: brew install poppler
        """)

def check_env_variables():
    """Check required environment variables"""
    required_vars = ['GROQ_API_KEY']
    
    # Make sure .env is loaded
    env_path = Path(__file__).parent / '.env'
    if not env_path.exists():
        logger.error(f"Missing .env file at {env_path}")
        sys.exit(1)
    
    # Force reload of .env file
    load_dotenv(dotenv_path=env_path, override=True)
    
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        logger.error(f"Missing environment variables: {', '.join(missing_vars)}")
        logger.info("Please check your .env file contains the required variables")
        sys.exit(1)
    else:
        logger.info("Environment variables loaded successfully")

def create_upload_dir():
    """Create directory for temporary file uploads"""
    upload_dir = Path("uploads")
    upload_dir.mkdir(exist_ok=True)
    return upload_dir

def main():
    """Main function to start the server"""
    logger.info("Starting SEBI AI Analysis API server...")
    
    # Initial setup
    logger.info("Checking dependencies...")
    check_dependencies()
    
    logger.info("Setting up NLTK...")
    setup_nltk()
    
    logger.info("Setting up spaCy...")
    setup_spacy()
    
    logger.info("Checking OCR dependencies...")
    check_ocr_dependencies()
    
    logger.info("Checking environment variables...")
    check_env_variables()
    
    logger.info("Creating upload directory...")
    upload_dir = create_upload_dir()
    
    # Start the server
    logger.info("Starting FastAPI server...")
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=5000,
        reload=True,
        log_level="info"
    )

if __name__ == "__main__":
    main()
