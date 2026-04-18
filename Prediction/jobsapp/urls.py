from django.urls import path
from .views import JobSearchView

urlpatterns = [
    path('jobs/', JobSearchView.as_view(), name='job_search'),
]
