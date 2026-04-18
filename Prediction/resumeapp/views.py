import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser

from PyPDF2 import PdfReader

from prediction.models import ResumeAnalysis
from prediction.serializers import ResumeAnalysisSerializer
from utils.gemini_utils import generate_json


def extract_pdf_text(file):
    """Extract text from an uploaded PDF file."""
    text = ""
    try:
        reader = PdfReader(file)
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    except Exception as e:
        text = f"Error extracting text: {str(e)}"
    return text.strip()


def analyze_resume_with_gemini(resume_text):
    """Use Gemini to extract skills and suggest career roles from resume."""
    prompt = f"""You are an expert career counselor and resume analyzer. Analyze the following resume text and provide:

1. A list of technical and soft skills extracted from the resume
2. A list of 8-10 career roles that would be a good fit, with match percentage and reason
3. A brief analysis summary with strengths and areas to improve

Resume Text:
{resume_text[:6000]}

Return ONLY valid JSON in this exact format:
{{
    "skills": ["Python", "React", "Communication", ...],
    "roles": [
        {{"role": "Full Stack Developer", "match_percentage": 90, "reason": "Strong web development skills with both frontend and backend experience"}},
        ...
    ],
    "summary": "The candidate shows strong skills in... They should consider improving..."
}}"""

    try:
        return generate_json(prompt, temperature=0.3, max_output_tokens=2048)
    except Exception as e:
        return {
            "skills": [],
            "roles": [],
            "summary": f"Analysis temporarily unavailable: {str(e)}"
        }


class ResumeUploadView(APIView):
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        resume_file = request.FILES.get('resume')
        if not resume_file:
            return Response({'error': 'No resume file provided'}, status=status.HTTP_400_BAD_REQUEST)

        if not resume_file.name.lower().endswith('.pdf'):
            return Response({'error': 'Only PDF files are supported'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            extracted_text = extract_pdf_text(resume_file)
            if not extracted_text or extracted_text.startswith("Error"):
                return Response({'error': 'Could not extract text from PDF'},
                                status=status.HTTP_400_BAD_REQUEST)

            analysis = analyze_resume_with_gemini(extracted_text)

            if request.user and request.user.is_authenticated:
                resume_file.seek(0)
                ResumeAnalysis.objects.create(
                    user=request.user,
                    resume_file=resume_file,
                    extracted_text=extracted_text,
                    extracted_skills=analysis.get('skills', []),
                    suggested_roles=analysis.get('roles', []),
                    analysis_summary=analysis.get('summary', ''),
                )

            return Response({
                'skills': analysis.get('skills', []),
                'roles': analysis.get('roles', []),
                'summary': analysis.get('summary', ''),
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': f'Resume analysis failed: {str(e)}'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ResumeHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        analyses = ResumeAnalysis.objects.filter(user=request.user)[:10]
        serializer = ResumeAnalysisSerializer(analyses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
