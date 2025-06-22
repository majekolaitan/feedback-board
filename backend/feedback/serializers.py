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
        
        if username and password:
            user = authenticate(username=username, password=password)
            if user:
                if user.is_active:
                    if user.is_staff:
                        data['user'] = user
                        return data
                    else:
                        raise serializers.ValidationError('User is not authorized as admin.')
                else:
                    raise serializers.ValidationError('User account is disabled.')
            else:
                raise serializers.ValidationError('Invalid username or password.')
        else:
            raise serializers.ValidationError('Must include username and password.')
        
        return data