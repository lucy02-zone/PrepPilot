from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import StudyPlan, UserFile
from .serializers import StudyPlanSerializer, UserFileSerializer
from django.core.files.storage import default_storage
import os

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

    @action(detail=True, methods=['post'])
    def attach_file(self, request, pk=None):
        study_plan = self.get_object()
        file_obj = request.FILES.get('file')
        
        if not file_obj:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create user file
        user_file = UserFile.objects.create(
            user=request.user,
            study_plan=study_plan,
            file=file_obj,
            filename=file_obj.name,
            file_type=file_obj.content_type
        )
        
        serializer = UserFileSerializer(user_file)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class UserFileViewSet(viewsets.ModelViewSet):
    serializer_class = UserFileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserFile.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        # Delete the actual file
        if instance.file:
            if os.path.isfile(instance.file.path):
                os.remove(instance.file.path)
        return super().destroy(request, *args, **kwargs)
