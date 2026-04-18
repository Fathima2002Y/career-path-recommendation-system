from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    PredictionView, SentimentAnalysisView, SignUpView, SignInView,
    UserProfileView, UserDetailsView, PredictionHistoryView
)

urlpatterns = [
    path('auth/signup/', SignUpView.as_view(), name='signup'),
    path('auth/signin/', SignInView.as_view(), name='signin'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('get/quiz/', PredictionView.as_view(), name='predict'),
    path('get/sentiment/', SentimentAnalysisView.as_view(), name='get_sentiment'),
    path('get/user/', UserDetailsView.as_view(), name='user'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('predictions/history/', PredictionHistoryView.as_view(), name='prediction_history'),
]
