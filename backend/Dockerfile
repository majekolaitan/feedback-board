# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install system dependencies (if any, e.g., for psycopg2 if using PostgreSQL)
# For PostgreSQL:
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . /app/

# Expose port (Gunicorn will run on this port)
EXPOSE 8000

# Command to run the application using Gunicorn
# Ensure gunicorn is in your requirements.txt
# This entrypoint script will handle migrations and starting Gunicorn
COPY ./entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["gunicorn", "feedback_board.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]