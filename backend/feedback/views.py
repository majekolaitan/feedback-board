from rest_framework import generics, status
from rest_framework.response import Response 
from rest_framework.permissions import IsAuthenticated, AllowAny 
from .models import Feedback
from .serializers import FeedbackSerializer, AdminFeedbackSerializer

class FeedbackListCreateView(generics.ListCreateAPIView):
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        return Feedback.objects.filter(is_reviewed=True)
    
    def get_serializer_class(self):
        return FeedbackSerializer
    
    def perform_create(self, serializer):
        serializer.save()

class AdminFeedbackListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated] # Requires authentication
    serializer_class = AdminFeedbackSerializer
    queryset = Feedback.objects.all() # Shows all feedback
    
    def dispatch(self, request, *args, **kwargs):
        # Additional check for staff status
        if not request.user.is_staff:
            return Response({'detail': 'Admin access required.'}, 
                          status=status.HTTP_403_FORBIDDEN)
        return super().dispatch(request, *args, **kwargs)

class AdminFeedbackUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated] # Requires authentication
    serializer_class = AdminFeedbackSerializer
    queryset = Feedback.objects.all()
    http_method_names = ['patch'] # Only allow PATCH requests as per original
    
    def dispatch(self, request, *args, **kwargs):
        # Additional check for staff status
        if not request.user.is_staff:
            return Response({'detail': 'Admin access required.'}, 
                          status=status.HTTP_403_FORBIDDEN)
        return super().dispatch(request, *args, **kwargs)