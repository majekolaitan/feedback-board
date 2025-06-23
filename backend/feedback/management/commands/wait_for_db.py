import time
from django.db import connections
from django.db.utils import OperationalError
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    """Django command to pause execution until database is available"""

    def handle(self, *args, **options):
        self.stdout.write("Waiting for database...")
        db_conn = None
        attempts = 0
        max_attempts = 30  # Try for 30 seconds (30 * 1 second)
        while not db_conn and attempts < max_attempts:
            try:
                db_conn = connections['default']
                db_conn.cursor()  # Try to make a connection
            except OperationalError:
                self.stdout.write("Database unavailable, waiting 1 second...")
                time.sleep(1)
            attempts += 1

        if db_conn:
            self.stdout.write(self.style.SUCCESS("Database available!"))
        else:
            self.stdout.write(self.style.ERROR("Database unavailable after multiple attempts."))
            exit(1) # Exit with error code if DB not available