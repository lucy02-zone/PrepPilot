# forum/models.py
from django.db import models
from django.contrib.auth.models import User

class ForumQuestion(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    subject = models.CharField(max_length=100)
    topic = models.CharField(max_length=200)
    question_text = models.TextField()
    urgent = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.subject} - {self.topic}"

class ForumReply(models.Model):
    question = models.ForeignKey(ForumQuestion, related_name='replies', on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    reply_text = models.TextField()
    upvotes = models.IntegerField(default=0)
    verified = models.BooleanField(default=False)
    replied_at = models.DateTimeField(auto_now_add=True)
