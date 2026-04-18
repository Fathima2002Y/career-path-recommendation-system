from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from utils.gemini_utils import generate_json


class JobSearchView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        role = request.data.get('role', '')
        job_type = request.data.get('type', 'all')
        location = request.data.get('location', 'Remote / Worldwide')

        if not role:
            return Response({'error': 'Role is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            jobs = self.search_jobs(role, job_type, location)
            return Response({'jobs': jobs, 'query': {'role': role, 'type': job_type, 'location': location}},
                            status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': f'Job search failed: {str(e)}'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @staticmethod
    def search_jobs(role, job_type, location):
        type_filter = ""
        if job_type == "internship":
            type_filter = "Focus ONLY on internship opportunities suitable for freshers/students."
        elif job_type == "job":
            type_filter = "Focus on entry-level/junior full-time job positions suitable for freshers."
        else:
            type_filter = "Include both internships and entry-level job positions."

        prompt = f"""You are a job search assistant. Generate realistic and current job/internship listings for a fresher looking for "{role}" positions in {location}.

{type_filter}

Return ONLY valid JSON — an array of 8-10 job listings:
[
    {{
        "title": "Junior Software Developer",
        "company": "Google",
        "location": "Bangalore, India (Hybrid)",
        "type": "Full-time",
        "experience": "0-1 years",
        "salary": "₹6-10 LPA",
        "description": "We are looking for a motivated junior developer to join our team...",
        "skills_required": ["Python", "JavaScript", "Git"],
        "posted_date": "2 days ago",
        "apply_url": "https://careers.google.com",
        "source": "Company Website"
    }},
    ...
]

Make the listings realistic with real companies that typically hire for this role. Include a mix of top tech companies and startups. Use current/recent dates. Include salary ranges appropriate for entry-level in the specified region."""

        return generate_json(prompt, temperature=0.7, max_output_tokens=3000)
