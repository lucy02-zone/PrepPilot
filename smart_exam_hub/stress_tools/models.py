# stress_tools/models.py
from django.db import models
from django.contrib.auth.models import User

class PomodoroSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    duration_minutes = models.IntegerField()
    completed = models.BooleanField(default=False)
    started_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}: {self.duration_minutes} min"
