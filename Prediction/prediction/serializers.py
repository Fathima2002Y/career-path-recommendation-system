from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import UserModel, PredictionHistory, ResumeAnalysis


class SignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    name = serializers.CharField(source='first_name', required=True)

    class Meta:
        model = UserModel
        fields = ['email', 'name', 'age', 'password']

    def create(self, validated_data):
        email = validated_data['email']
        user = UserModel.objects.create_user(
            username=email,  # Use email as username
            email=email,
            first_name=validated_data.get('first_name', ''),
            password=validated_data['password'],
            age=validated_data.get('age'),
        )
        return user


class SignInSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class UserProfileSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='first_name')

    class Meta:
        model = UserModel
        fields = ['id', 'email', 'name', 'age', 'phone', 'education_level',
                  'graduation_year', 'skills', 'date_joined']
        read_only_fields = ['id', 'email', 'date_joined']


class PredictionSerializer(serializers.Serializer):
    question1 = serializers.CharField(max_length=100)
    question2 = serializers.CharField(max_length=100)
    question3 = serializers.CharField(max_length=100)
    question4 = serializers.CharField(max_length=100)
    question5 = serializers.CharField(max_length=100)
    question6 = serializers.CharField(max_length=100)
    question7 = serializers.CharField(max_length=100)
    question8 = serializers.CharField(max_length=100)
    question9 = serializers.CharField(max_length=100)
    question10 = serializers.CharField(max_length=100)
    question11 = serializers.CharField(max_length=100)
    question12 = serializers.CharField(max_length=100)
    question13 = serializers.CharField(max_length=100)
    question14 = serializers.CharField(max_length=100)
    question15 = serializers.CharField(max_length=100)
    question16 = serializers.CharField(max_length=100)
    question17 = serializers.CharField(max_length=100)
    question18 = serializers.CharField(max_length=100)
    question19 = serializers.CharField(max_length=100)


class PredictionHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PredictionHistory
        fields = ['id', 'quiz_answers', 'predicted_role', 'prediction_class',
                  'probability', 'ai_suggested_roles', 'created_at']
        read_only_fields = ['id', 'created_at']


class ResumeAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeAnalysis
        fields = ['id', 'resume_file', 'extracted_skills', 'suggested_roles',
                  'analysis_summary', 'created_at']
        read_only_fields = ['id', 'extracted_skills', 'suggested_roles',
                            'analysis_summary', 'created_at']