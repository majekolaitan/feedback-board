from django.contrib import admin
from .models import Feedback

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ['title', 'is_reviewed', 'created_at', 'reviewed_at']
    list_filter = ['is_reviewed', 'created_at']
    search_fields = ['title', 'content']
    readonly_fields = ['created_at', 'reviewed_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request)
    
    actions = ['mark_as_reviewed', 'mark_as_unreviewed']
    
    def mark_as_reviewed(self, request, queryset):
        queryset.update(is_reviewed=True) 
        self.message_user(request, f'{queryset.count()} feedback(s) marked as reviewed.')
    
    def mark_as_unreviewed(self, request, queryset):
        queryset.update(is_reviewed=False)
        self.message_user(request, f'{queryset.count()} feedback(s) marked as unreviewed.')
    
    mark_as_reviewed.short_description = "Mark selected feedback as reviewed"
    mark_as_unreviewed.short_description = "Mark selected feedback as unreviewed"