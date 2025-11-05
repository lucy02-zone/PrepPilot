"""
URL configuration for smart_exam_hub project.
"""
from django.conf import settings
from django.conf.urls.static import static
# smart_exam_hub/urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from planner.views import StudyPlanViewSet
from notes.views import NoteViewSet, TagViewSet
from quizzes.views import QuestionViewSet, QuizAttemptViewSet
from stress_tools.views import PomodoroSessionViewSet
from forum.views import ForumQuestionViewSet, ForumReplyViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from auth.views import RegisterView
from . import views  # Import local views

router = DefaultRouter()
router.register('notes', NoteViewSet, basename='note')
router.register('tags', TagViewSet, basename='tag')
router.register('pomodoro-sessions', PomodoroSessionViewSet)
router.register('forum/questions', ForumQuestionViewSet)
router.register('forum/replies', ForumReplyViewSet)
router.register(r'questions', QuestionViewSet)
router.register(r'quiz-attempts', QuizAttemptViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/planner/', include('planner.urls')),
    path('api/auth/', include([
        path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
        path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
        path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
        path('register/', RegisterView.as_view(), name='register'),
        path('login/', TokenObtainPairView.as_view(), name='login'),
    ])),
    path('api/forum/', include('forum.urls')),
    path('', views.api_root, name='api-root'),  # Root API view
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
