import joblib
import os
import json
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

from .serializers import (
    PredictionSerializer, SignInSerializer, SignUpSerializer,
    UserProfileSerializer, PredictionHistorySerializer
)
from .models import UserModel, PredictionHistory
from utils.gemini_utils import generate_json


def get_tokens_for_user(user):
    """Generate JWT tokens for a user."""
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


def gemini_suggest_roles(quiz_data, ml_prediction_role):
    """Use Gemini to suggest broader career roles based on quiz answers."""
    prompt = f"""You are a career counselor for IT freshers. Based on the following student profile and quiz answers, suggest 5 diverse career roles that would be a good fit. The ML model already predicted "{ml_prediction_role}" as the top match.

Student Profile:
- Logical reasoning: {quiz_data.get('question1')}/9
- Hackathons participated: {quiz_data.get('question2')}
- Coding skills: {quiz_data.get('question3')}/9
- Public speaking: {quiz_data.get('question4')}/9
- Self-learning: {'Yes' if quiz_data.get('question5') == '1' else 'No'}
- Extra courses: {'Yes' if quiz_data.get('question6') == '1' else 'No'}
- Certification area: {quiz_data.get('question7')}
- Workshop attended: {quiz_data.get('question8')}
- Teamwork experience: {'Yes' if quiz_data.get('question18') == '1' else 'No'}
- Introvert: {'Yes' if quiz_data.get('question19') == '1' else 'No'}

Return ONLY a JSON array of objects, each with "role", "match_percentage" (0-100), and "reason" (1 sentence). Example:
[{{"role": "DevOps Engineer", "match_percentage": 85, "reason": "Strong coding and system skills align well."}}]"""

    try:
        return generate_json(prompt, temperature=0.3, max_output_tokens=1024)
    except Exception as e:
        print(f"Gemini role suggestion failed: {e}")
        return []


ROLE_MAPPING = {
    0: "Network Security Engineer",
    1: "Software Engineer",
    2: "UI/UX Engineer",
    3: "Software Developer",
    4: "Database Developer",
    5: "QA Engineer",
    6: "Web Developer",
    7: "CRM Technical Developer",
    8: "Technical Supporter",
    9: "Systems Security Administrator",
    10: "Applications Developer",
    11: "Mobile Applications Developer",
}


class PredictionView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = PredictionSerializer(data=request.data)
        if serializer.is_valid():
            try:
                model_path = os.path.join(os.path.dirname(__file__), '../ml_models/dtmodel.pkl')
                if not os.path.exists(model_path):
                    return Response({'error': 'Prediction model not found'},
                                    status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                try:
                    model = joblib.load(model_path)
                except (ValueError, TypeError):
                    import pickle
                    with open(model_path, 'rb') as f:
                        model = pickle.load(f)

                data = [serializer.validated_data[f'question{i}'] for i in range(1, 20)]

                encoding_q7 = {
                    'R Programming': 0, 'Information Security': 1, 'Shell Programming': 2,
                    'Machine Learning': 3, 'Full Stack': 4, 'Hadoop': 5,
                    'Python': 6, 'Distro Making': 7, 'App Development': 8
                }
                encoding_q8 = {
                    'Database Security': 0, 'System Designing': 1, 'Web Technologies': 2,
                    'Machine Learning': 3, 'Hacking': 4, 'Testing': 5,
                    'Data Science': 6, 'Game Development': 7, 'Cloud Computing': 8
                }

                encoded_data = [
                    int(data[0]), int(data[1]), int(data[2]), int(data[3]),
                    int(data[4]), int(data[5]),
                    encoding_q7.get(data[6], 0), encoding_q8.get(data[7], 0),
                    int(data[8]), int(data[9]), int(data[10]), int(data[11]),
                    int(data[12]), int(data[13]), int(data[14]), int(data[15]),
                    int(data[16]), int(data[17]), int(data[18]),
                ]

                prediction = model.predict([encoded_data])
                prediction_probability = model.predict_proba([encoded_data])
                predicted_class = int(prediction[0])
                predicted_proba = float(prediction_probability[0][predicted_class])
                predicted_role = ROLE_MAPPING.get(predicted_class, "Unknown Role")

                # Get Gemini-suggested broader roles
                ai_roles = gemini_suggest_roles(request.data, predicted_role)

                # Save to history if user is authenticated
                if request.user and request.user.is_authenticated:
                    PredictionHistory.objects.create(
                        user=request.user,
                        quiz_answers=request.data,
                        predicted_role=predicted_role,
                        prediction_class=predicted_class,
                        probability=predicted_proba,
                        ai_suggested_roles=ai_roles,
                    )

                return Response({
                    'prediction': predicted_class,
                    'predicted_role': predicted_role,
                    'probability': predicted_proba,
                    'ai_suggested_roles': ai_roles,
                }, status=status.HTTP_200_OK)

            except KeyError as e:
                return Response({'error': f'Invalid option selected: {str(e)}'},
                                status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({'error': f'Prediction failed: {str(e)}'},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SignUpView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = SignUpSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
                tokens = get_tokens_for_user(user)
                return Response({
                    'success': True,
                    'tokens': tokens,
                    'user': {
                        'id': user.id,
                        'email': user.email,
                        'name': user.first_name,
                    }
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SignInView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = SignInSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            user = authenticate(request, username=email, password=password)
            if user is not None:
                tokens = get_tokens_for_user(user)
                return Response({
                    'success': True,
                    'message': 'Login successful',
                    'tokens': tokens,
                    'user': {
                        'id': user.id,
                        'email': user.email,
                        'name': user.first_name,
                    }
                }, status=status.HTTP_200_OK)
            else:
                return Response({'success': False, 'message': 'Invalid credentials'},
                                status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PredictionHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        predictions = PredictionHistory.objects.filter(user=request.user)[:20]
        serializer = PredictionHistorySerializer(predictions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserDetailsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        if request.user and request.user.is_authenticated:
            serializer = UserProfileSerializer(request.user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'error': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)


class SentimentAnalysisView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            from utils.utility import predict_sentiment
            if "text" in request.data:
                text_input = request.data["text"]
                predicted_sentiment = predict_sentiment(text_input)
                return Response({"prediction": predicted_sentiment}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "No text provided"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)