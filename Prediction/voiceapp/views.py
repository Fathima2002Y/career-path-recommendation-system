from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import os
import logging

from google import genai
from google.genai import types
from dotenv import load_dotenv

from PyPDF2 import PdfReader

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
API_KEY = os.environ.get("GOOGLE_API_KEY")

# Initialize Gemini client
client = None
if API_KEY:
    client = genai.Client(api_key=API_KEY)
else:
    print("Warning: GOOGLE_API_KEY not found in environment variables")

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

        if not client:
            return Response({
                'error': 'GOOGLE_API_KEY not configured. Please set it in the .env file.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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

    _pdf_content = None  # Cache PDF content

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
        try:
            # Get context from PDF
            context = VoiceBotFunction.get_pdf_text()
            
            # Create prompt with context
            prompt = f"""You are a helpful career guidance voice assistant. Use the following context about job roles to answer the user's question.
Keep your response concise and suitable for voice output.
            
Context:
{context[:8000]}

User Question: {user_message}

Please provide a helpful, concise answer based on the context. If the answer is not in the context, provide general career guidance."""

            # Use available models from Google GenAI - models need "models/" prefix
            models_to_try = ["models/gemini-2.5-flash", "models/gemini-2.0-flash", "models/gemini-flash-latest", "models/gemini-pro-latest"]
            
            for model_name in models_to_try:
                try:
                    response = client.models.generate_content(
                        model=model_name,
                        contents=prompt,
                        config=types.GenerateContentConfig(
                            temperature=0.3,
                            max_output_tokens=512,
                        )
                    )
                    return response.text
                except Exception as model_error:
                    error_str = str(model_error)
                    # If 404 (model not found) or quota exceeded, try next model
                    if "404" in error_str or "NOT_FOUND" in error_str or "429" in error_str or "RESOURCE_EXHAUSTED" in error_str or "quota" in error_str.lower():
                        if model_name == models_to_try[-1]:  # Last model failed
                            raise Exception(f"All models failed. Error: {error_str}")
                        continue  # Try next model
                    else:
                        # Other error, raise it
                        raise
            
            raise Exception("Failed to generate response with any available model")

        except Exception as e:
            logger.error(f"Error in get_voice_response: {e}")
            raise


class VoiceCommand(APIView):
    def get(self, request):
        VoiceBotFunction.speak("Voice Assistant is Activated")
        return Response({"message": "Voice activated"}, status=status.HTTP_200_OK)
