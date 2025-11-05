from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Quiz(models.Model):
    QUIZ_TYPES = [
        ('MCQ', 'Multiple Choice')
    ]

    LANGUAGE_CHOICES = [
        ('python', 'Python'),
        ('c', 'C'),
        ('java', 'Java'),
        ('javascript', 'JavaScript'),
        ('cpp', 'C++'),
        ('other', 'Other')
    ]

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    quiz_type = models.CharField(max_length=10, choices=QUIZ_TYPES, default='MCQ')
    language = models.CharField(max_length=20, choices=LANGUAGE_CHOICES, default='python')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_quizzes')
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name_plural = "Quizzes"

class Question(models.Model):
    QUESTION_TYPES = [
        ('MCQ', 'Multiple Choice')
    ]

    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPES, default='MCQ')
    text = models.CharField(max_length=255)
    points = models.IntegerField(default=1)
    order = models.IntegerField(default=0)

    def __str__(self):
        return self.text

class MCQOption(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='mcq_options')
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)
    order = models.IntegerField(default=0)

    def __str__(self):
        return self.text

class DragDropItem(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='drag_drop_items')
    draggable_text = models.CharField(max_length=255)
    correct_position = models.IntegerField()
    
    def __str__(self):
        return f"{self.draggable_text} (Position: {self.correct_position})"


class QuizAttempt(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='attempts')
    score = models.IntegerField(default=0)
    total_points = models.IntegerField(default=0)
    started_at = models.DateTimeField(default=timezone.now)
    completed_at = models.DateTimeField(null=True, blank=True)
    is_completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.quiz.title} - {self.score}/{self.total_points}"

    def complete_attempt(self):
        self.is_completed = True
        self.completed_at = timezone.now()
        self.save()

class MCQAnswer(models.Model):
    attempt = models.ForeignKey(QuizAttempt, related_name="mcq_answers", on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_option = models.ForeignKey(MCQOption, on_delete=models.CASCADE)
    is_correct = models.BooleanField(default=False)
    points_earned = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.question.text} - {self.selected_option.text}"

class DragDropAnswer(models.Model):
    attempt = models.ForeignKey(QuizAttempt, related_name="drag_drop_answers", on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    drag_drop_item = models.ForeignKey(DragDropItem, on_delete=models.CASCADE)
    placed_position = models.IntegerField()
    is_correct = models.BooleanField(default=False)
    points_earned = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.question.text} - {self.drag_drop_item.draggable_text} at position {self.placed_position}"

class FillInBlanksItem(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='fill_in_blanks_items')
    blank_text = models.CharField(max_length=255)  # The text with blanks like "The ___ is blue"
    correct_answer = models.CharField(max_length=255)  # The correct fill for the blank
    blank_position = models.IntegerField()  # Position of the blank in the text

    def __str__(self):
        return f"Blank {self.blank_position}: {self.correct_answer}"

class PredictOutputItem(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='predict_output_items')
    code_snippet = models.TextField()  # The code to predict output for
    correct_output = models.TextField()  # The expected output
    language = models.CharField(max_length=50, default='python')  # Programming language

    def __str__(self):
        return f"Code prediction for {self.language}"

class FillInBlanksAnswer(models.Model):
    attempt = models.ForeignKey(QuizAttempt, related_name="fill_in_blanks_answers", on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    fill_in_blanks_item = models.ForeignKey(FillInBlanksItem, on_delete=models.CASCADE)
    user_answer = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)
    points_earned = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.question.text} - {self.user_answer}"

class PredictOutputAnswer(models.Model):
    attempt = models.ForeignKey(QuizAttempt, related_name="predict_output_answers", on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    predict_output_item = models.ForeignKey(PredictOutputItem, on_delete=models.CASCADE)
    user_output = models.TextField()
    is_correct = models.BooleanField(default=False)
    points_earned = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.question.text} - Predicted output"
