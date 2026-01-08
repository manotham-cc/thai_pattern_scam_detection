from abc import ABC, abstractmethod

class ASREngine(ABC):
    """
    Abstract base class for ASR engines.
    """
    @abstractmethod
    def transcribe(self, audio_path: str) -> str:
        """
        Transcribes the audio file at the given path.

        :param audio_path: Path to the audio file.
        :return: The transcribed text.
        """
        pass
