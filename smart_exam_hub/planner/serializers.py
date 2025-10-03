from rest_framework import serializers
from .models import StudyPlan, UserFile

class UserFileSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = UserFile
        fields = ['id', 'filename', 'file_type', 'description', 'uploaded_at', 'file', 'file_url', 'study_plan']
        read_only_fields = ['uploaded_at', 'file_url']

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None

class StudyPlanSerializer(serializers.ModelSerializer):
    files = UserFileSerializer(many=True, read_only=True)
    
    class Meta:
        model = StudyPlan
        fields = ['id', 'subject', 'topic', 'exam_date', 'status', 'created_at', 'notes', 'priority', 'files']
        read_only_fields = ['id', 'user', 'created_at']
