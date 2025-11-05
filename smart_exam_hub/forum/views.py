# forum/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import ForumQuestion, ForumReply
from .serializers import ForumQuestionSerializer, ForumReplySerializer

class ForumQuestionViewSet(viewsets.ModelViewSet):
    queryset = ForumQuestion.objects.all().order_by('-created_at')
    serializer_class = ForumQuestionSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def replies(self, request, pk=None):
        question = self.get_object()
        reply_data = {
            'question': question.id,
            'user': request.user.id,
            'reply_text': request.data.get('reply_text')
        }
        serializer = ForumReplySerializer(data=reply_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ForumReplyViewSet(viewsets.ModelViewSet):
    queryset = ForumReply.objects.all()
    serializer_class = ForumReplySerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def upvote(self, request, pk=None):
        reply = self.get_object()
        reply.upvotes += 1
        reply.save()
        return Response({'upvotes': reply.upvotes}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        reply = self.get_object()
        # Only allow question owner or staff to verify replies
        if request.user == reply.question.user or request.user.is_staff:
            reply.verified = True
            reply.save()
            return Response({'verified': True}, status=status.HTTP_200_OK)
        return Response(
            {'error': 'Not authorized to verify this reply'}, 
            status=status.HTTP_403_FORBIDDEN
        )
