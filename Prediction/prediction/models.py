from django.db import models
from django.contrib.auth.models import AbstractUser

class UserModel(AbstractUser):
    """Extended user model with career-related profile fields."""
    age = models.IntegerField(null=True, blank=True)
    phone = models.CharField(max_length=20, blank=True, default='')
    education_level = models.CharField(max_length=100, blank=True, default='')
    graduation_year = models.IntegerField(null=True, blank=True)
    skills = models.JSONField(default=list, blank=True)
    resume_file = models.FileField(upload_to='resumes/', null=True, blank=True)

    # Override username to use email as primary identifier
    email = models.EmailField(max_length=100, unique=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email


class PredictionHistory(models.Model):
    """Stores each prediction result linked to a user."""
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE, related_name='predictions')
    quiz_answers = models.JSONField(default=dict)
    predicted_role = models.CharField(max_length=200)
    prediction_class = models.IntegerField(null=True, blank=True)
    probability = models.FloatField(null=True, blank=True)
    ai_suggested_roles = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.predicted_role} ({self.created_at.strftime('%Y-%m-%d')})"


class ResumeAnalysis(models.Model):
    """Stores resume analysis results."""
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE, related_name='resume_analyses')
    resume_file = models.FileField(upload_to='resumes/')
    extracted_text = models.TextField(blank=True, default='')
    extracted_skills = models.JSONField(default=list)
    suggested_roles = models.JSONField(default=list)
    analysis_summary = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - Resume Analysis ({self.created_at.strftime('%Y-%m-%d')})"