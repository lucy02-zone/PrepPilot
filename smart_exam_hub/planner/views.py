# planner/views.py
from rest_framework import viewsets
from .models import StudyPlan
from .serializers import StudyPlanSerializer

class StudyPlanViewSet(viewsets.ModelViewSet):
    queryset = StudyPlan.objects.all()
    serializer_class = StudyPlanSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
