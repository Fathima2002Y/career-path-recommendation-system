from django.urls import path
from .views import CareerGuidanceView

urlpatterns = [
    path('guidance/', CareerGuidanceView.as_view(), name='career_guidance'),
]
