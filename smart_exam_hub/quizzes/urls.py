from django.urls import path, include
from rest_framework.routers import DefaultRouter
from quizzes.views import QuestionViewSet, QuizAttemptViewSet

router = DefaultRouter()
router.register(r'questions', QuestionViewSet)
router.register(r'quiz-attempts', QuizAttemptViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
