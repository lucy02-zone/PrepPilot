from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StudyPlanViewSet, UserFileViewSet
from quizzes.views import QuizViewSet

router = DefaultRouter()
router.register(r'study-plans', StudyPlanViewSet, basename='studyplan')
router.register(r'user-files', UserFileViewSet, basename='userfile')
router.register(r'quizzes', QuizViewSet, basename='quiz')

urlpatterns = [
    path('', include(router.urls)),
]
