# smart_exam_hub/views.py
from rest_framework import generics, status
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from rest_framework.serializers import ModelSerializer, CharField, EmailField
from rest_framework.decorators import api_view, permission_classes
from django.urls import reverse

# Serializer for registration
class RegisterSerializer(ModelSerializer):
    email = EmailField(required=True)
    password = CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ('username', 'email', 'password')
    
    def create(self, validated_data):
        # Create user with hashed password
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

# Registration API view
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "message": "User registered successfully",
            "user": {"username": user.username, "email": user.email}
        }, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request):
    return Response({
        'register': request.build_absolute_uri('/api/auth/register/'),
        'login': request.build_absolute_uri('/api/auth/login/'),
        'study_plans': request.build_absolute_uri('/api/study-plans/'),
        'notes': request.build_absolute_uri('/api/notes/'),
        'questions': request.build_absolute_uri('/api/questions/'),
        'quiz_attempts': request.build_absolute_uri('/api/quiz-attempts/'),
        'pomodoro_sessions': request.build_absolute_uri('/api/pomodoro-sessions/'),
        'forum_questions': request.build_absolute_uri('/api/forum-questions/'),
        'forum_replies': request.build_absolute_uri('/api/forum-replies/'),
    })
