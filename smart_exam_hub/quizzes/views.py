from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import (
    Quiz, Question, QuizAttempt, MCQAnswer, DragDropAnswer,
    FillInBlanksAnswer, PredictOutputAnswer
)
from .serializers import (
    QuizSerializer, QuestionSerializer, QuizAttemptSerializer,
    MCQAnswerSerializer, DragDropAnswerSerializer,
    FillInBlanksAnswerSerializer, PredictOutputAnswerSerializer
)

class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Quiz.objects.filter(is_active=True)

    @action(detail=True, methods=['post'])
    def start_attempt(self, request, pk=None):
        quiz = self.get_object()
        # Check if user already has an incomplete attempt
        existing_attempt = QuizAttempt.objects.filter(
            user=request.user,
            quiz=quiz,
            is_completed=False
        ).first()

        if existing_attempt:
            serializer = QuizAttemptSerializer(existing_attempt)
            return Response(serializer.data)

        # Create new attempt
        attempt = QuizAttempt.objects.create(
            user=request.user,
            quiz=quiz,
            total_points=sum(q.points for q in quiz.questions.all())
        )
        serializer = QuizAttemptSerializer(attempt)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def submit_mcq_answer(self, request, pk=None):
        attempt_id = request.data.get('attempt')
        question_id = request.data.get('question')
        option_id = request.data.get('selected_option')

        attempt = get_object_or_404(QuizAttempt, id=attempt_id, user=request.user)
        question = get_object_or_404(Question, id=question_id, quiz=attempt.quiz)
        option = get_object_or_404(question.mcq_options, id=option_id)

        # Create or update answer
        answer, created = MCQAnswer.objects.get_or_create(
            attempt=attempt,
            question=question,
            defaults={'selected_option': option, 'is_correct': option.is_correct}
        )

        if not created:
            answer.selected_option = option
            answer.is_correct = option.is_correct
            answer.save()

        answer.points_earned = question.points if answer.is_correct else 0
        answer.save()

        return Response({'message': 'Answer submitted successfully'})

    @action(detail=True, methods=['post'])
    def submit_drag_drop_answer(self, request, pk=None):
        attempt_id = request.data.get('attempt')
        question_id = request.data.get('question')
        item_id = request.data.get('drag_drop_item')
        position = request.data.get('placed_position')

        attempt = get_object_or_404(QuizAttempt, id=attempt_id, user=request.user)
        question = get_object_or_404(Question, id=question_id, quiz=attempt.quiz)
        item = get_object_or_404(question.drag_drop_items, id=item_id)

        # Create or update answer
        answer, created = DragDropAnswer.objects.get_or_create(
            attempt=attempt,
            question=question,
            drag_drop_item=item,
            defaults={'placed_position': position, 'is_correct': (item.correct_position == position)}
        )

        if not created:
            answer.placed_position = position
            answer.is_correct = (item.correct_position == position)
            answer.save()

        answer.points_earned = question.points if answer.is_correct else 0
        answer.save()

        return Response({'message': 'Answer submitted successfully'})

    @action(detail=True, methods=['post'])
    def submit_fill_in_blanks_answer(self, request, pk=None):
        attempt_id = request.data.get('attempt')
        question_id = request.data.get('question')
        item_id = request.data.get('fill_in_blanks_item')
        user_answer = request.data.get('user_answer')

        attempt = get_object_or_404(QuizAttempt, id=attempt_id, user=request.user)
        question = get_object_or_404(Question, id=question_id, quiz=attempt.quiz)
        item = get_object_or_404(question.fill_in_blanks_items, id=item_id)

        # Create or update answer
        answer, created = FillInBlanksAnswer.objects.get_or_create(
            attempt=attempt,
            question=question,
            fill_in_blanks_item=item,
            defaults={'user_answer': user_answer, 'is_correct': (item.correct_answer.lower() == user_answer.lower())}
        )

        if not created:
            answer.user_answer = user_answer
            answer.is_correct = (item.correct_answer.lower() == user_answer.lower())
            answer.save()

        answer.points_earned = question.points if answer.is_correct else 0
        answer.save()

        return Response({'message': 'Answer submitted successfully'})

    @action(detail=True, methods=['post'])
    def submit_predict_output_answer(self, request, pk=None):
        attempt_id = request.data.get('attempt')
        question_id = request.data.get('question')
        item_id = request.data.get('predict_output_item')
        user_output = request.data.get('user_output')

        attempt = get_object_or_404(QuizAttempt, id=attempt_id, user=request.user)
        question = get_object_or_404(Question, id=question_id, quiz=attempt.quiz)
        item = get_object_or_404(question.predict_output_items, id=item_id)

        # Create or update answer
        answer, created = PredictOutputAnswer.objects.get_or_create(
            attempt=attempt,
            question=question,
            predict_output_item=item,
            defaults={'user_output': user_output, 'is_correct': (item.correct_output.strip() == user_output.strip())}
        )

        if not created:
            answer.user_output = user_output
            answer.is_correct = (item.correct_output.strip() == user_output.strip())
            answer.save()

        answer.points_earned = question.points if answer.is_correct else 0
        answer.save()

        return Response({'message': 'Answer submitted successfully'})

    @action(detail=True, methods=['post'])
    def complete_attempt(self, request, pk=None):
        attempt_id = request.data.get('attempt')
        attempt = get_object_or_404(QuizAttempt, id=attempt_id, user=request.user)

        # Calculate total score
        total_score = 0
        for answer in attempt.mcq_answers.all():
            total_score += answer.points_earned
        for answer in attempt.drag_drop_answers.all():
            total_score += answer.points_earned
        for answer in attempt.fill_in_blanks_answers.all():
            total_score += answer.points_earned
        for answer in attempt.predict_output_answers.all():
            total_score += answer.points_earned

        attempt.score = total_score
        attempt.complete_attempt()

        serializer = QuizAttemptSerializer(attempt)
        return Response(serializer.data)

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer


class QuizAttemptViewSet(viewsets.ModelViewSet):
    queryset = QuizAttempt.objects.all()
    serializer_class = QuizAttemptSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return QuizAttempt.objects.filter(user=self.request.user)
