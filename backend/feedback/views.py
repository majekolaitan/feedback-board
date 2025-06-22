from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
from django.middleware.csrf import get_token
from .models import Feedback
from .serializers import FeedbackSerializer, AdminFeedbackSerializer, LoginSerializer
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend

class FeedbackListCreateView(generics.ListCreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = FeedbackSerializer

    def get_queryset(self):
        return Feedback.objects.filter(is_reviewed=True).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save()

@api_view(['POST'])
@permission_classes([AllowAny])
def admin_login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        login(request, user)
        return Response({
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'username': user.username,
                'is_staff': user.is_staff
            }
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_logout(request):
    logout(request)
    return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])
def check_auth(request):
    if request.user.is_authenticated and request.user.is_staff:
        return Response({
            'authenticated': True,
            'user': {
                'id': request.user.id,
                'username': request.user.username,
                'is_staff': request.user.is_staff
            }
        })
    return Response({'authenticated': False})

class AdminFeedbackListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AdminFeedbackSerializer
    queryset = Feedback.objects.all().order_by('-created_at')
    
    filter_backends = [SearchFilter, DjangoFilterBackend]
    search_fields = ['title', 'content']
    filterset_fields = ['is_reviewed']
    
    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response({'detail': 'Admin access required.'}, 
                          status=status.HTTP_403_FORBIDDEN)
        return super().dispatch(request, *args, **kwargs)

class AdminFeedbackUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AdminFeedbackSerializer
    queryset = Feedback.objects.all()
    http_method_names = ['patch']
    
    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response({'detail': 'Admin access required.'}, 
                          status=status.HTTP_403_FORBIDDEN)
        return super().dispatch(request, *args, **kwargs)

@api_view(['GET'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def get_csrf_token(request):
    return Response({'csrfToken': get_token(request)})