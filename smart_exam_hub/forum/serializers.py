# forum/serializers.py
from rest_framework import serializers
from .models import ForumQuestion, ForumReply

class ForumReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = ForumReply
        fields = '__all__'

class ForumQuestionSerializer(serializers.ModelSerializer):
    replies = ForumReplySerializer(many=True, read_only=True)

    class Meta:
        model = ForumQuestion
        fields = ['id', 'subject', 'topic', 'question_text', 'urgent', 'created_at', 'replies']
        read_only_fields = ['user']
