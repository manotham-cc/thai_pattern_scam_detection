import os
from dotenv import load_dotenv

load_dotenv() # Load environment variables from .env file

# config.py
MODEL_SIZE = "deepdml/faster-whisper-large-v3-turbo-ct2"     
DEVICE = "cuda"            
COMPUTE_TYPE = "int8_float32"  
language="en"
SAMPLE_RATE = 16000
BLOCK_SIZE = 512  # 32ms at 16kHz
VAD_THRESHOLD = 0.6
