from django.core.management.base import BaseCommand, CommandError
from feedback.models import Feedback

class Command(BaseCommand):
    help = 'Deletes all feedback entries from the database.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--no-input',
            action='store_true',
            help='Suppresses all user prompts (USE WITH CAUTION).',
        )

    def handle(self, *args, **options):
        if not options['no_input']:
            self.stdout.write(self.style.WARNING(
                "This will permanently delete ALL feedback entries."
            ))
            confirm = input("Are you sure you want to proceed? (yes/no): ")
            if confirm.lower() != 'yes':
                self.stdout.write(self.style.ERROR("Operation cancelled by user."))
                return

        try:
            count_details = Feedback.objects.all().delete()
            num_deleted = count_details[0]
            self.stdout.write(self.style.SUCCESS(
                f'Successfully deleted {num_deleted} feedback entries.'
            ))
        except Exception as e:
            raise CommandError(f"Error deleting feedback entries: {e}")