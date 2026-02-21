from django.shortcuts import render
import os

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from google import genai
from google.genai import types
from dotenv import load_dotenv

from PyPDF2 import PdfReader

# Load environment variables
load_dotenv()
API_KEY = os.environ.get("GOOGLE_API_KEY")

# Initialize Gemini client
client = None
if API_KEY:
    client = genai.Client(api_key=API_KEY)
else:
    print("Warning: GOOGLE_API_KEY not found in environment variables")


class ChatbotView(APIView):

    def post(self, request):
        try:
            user_message = request.data.get('message')
            if not user_message:
                return Response({'error': 'Message not provided'}, status=status.HTTP_400_BAD_REQUEST)

            if not client:
                return Response({
                    'error': 'GOOGLE_API_KEY not configured. Please set it in the .env file.'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            response = ChatbotResponse.get_chatbot_response(user_message)
            
            return Response({
                'response': response if isinstance(response, str) else str(response)
            })
        except Exception as e:
            return Response({
                'error': f'An error occurred: {str(e)}. Please check your GOOGLE_API_KEY is set in the backend .env file.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

class ChatbotResponse:

    _pdf_content = None  # Cache PDF content
     
    @staticmethod
    def get_pdf_text():
        if ChatbotResponse._pdf_content:
            return ChatbotResponse._pdf_content
            
        file_path = os.path.join(os.path.dirname(__file__), "../datasets/docs/Job_Roles.pdf")
        text = ""
        try:
            with open(file_path, 'rb') as pdf_docs:
                pdf_reader = PdfReader(pdf_docs)
                for page in pdf_reader.pages:
                    text += page.extract_text()
            ChatbotResponse._pdf_content = text
        except Exception as e:
            print(f"Error reading PDF: {e}")
            text = "Career guidance information not available."
        return text

    @staticmethod
    def get_chatbot_response(user_message):
        try:
            # Get context from PDF
            context = ChatbotResponse.get_pdf_text()

            # Create prompt with context
            prompt = f"""You are a helpful career guidance assistant. Use the following context about job roles to answer the user's question.
            
Context:
{context[:8000]}

User Question: {user_message}

Please provide a helpful, detailed answer based on the context. If the answer is not in the context, say so and provide general career guidance."""

            # Use available models from Google GenAI - models need "models/" prefix
            models_to_try = ["models/gemini-2.5-flash", "models/gemini-2.0-flash", "models/gemini-flash-latest", "models/gemini-pro-latest"]
            
            for model_name in models_to_try:
                try:
                    response = client.models.generate_content(
                        model=model_name,
                        contents=prompt,
                        config=types.GenerateContentConfig(
                            temperature=0.3,
                            max_output_tokens=1024,
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
            print(f"Error in get_chatbot_response: {e}")
            raise
