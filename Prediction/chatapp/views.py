import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from PyPDF2 import PdfReader
from utils.gemini_utils import generate_content


class ChatbotView(APIView):

    def post(self, request):
        try:
            user_message = request.data.get('message')
            if not user_message:
                return Response({'error': 'Message not provided'}, status=status.HTTP_400_BAD_REQUEST)

            response = ChatbotResponse.get_chatbot_response(user_message)
            return Response({'response': response if isinstance(response, str) else str(response)})
        except Exception as e:
            return Response({
                'error': f'An error occurred: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ChatbotResponse:

    _pdf_content = None

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
        context = ChatbotResponse.get_pdf_text()

        prompt = f"""You are a helpful career guidance assistant. Use the following context about job roles to answer the user's question.

Context:
{context[:8000]}

User Question: {user_message}

Please provide a helpful, detailed answer based on the context. If the answer is not in the context, say so and provide general career guidance."""

        return generate_content(prompt, temperature=0.3, max_output_tokens=1024)
