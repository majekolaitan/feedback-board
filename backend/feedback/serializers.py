from rest_framework import serializers
from django.contrib.auth import authenticate # Now used
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

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        if not (username and password):
            raise serializers.ValidationError('Must include username and password.')

        request = self.context.get('request')
        user = authenticate(request=request, username=username, password=password)

        if not user:
            raise serializers.ValidationError('Invalid username or password.')
        
        if not user.is_active:
            raise serializers.ValidationError('User account is disabled.')
        
        if not user.is_staff: 
            raise serializers.ValidationError('User is not authorized as admin.')
        
        data['user'] = user
        return data