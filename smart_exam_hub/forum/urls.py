from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ForumQuestionViewSet, ForumReplyViewSet

router = DefaultRouter()
router.register('questions', ForumQuestionViewSet)
router.register('replies', ForumReplyViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
