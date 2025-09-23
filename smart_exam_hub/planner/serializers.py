from rest_framework import serializers
from .models import StudyPlan

class StudyPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudyPlan
        fields = '__all__'
        read_only_fields = ['id', 'user', 'created_at']
