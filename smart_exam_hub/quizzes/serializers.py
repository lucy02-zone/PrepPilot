from rest_framework import serializers
from .models import (
    Quiz, Question, QuizAttempt, MCQOption, DragDropItem,
    FillInBlanksItem, PredictOutputItem, MCQAnswer, DragDropAnswer,
    FillInBlanksAnswer, PredictOutputAnswer
)

class MCQOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MCQOption
        fields = ['id', 'text', 'is_correct', 'order']

class DragDropItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = DragDropItem
        fields = ['id', 'draggable_text', 'correct_position']

class FillInBlanksItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FillInBlanksItem
        fields = ['id', 'blank_text', 'correct_answer', 'blank_position']

class PredictOutputItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PredictOutputItem
        fields = ['id', 'code_snippet', 'correct_output', 'language']

class QuestionSerializer(serializers.ModelSerializer):
    mcq_options = MCQOptionSerializer(many=True, read_only=True)
    drag_drop_items = DragDropItemSerializer(many=True, read_only=True)
    fill_in_blanks_items = FillInBlanksItemSerializer(many=True, read_only=True)
    predict_output_items = PredictOutputItemSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'question_type', 'text', 'points', 'order',
                 'mcq_options', 'drag_drop_items', 'fill_in_blanks_items', 'predict_output_items']

class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'quiz_type', 'created_at',
                 'updated_at', 'created_by', 'is_active', 'questions']

class QuizAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizAttempt
        fields = '__all__'

class MCQAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = MCQAnswer
        fields = '__all__'

class DragDropAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = DragDropAnswer
        fields = '__all__'

class FillInBlanksAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = FillInBlanksAnswer
        fields = '__all__'

class PredictOutputAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = PredictOutputAnswer
        fields = '__all__'
