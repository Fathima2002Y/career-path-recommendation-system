from django.urls import path, include
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['GET'])
def root_view(request):
    """Root endpoint to test if backend is running"""
    return Response({
        'status': 'success',
        'message': 'Career Path Recommendation System API is running',
        'endpoints': {
            'auth': '/api/auth/signup/, /api/auth/signin/',
            'quiz': '/api/get/quiz/ (POST)',
            'prediction': '/api/get/quiz/ (POST)',
            'sentiment': '/api/get/sentiment/ (POST)',
            'user': '/api/get/user/ (GET)',
            'chat': '/api/chat/ (POST)',
            'voice': '/api/voice/ (POST), /api/bot/cmd/ (GET)'
        }
    }, status=status.HTTP_200_OK)

urlpatterns = [
    path('', root_view, name='root'),
    path('api/', include('prediction.urls')),   
    path('api/', include('chatapp.urls')),
    path('api/', include('voiceapp.urls')),
]
