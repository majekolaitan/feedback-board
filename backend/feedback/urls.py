from django.urls import path
from . import views

urlpatterns = [
    path('feedback/', views.FeedbackListCreateView.as_view(), name='feedback-list-create'),
        
    path('admin/feedback/', views.AdminFeedbackListView.as_view(), name='admin-feedback-list'),
    path('admin/feedback/<int:pk>/', views.AdminFeedbackUpdateView.as_view(), name='admin-feedback-update'),
]