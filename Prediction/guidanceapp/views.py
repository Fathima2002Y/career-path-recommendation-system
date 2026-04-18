from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from utils.gemini_utils import generate_json


class CareerGuidanceView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        role = request.data.get('role', '')
        if not role:
            return Response({'error': 'Role is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            guidance = self.generate_guidance(role)
            return Response(guidance, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': f'Failed to generate guidance: {str(e)}'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @staticmethod
    def generate_guidance(role):
        prompt = f"""You are an expert career counselor. A fresher (recent graduate or student) wants to pursue a career as a "{role}". Provide a comprehensive career roadmap.

Return ONLY valid JSON in this exact format:
{{
    "role": "{role}",
    "overview": "Brief description of what this role involves (2-3 sentences)",
    "skills_required": [
        {{"skill": "Python", "level": "Intermediate", "priority": "Must Have"}},
        ...
    ],
    "roadmap": [
        {{
            "phase": "Month 1-2: Foundation",
            "tasks": ["Learn Python basics", "Understand data structures", ...],
            "resources": ["freeCodeCamp", "Coursera Python course", ...]
        }},
        ...
    ],
    "certifications": [
        {{"name": "AWS Certified Cloud Practitioner", "provider": "Amazon", "difficulty": "Beginner"}},
        ...
    ],
    "interview_tips": [
        "Practice coding problems on LeetCode",
        "Build 2-3 portfolio projects",
        ...
    ],
    "salary_range": {{
        "entry_level": "$50,000 - $70,000",
        "mid_level": "$70,000 - $100,000",
        "senior_level": "$100,000 - $150,000"
    }},
    "growth_prospects": "Description of career growth and future opportunities"
}}

Provide at least 4 roadmap phases covering 6-12 months. Include at least 6 skills, 3 certifications, and 5 interview tips."""

        return generate_json(prompt, temperature=0.3, max_output_tokens=3000)
