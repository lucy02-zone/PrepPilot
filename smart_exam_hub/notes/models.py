# notes/models.py
from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(unique=True)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Note(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notes')
    title = models.CharField(max_length=200)
    subject = models.CharField(max_length=100)
    topic = models.CharField(max_length=200)
    content = models.TextField(blank=True)
    file = models.FileField(upload_to='notes/%Y/%m/%d/')
    file_type = models.CharField(max_length=50)
    file_size = models.IntegerField(default=0)  # in bytes
    description = models.TextField(blank=True)
    tags = models.ManyToManyField(Tag, related_name='notes')
    votes = models.IntegerField(default=0)
    view_count = models.IntegerField(default=0)
    is_public = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.subject} - {self.topic}) by {self.user.username}"
        
class NoteVote(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    note = models.ForeignKey(Note, on_delete=models.CASCADE, related_name='user_votes')
    value = models.SmallIntegerField()  # 1 for upvote, -1 for downvote
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'note']

    def save(self, *args, **kwargs):
        if self.value not in [-1, 1]:
            raise ValueError("Vote value must be either 1 or -1")
        super().save(*args, **kwargs)
