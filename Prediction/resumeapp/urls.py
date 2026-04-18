from django.urls import path
from .views import ResumeUploadView, ResumeHistoryView

urlpatterns = [
    path('resume/upload/', ResumeUploadView.as_view(), name='resume_upload'),
    path('resume/history/', ResumeHistoryView.as_view(), name='resume_history'),
]
