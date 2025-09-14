# forum/views.py
from rest_framework import viewsets
from .models import ForumQuestion, ForumReply
from .serializers import ForumQuestionSerializer, ForumReplySerializer

class ForumQuestionViewSet(viewsets.ModelViewSet):
    queryset = ForumQuestion.objects.all()
    serializer_class = ForumQuestionSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ForumReplyViewSet(viewsets.ModelViewSet):
    queryset = ForumReply.objects.all()
    serializer_class = ForumReplySerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
