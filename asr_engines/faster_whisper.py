import os
from faster_whisper import WhisperModel
import config
from .base import ASREngine


class FasterWhisperASR(ASREngine):
    """
    ASR engine using faster-whisper.
    """

    def __init__(self, model_size=None, device="auto", compute_type="default"):
        """
        Initializes the FasterWhisperASR engine.
        """
        model_size = model_size or config.FASTER_WHISPER_MODEL_CONFIG["model_size"]
        self.model = WhisperModel(model_size, device=device, compute_type=compute_type)

    def transcribe(self, audio_path: str) -> str:
        """
        Transcribes the audio file at the given path.
        """
        if not os.path.exists(audio_path):
            return f"Error: Audio file not found at {audio_path}"

        segments, _ = self.model.transcribe(audio_path, beam_size=5)
        transcription = " ".join([segment.text for segment in segments])
        return transcription.strip()
