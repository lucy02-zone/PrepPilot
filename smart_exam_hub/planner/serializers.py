# planner/serializers.py
from rest_framework import serializers
from .models import StudyPlan

class StudyPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudyPlan
        fields = '__all__'
