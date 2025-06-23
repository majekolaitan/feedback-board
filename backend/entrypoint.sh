#!/bin/sh

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Running Django migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput --clear

# If you have a command to populate data, you can run it here (optional)
# echo "Populating initial data if necessary..."
# python manage.py populate_feedback

echo "Starting Gunicorn..."
# Execute the CMD from the Dockerfile (Gunicorn)
exec "$@"