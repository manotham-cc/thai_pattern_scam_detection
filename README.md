# Project Overview

This project is a Proof-of-Concept (PoC) for a call center scam detection system. It uses an Automatic Speech Recognition (ASR) engine to transcribe audio and a Large Language Model (LLM) to classify the transcription for scam-related patterns.

## Technologies

*   **Core AI Engine:**
    *   `faster-whisper`: For the core speech-to-text functionality.
    *   `nemo_toolkit[asr]`: For NVIDIA NeMo ASR engine.
    *   `torch`, `torchaudio`: As dependencies for the AI model.
*   **LLM Integration:**
    *   `openai`: For interacting with OpenAI's LLMs.
*   **Utilities:**
    *   `python-dotenv`: For managing environment variables.

## Architecture

*   **`config.py`**: Contains the configuration for the ASR models.
*   **`scam_detector.py`**: Contains the `ScamDetector` class that uses OpenAI's LLM to identify scam patterns in text.
*   **`run.py`**: The main entry point for the PoC. It orchestrates the process of transcribing audio files from the `audio_files/` directory, classifying the text, and saving detected scam patterns to `output/scam_patterns.txt`.
*   **`audio_files/`**: A directory to place input audio files (e.g., `.wav`, `.mp3`, `.m4a`, `.mp4`).
*   **`output/`**: A directory where detected scam transcriptions are saved.
*   **`requirements.txt`**: Lists the project's Python dependencies.
*   **`example.env`**: An example file for setting up environment variables.

# Building and Running

## 1. Install Dependencies

To install the required Python packages, run:
```bash
pip install -r requirements.txt
```

## 2. Prepare for Classification (OpenAI API Key)

This project uses OpenAI's GPT model for scam classification. You need to set up your API key:
1.  **Create a `.env` file**: Copy the `example.env` file to `.env`:
    ```bash
    cp example.env .env
    ```
2.  **Add your OpenAI API key**: Open the newly created `.env` file and replace `"your-api-key-here"` with your actual OpenAI API key:
    ```
    OPENAI_API_KEY="sk-YOUR_ACTUAL_OPENAI_API_KEY"
    ```

## 3. Running the Scam Detection Pipeline

To run the full pipeline:

1.  **Add Audio Files:** Place your audio files (e.g., in `.wav`, `.mp3`, `.m4a`, or `.mp4` format) into the `audio_files/` directory.
2.  **Run the Script:** Execute the `run.py` script. You can choose the ASR engine and enable scam detection:

    ```bash
    python run.py --engine nemo --detect-scam
    ```
    *   Use `--engine nemo` to use the NeMo ASR engine (default is `faster-whisper`).
    *   Use `--detect-scam` to enable scam classification using OpenAI's LLM.

The script will:
*   Process each audio file in the `audio_files/` directory, transcribe it, and classify the text.
*   If a scam pattern is detected, the transcription will be appended to `output/scam_patterns.txt`.

# Development Conventions

*   **Configuration:** All model and audio processing parameters should be managed in `config.py`.
*   **Environment Variables:** Sensitive information, such as API keys, should be stored in a `.env` file and loaded using `python-dotenv`.
*   **Dependencies:** All Python dependencies should be listed in `requirements.txt`.
