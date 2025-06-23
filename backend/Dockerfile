# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install Python dependencies
# Copy requirements first to leverage Docker cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project code into the container
# The .dockerignore file will control what gets copied
COPY . .

# Expose port Django runs on
EXPOSE 8000

# The command to run the application will be specified in docker-compose.yml
# For reference, it would typically be:
# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]