from django.db import models
from django.contrib.auth.models import User

STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('done', 'Done'),
    ('revise', 'Revise'),
]

class StudyPlan(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    subject = models.CharField(max_length=100)
    topic = models.CharField(max_length=200)
    exam_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.subject} - {self.topic}"
