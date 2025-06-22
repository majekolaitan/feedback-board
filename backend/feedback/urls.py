from django.urls import path
from . import views

urlpatterns = [
    path('feedback/', views.FeedbackListCreateView.as_view(), name='feedback-list-create'),
    
    path('login/', views.admin_login, name='admin-login'),
    path('logout/', views.admin_logout, name='admin-logout'),
    path('auth/check/', views.check_auth, name='check-auth'),
    path('csrf/', views.get_csrf_token, name='csrf-token'),
    
    path('admin/feedback/', views.AdminFeedbackListView.as_view(), name='admin-feedback-list'),
    path('admin/feedback/<int:pk>/', views.AdminFeedbackUpdateView.as_view(), name='admin-feedback-update'),
]