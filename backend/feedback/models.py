from django.db import models
from django.utils import timezone

class Feedback(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    is_reviewed = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {'Reviewed' if self.is_reviewed else 'Pending'}"
    
    def save(self, *args, **kwargs):
        if self.is_reviewed and not self.reviewed_at:
            self.reviewed_at = timezone.now()
        elif not self.is_reviewed:
            self.reviewed_at = None
        super().save(*args, **kwargs)