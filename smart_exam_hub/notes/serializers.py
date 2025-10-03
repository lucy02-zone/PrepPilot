# notes/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Note, Tag, NoteVote

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug']

class NoteVoteSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = NoteVote
        fields = ['id', 'user', 'value', 'created_at']

class NoteSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, required=False)
    user = UserSerializer(read_only=True)
    vote_count = serializers.SerializerMethodField()
    user_vote = serializers.SerializerMethodField()
    
    class Meta:
        model = Note
        fields = [
            'id', 'user', 'title', 'subject', 'topic', 'content',
            'file', 'file_type', 'file_size', 'description', 'tags',
            'votes', 'view_count', 'is_public', 'created_at', 'updated_at',
            'vote_count', 'user_vote'
        ]
        read_only_fields = ['user', 'file_type', 'file_size', 'votes', 'view_count']

    def get_vote_count(self, obj):
        return obj.votes

    def get_user_vote(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                vote = obj.user_votes.get(user=request.user)
                return vote.value
            except NoteVote.DoesNotExist:
                return 0
        return None

    def create(self, validated_data):
        tags_data = validated_data.pop('tags', [])
        note = Note.objects.create(
            user=self.context['request'].user,
            **validated_data
        )
        
        # Handle tags
        for tag_data in tags_data:
            tag, _ = Tag.objects.get_or_create(**tag_data)
            note.tags.add(tag)
            
        return note

    def update(self, instance, validated_data):
        tags_data = validated_data.pop('tags', [])
        
        # Update note fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Handle tags
        if tags_data:
            instance.tags.clear()
            for tag_data in tags_data:
                tag, _ = Tag.objects.get_or_create(**tag_data)
                instance.tags.add(tag)
                
        return instance
