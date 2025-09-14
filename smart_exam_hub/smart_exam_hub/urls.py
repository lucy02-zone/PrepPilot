"""
URL configuration for smart_exam_hub project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# smart_exam_hub/urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from planner.views import StudyPlanViewSet
from notes.views import NoteViewSet
from quizzes.views import QuestionViewSet, QuizAttemptViewSet
from stress_tools.views import PomodoroSessionViewSet
from forum.views import ForumQuestionViewSet, ForumReplyViewSet

router = DefaultRouter()
router.register('study-plans', StudyPlanViewSet)
router.register('notes', NoteViewSet)
router.register('questions', QuestionViewSet)
router.register('quiz-attempts', QuizAttemptViewSet)
router.register('pomodoro-sessions', PomodoroSessionViewSet)
router.register('forum-questions', ForumQuestionViewSet)
router.register('forum-replies', ForumReplyViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
