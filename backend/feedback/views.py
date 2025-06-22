from rest_framework import generics 
from rest_framework.permissions import AllowAny 
from .models import Feedback
from .serializers import FeedbackSerializer 

class FeedbackListCreateView(generics.ListCreateAPIView):
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        return Feedback.objects.filter(is_reviewed=True)
    
    def get_serializer_class(self):
        return FeedbackSerializer
    
    def perform_create(self, serializer):
        serializer.save()