from rest_framework import serializers
from .models import Feedback

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ['id', 'title', 'content', 'created_at']
        read_only_fields = ['id', 'created_at']

class AdminFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ['id', 'title', 'content', 'is_reviewed', 'created_at', 'reviewed_at']
        read_only_fields = ['id', 'created_at', 'reviewed_at']