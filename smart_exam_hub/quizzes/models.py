# quizzes/models.py
from django.db import models
from django.contrib.auth.models import User

class Question(models.Model):
    subject = models.CharField(max_length=100)
    topic = models.CharField(max_length=200)
    question_text = models.TextField()
    option_a = models.CharField(max_length=200)
    option_b = models.CharField(max_length=200)
    option_c = models.CharField(max_length=200)
    option_d = models.CharField(max_length=200)
    correct_option = models.CharField(max_length=1)  # 'a', 'b', 'c', or 'd'

    def __str__(self):
        return f"{self.subject} - {self.topic}"

class QuizAttempt(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    questions = models.ManyToManyField(Question)
    score = models.IntegerField()
    attempted_at = models.DateTimeField(auto_now_add=True)
