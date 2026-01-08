import os
import time
import torch
import librosa
import soundfile as sf
import nemo.collections.asr as nemo_asr
from .base import ASREngine


class NemoASR(ASREngine):
    """
    ASR engine using NVIDIA NeMo.
    """

    def __init__(self, model_name="scb10x/typhoon-asr-realtime"):
        """
        Initializes the NemoASR engine.
        """
        self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
        self.model = nemo_asr.models.ASRModel.from_pretrained(
            model_name=model_name,
            map_location=self.device
        )
        self.target_sr = 16000

    def _prepare_audio(self, input_path, output_path=None):
        """
        Prepare audio file for Typhoon ASR Real-Time processing
        """
        if not os.path.exists(input_path):
            return None

        if output_path is None:
            # Create a temporary file in the output directory
            if not os.path.exists('output'):
                os.makedirs('output')
            output_path = "output/processed_audio.wav"

        try:
            # Load and resample audio
            y, sr = librosa.load(input_path, sr=None)

            if sr != self.target_sr:
                y = librosa.resample(y, orig_sr=sr, target_sr=self.target_sr)

            # Normalize audio
            y = y / max(abs(y)) if max(abs(y)) > 0 else y

            # Save processed audio
            sf.write(output_path, y, self.target_sr)
            return output_path

        except Exception as e:
            return None

    def transcribe(self, audio_path: str) -> str:
        """
        Transcribes the audio file at the given path.
        """
        processed_file = self._prepare_audio(audio_path)

        if processed_file:
            start_time = time.time()
            transcriptions = self.model.transcribe(audio=[processed_file])
            processing_time = time.time() - start_time
            os.remove(processed_file)
            if transcriptions and len(transcriptions) > 0 and hasattr(transcriptions[0], 'text'):
                return transcriptions[0].text.strip()
            elif transcriptions and len(transcriptions) > 0:
                return transcriptions[0].strip()
            else:
                return ""
        else:
            return f"❌ Could not process audio file at {audio_path}"
