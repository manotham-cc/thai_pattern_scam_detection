import os
import json
from dotenv import load_dotenv

load_dotenv()

class ScamDetector:
    """
    A class to detect scam patterns in text using an LLM.
    Returns both classification and reasoning.
    """
    def __init__(self):
        from openai import OpenAI
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    def classify_text(self, text: str) -> dict:
        """
        Classifies a text as a scam or not and provides a reason.

        Returns:
            dict: A dictionary containing:
                - 'is_scam': bool
                - 'reason': str (The explanation)
        """
        try:
            response = self.client.chat.completions.create(
                model="gpt-5-mini-2025-08-07",
                # บังคับให้ตอบเป็น JSON (ฟีเจอร์นี้มีใน model ใหม่ๆ ช่วยให้แกะค่าง่าย)
                response_format={"type": "json_object"}, 
                messages=[
                    {
                        "role": "system", 
                        "content": (
                            "You are an expert scam detection system. Analyze the provided text for scam patterns. "
                            "Return your analysis in a valid JSON object with exactly two keys: "
                            "'is_scam' (boolean: true if scam, false otherwise) and "
                            "'reason' (string: a short explanation in Thai or English of why it is or isn't a scam)."
                        )
                    },
                    {"role": "user", "content": text},
                ]
            )

            # Check content
            content = response.choices[0].message.content
            if content:
                # แปลง String JSON เป็น Python Dictionary
                result = json.loads(content)
                return result 
            else:
                return {"is_scam": False, "reason": "No response from AI"}

        except Exception as e:
            print(f"Error in ScamDetector: {e}")
            return {"is_scam": False, "reason": f"Error: {str(e)}"}

if __name__ == '__main__':
    detector = ScamDetector()
    
    scam_text = "This is an urgent message. You have won a lottery! To claim your prize, please verify your account details immediately."
    result = detector.classify_text(scam_text)
    print(f"Result: {result}")