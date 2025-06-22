import random
from django.core.management.base import BaseCommand
from django.utils import timezone
from feedback.models import Feedback

class Command(BaseCommand):
    help = 'Populates the database with static dummy feedback data for testing.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting to populate feedback data...'))

        Feedback.objects.all().delete()
        self.stdout.write(self.style.WARNING('Existing feedback data cleared.'))

        feedback_items = []
        num_items = 65

        for i in range(1, num_items + 1):
            is_reviewed_status = random.choice([True, False, False, True, True])
            
            feedback_items.append(
                Feedback(
                    title=f"Feedback Title {i}",
                    content=f"This is the detailed content for feedback item number {i}. "
                            f"It provides some example text to simulate real user input. "
                            f"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. "
                            f"Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                    is_reviewed=is_reviewed_status,
                )
            )

        created_count = 0
        for item in feedback_items:
            item.save()
            created_count += 1
        
        self.stdout.write(self.style.SUCCESS(f'Successfully populated {created_count} feedback items.'))