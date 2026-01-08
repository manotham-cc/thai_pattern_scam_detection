import os
import argparse
from asr_engines import FasterWhisperASR, NemoASR
from scam_detector import ScamDetector

AUDIO_DIR = "audio_files"
OUTPUT_DIR = "output"

def main():
    """
    Main function to run the ASR and scam detection pipeline.
    """
    parser = argparse.ArgumentParser(description="Run ASR and scam detection on audio files in the 'audio_files/' directory.")
    parser.add_argument(
        "--engine",
        choices=["faster-whisper", "nemo"],
        default="faster-whisper",
        help="The ASR engine to use.",
    )
    parser.add_argument(
        "--detect-scam",
        action="store_true",
        help="Enable scam detection on the transcribed text.",
    )
    args = parser.parse_args()

    # Ensure output directory exists
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    # Now, get the list of files to process
    audio_files_to_process = [os.path.join(AUDIO_DIR, f) for f in os.listdir(AUDIO_DIR) if f.endswith(('.wav', '.mp3', '.m4a', '.mp4'))]

    if not audio_files_to_process:
        return

    # --- 1. Initialize ASR Engine ---
    if args.engine == "faster-whisper":
        asr_engine = FasterWhisperASR()
    elif args.engine == "nemo":
        asr_engine = NemoASR()
    else:
        return

    # --- 2. Process Audio Files ---
    scam_patterns_output_path = os.path.join(OUTPUT_DIR, "scam_patterns.txt")
    
    # Clear previous scam patterns
    if os.path.exists(scam_patterns_output_path):
        os.remove(scam_patterns_output_path)

    for audio_file_path in audio_files_to_process:
        transcription = asr_engine.transcribe(audio_file_path)

# --- 2.2 Run Scam Detector ---
        if args.detect_scam:
            scam_detector = ScamDetector()
            
            # รับค่าเป็น Dictionary แทน Boolean
            detection_result = scam_detector.classify_text(transcription) 
            
            is_scam = detection_result.get("is_scam", False)
            reason = detection_result.get("reason", "No reason provided")

            if is_scam:
                # แจ้งเตือนพร้อมเหตุผล
                print('\a') 
                RED = "\033[91m"
                RESET = "\033[0m"
                YELLOW = "\033[93m"
                
                print(f"\n{RED}" + "="*60)
                print(f"🚨🚨 ALARM: SCAM DETECTED! 🚨🚨")
                print(f"File: {os.path.basename(audio_file_path)}")
                print(f"Reason: {YELLOW}{reason}{RED}")  # <--- ปริ้นเหตุผลตรงนี้
                print("="*60 + f"{RESET}\n")

                # บันทึกลงไฟล์
                if not os.path.exists(OUTPUT_DIR):
                    os.makedirs(OUTPUT_DIR)
                with open(scam_patterns_output_path, "a", encoding="utf-8") as f:
                    f.write(f"--- Scam Transcription from {os.path.basename(audio_file_path)} ---\n")
                    f.write(f"Reason: {reason}\n") # <--- บันทึกเหตุผลลงไฟล์ด้วย
                    f.write(f"Text: {transcription}\n")
                    f.write("\n-------------------------------------------------\n\n")

if __name__ == "__main__":
    main()
