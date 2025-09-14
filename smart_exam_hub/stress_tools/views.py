# stress_tools/views.py
from rest_framework import viewsets
from .models import PomodoroSession
from .serializers import PomodoroSessionSerializer

class PomodoroSessionViewSet(viewsets.ModelViewSet):
    queryset = PomodoroSession.objects.all()
    serializer_class = PomodoroSessionSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
