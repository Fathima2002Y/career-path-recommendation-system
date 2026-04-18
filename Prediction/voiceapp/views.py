import os
import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from PyPDF2 import PdfReader
from utils.gemini_utils import generate_content

logger = logging.getLogger(__name__)

# Lazy-load TTS Engine to avoid blocking server startup
_engine = None

def get_tts_engine():
    global _engine
    if _engine is None:
        import pyttsx3
        _engine = pyttsx3.init()
        voices = _engine.getProperty('voices')
        _engine.setProperty('voice', voices[0].id)
    return _engine


class VoiceBotView(APIView):

    def post(self, request):
        user_message = request.data.get('query')

        if not user_message:
            return Response({'error': 'Query not provided'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            response_text = VoiceBotFunction.get_voice_response(user_message)
            logger.info(response_text)
            return Response({'query': user_message, 'response': response_text})
        except Exception as e:
            logger.error(f"Exception occurred: {e}")
            return Response({
                'error': f'Internal server error: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class VoiceBotFunction:

    _pdf_content = None

    @staticmethod
    def speak(text, rate=120):
        try:
            engine = get_tts_engine()
            engine.setProperty('rate', rate)
            engine.say(text)
            if not engine._inLoop:
                engine.runAndWait()
        except Exception as e:
            logger.error(f"Error in text-to-speech: {e}")

    @staticmethod
    def get_pdf_text():
        if VoiceBotFunction._pdf_content:
            return VoiceBotFunction._pdf_content

        file_path = os.path.join(os.path.dirname(__file__), "../datasets/docs/Job_Roles.pdf")
        text = ""
        try:
            with open(file_path, 'rb') as pdf_docs:
                pdf_reader = PdfReader(pdf_docs)
                for page in pdf_reader.pages:
                    text += page.extract_text()
            VoiceBotFunction._pdf_content = text
        except Exception as e:
            logger.error(f"Error reading PDF: {e}")
            text = "Career guidance information not available."
        return text

    @staticmethod
    def get_voice_response(user_message):
        context = VoiceBotFunction.get_pdf_text()

        prompt = f"""You are a helpful career guidance voice assistant. Use the following context about job roles to answer the user's question.
Keep your response concise and suitable for voice output.

Context:
{context[:8000]}

User Question: {user_message}

Please provide a helpful, concise answer based on the context. If the answer is not in the context, provide general career guidance."""

        return generate_content(prompt, temperature=0.3, max_output_tokens=512)


class VoiceCommand(APIView):
    def get(self, request):
        VoiceBotFunction.speak("Voice Assistant is Activated")
        return Response({"message": "Voice activated"}, status=status.HTTP_200_OK)
