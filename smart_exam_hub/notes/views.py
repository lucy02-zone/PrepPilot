# notes/views.py
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import F
from django_filters.rest_framework import DjangoFilterBackend
from .models import Note, Tag, NoteVote
from .serializers import NoteSerializer, TagSerializer, NoteVoteSerializer

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['subject', 'topic', 'tags', 'is_public']
    search_fields = ['title', 'content', 'description']
    ordering_fields = ['created_at', 'updated_at', 'votes', 'view_count']
    ordering = ['-created_at']
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Note.objects.filter(
                is_public=True) | Note.objects.filter(user=self.request.user
            )
        return Note.objects.filter(is_public=True)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if request.user != instance.user:  # Only increment view count for non-owners
            instance.view_count = F('view_count') + 1
            instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def vote(self, request, pk=None):
        note = self.get_object()
        if note.user == request.user:
            return Response(
                {"detail": "You cannot vote on your own note"},
                status=status.HTTP_400_BAD_REQUEST
            )

        value = request.data.get('value', 0)
        if value not in [-1, 1]:
            return Response(
                {"detail": "Invalid vote value"},
                status=status.HTTP_400_BAD_REQUEST
            )

        vote, created = NoteVote.objects.get_or_create(
            user=request.user,
            note=note,
            defaults={'value': value}
        )

        if not created:
            if vote.value == value:
                # Remove the vote if clicking the same button
                vote.delete()
                note.votes = F('votes') - value
            else:
                # Change vote if clicking the opposite button
                old_value = vote.value
                vote.value = value
                vote.save()
                note.votes = F('votes') - old_value + value
        else:
            note.votes = F('votes') + value

        note.save()
        note.refresh_from_db()
        
        return Response({
            'votes': note.votes,
            'user_vote': value if created or vote.value == value else 0
        })

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
