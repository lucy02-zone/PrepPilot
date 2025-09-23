from rest_framework import viewsets, permissions
from .models import StudyPlan
from .serializers import StudyPlanSerializer

class StudyPlanViewSet(viewsets.ModelViewSet):
    queryset = StudyPlan.objects.all()
    serializer_class = StudyPlanSerializer
    permission_classes = [permissions.IsAuthenticated]
    

    def get_queryset(self):
        # Only return plans for logged-in user
        return StudyPlan.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Assign logged-in user automatically
        serializer.save(user=self.request.user)
