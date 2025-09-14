# quizzes/views.py
from rest_framework import viewsets
from .models import Question, QuizAttempt
from .serializers import QuestionSerializer, QuizAttemptSerializer

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

class QuizAttemptViewSet(viewsets.ModelViewSet):
    queryset = QuizAttempt.objects.all()
    serializer_class = QuizAttemptSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
