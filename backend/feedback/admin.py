from django.contrib import admin
from .models import Feedback
from django.utils import timezone

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ['title', 'is_reviewed', 'created_at', 'reviewed_at']
    list_filter = ['is_reviewed', 'created_at']
    search_fields = ['title', 'content']
    readonly_fields = ['created_at', 'reviewed_at']
    
    actions = ['mark_as_reviewed', 'mark_as_unreviewed']
    
    def mark_as_reviewed(self, request, queryset):
        updated_count = queryset.update(is_reviewed=True, reviewed_at=timezone.now())
        self.message_user(request, f'{updated_count} feedback(s) marked as reviewed.')
    
    def mark_as_unreviewed(self, request, queryset):
        updated_count = queryset.update(is_reviewed=False, reviewed_at=None)
        self.message_user(request, f'{updated_count} feedback(s) marked as unreviewed.')
    
    mark_as_reviewed.short_description = "Mark selected feedback as reviewed"
    mark_as_unreviewed.short_description = "Mark selected feedback as unreviewed"