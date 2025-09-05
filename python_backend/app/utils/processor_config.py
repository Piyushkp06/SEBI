from typing import Dict, Any
from dataclasses import dataclass

@dataclass
class ProcessorConfig:
    # File size limits
    max_pdf_size_mb: int = 50
    max_docx_size_mb: int = 25
    max_txt_size_mb: int = 10
    
    # Processing limits
    max_pdf_pages: int = 100
    max_text_length: int = 1000000  # 1MB of text
    
    # OCR settings
    ocr_dpi: int = 300
    ocr_timeout: int = 300  # seconds
    
    # Memory management
    chunk_size: int = 10  # pages per chunk
    
    # Language settings
    allowed_languages: set[str] | None = None  # None means all languages allowed
    
    def __post_init__(self):
        if self.allowed_languages is None:
            self.allowed_languages = {'en'}  # Default to English only
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'max_pdf_size_mb': self.max_pdf_size_mb,
            'max_docx_size_mb': self.max_docx_size_mb,
            'max_txt_size_mb': self.max_txt_size_mb,
            'max_pdf_pages': self.max_pdf_pages,
            'max_text_length': self.max_text_length,
            'ocr_dpi': self.ocr_dpi,
            'ocr_timeout': self.ocr_timeout,
            'chunk_size': self.chunk_size,
            'allowed_languages': list(self.allowed_languages) if self.allowed_languages else []
        }

    @classmethod
    def from_dict(cls, config_dict: Dict[str, Any]) -> 'ProcessorConfig':
        if 'allowed_languages' in config_dict:
            config_dict['allowed_languages'] = set(config_dict['allowed_languages'])
        return cls(**config_dict)
