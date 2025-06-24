# Feedback Board Application

A full-stack web application for collecting and managing user feedback. It features a public submission form for users to share their thoughts and an admin panel for administrators to review, moderate, and manage feedback.

## Features

- **Public Feedback Submission:** Users can easily submit feedback (title and content) through a dedicated form.
- **Public Feedback Display:** Reviewed feedback items are displayed publicly, with pagination for easy browsing.
- **Admin Authentication:** Secure login system for administrators using username and password.
- **Comprehensive Admin Dashboard:**
  - View all feedback submissions, sortable and filterable.
  - Search feedback by title or content.
  - Filter feedback by review status (All, Reviewed, Pending).
  - Mark feedback items as reviewed or unreviewed with a single click.
  - Pagination for efficiently managing large volumes of feedback.
  - Global statistics: Total submissions, total reviewed, and total pending feedback.
- **CSRF Protection:** Implemented to protect against cross-site request forgery attacks on form submissions.
- **Responsive Design:** The user interface is built with Tailwind CSS, ensuring a good experience on various devices.
- **Dockerized:** The entire application (frontend and backend) is containerized using Docker and Docker Compose for easy setup, development, and deployment.

## Tech Stack

- **Frontend:**
  - Next.js (React Framework)
  - TypeScript
  - Tailwind CSS
  - Axios (for API communication)
  - React Context API (for global state management, e.g., Authentication)
  - Heroicons (for UI icons)
- **Backend:**
  - Django (Python Web Framework)
  - Django REST Framework (for building Web APIs)
  - Python 3.10
- **Database:**
  - SQLite (default, easily configurable to other databases like PostgreSQL or MySQL if needed)
- **Containerization:**
  - Docker
  - Docker Compose

## Project Structure

```
.
├── backend/            # Django backend application
│   ├── feedback/       # Django app for feedback models, views, serializers, etc.
│   ├── feedback_board/ # Django project settings and root URL configuration
│   ├── manage.py       # Django's command-line utility
│   ├── requirements.txt# Python dependencies
│   └── Dockerfile      # Dockerfile for the backend service
├── frontend/           # Next.js frontend application
│   ├── app/            # Next.js App Router (pages, layouts)
│   ├── components/     # Reusable React components
│   ├── contexts/       # React Context providers (e.g., AuthContext)
│   ├── lib/            # Utility functions (e.g., api.ts for API calls)
│   ├── public/         # Static assets
│   ├── types/          # TypeScript type definitions
│   ├── next.config.mjs # Next.js configuration
│   ├── package.json    # Node.js dependencies and scripts
│   ├── tailwind.config.ts # Tailwind CSS configuration
│   ├── tsconfig.json   # TypeScript configuration
│   └── Dockerfile      # Dockerfile for the frontend service
├── docker-compose.yml  # Docker Compose configuration for orchestrating services
└── README.md           # This file
```

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- Docker: [Install Docker](https://docs.docker.com/get-docker/)
- Docker Compose: [Install Docker Compose](https://docs.docker.com/compose/install/) (usually included with Docker Desktop)

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd <project-directory-name>
    ```

2.  **Environment Variables:**
    The project uses environment variables for configuration. The most important one for the frontend is:

    - `NEXT_PUBLIC_API_URL`: Specifies the backend API URL. This is pre-configured in `docker-compose.yml` to `http://localhost:8000/api` for local development.

    No `.env` files are strictly required for basic local setup as defaults are provided in `docker-compose.yml`. For production, you would typically manage secrets and configurations more robustly.

3.  **Build and run the application using Docker Compose:**
    From the project root directory (where `docker-compose.yml` is located):
    ```bash
    docker-compose up --build
    ```
    This command will:
    - Build the Docker images for both the `frontend` and `backend` services if they don't exist.
    - Start the containers.
    - The backend service automatically runs Django database migrations on startup.

## Usage

Once the containers are up and running:

- **Frontend Application (Public Feedback & Admin Login):**
  Open your web browser and navigate to: `http://localhost:3000`

- **Backend API:**
  The Django REST Framework API is accessible at: `http://localhost:8000/api/`

- **Admin Access:**
  The application features a custom admin panel accessible via the frontend. To use it:

  1.  **Create an Admin User:**
      You need a Django user account marked as `is_staff=True`. Open a new terminal window and execute the following command while the Docker containers are running:
      ```bash
      docker-compose exec backend python manage.py createsuperuser
      ```
      Follow the prompts to set a username, email (optional), and password for your admin user.
  2.  **Login to the Admin Panel:**
      Navigate to `http://localhost:3000/login` in your browser.
      Use the credentials you created in the previous step to log in.
  3.  Upon successful login, you will be redirected to the admin dashboard at `http://localhost:3000/admin`, where you can manage feedback.

- **Django Admin Interface (Optional):**
  You can also access the standard Django admin interface at `http://localhost:8000/admin/` and log in with the superuser credentials. This can be useful for managing users or other Django models directly.

## API Endpoints

The backend API (prefixed with `/api/`) provides the following key endpoints:

- **Public Feedback:**
  - `GET /feedback/`: Retrieve a paginated list of publicly reviewed feedback.
  - `POST /feedback/`: Submit new feedback.
- **Authentication & CSRF:**
  - `POST /login/`: Admin user login.
  - `POST /logout/`: Admin user logout (requires authentication).
  - `GET /auth/check/`: Check current admin authentication status.
  - `GET /csrf/`: Retrieve a CSRF token (used internally by the frontend for secure POST/PATCH requests).
- **Admin Feedback Management (Requires Authentication & Staff Status):**
  - `GET /admin/feedback/`: Retrieve a paginated list of all feedback (reviewed and pending).
    - Supports query parameters:
      - `page`: Page number for pagination.
      - `search`: Search term for title and content.
      - `is_reviewed`: Filter by review status (`true`, `false`, or omit for all).
  - `PATCH /admin/feedback/<id>/`: Update a specific feedback item (e.g., to mark as reviewed/unreviewed).

## Environment Variables

Key environment variables used in `docker-compose.yml`:

- **Frontend (`frontend` service):**

  - `NEXT_PUBLIC_API_URL=http://localhost:8000/api`: Sets the backend API URL for the Next.js application.
  - `CHOKIDAR_USEPOLLING=true`: Can improve hot-reloading reliability within Docker containers in some environments.

- **Backend (`backend` service):**
  - `PYTHONUNBUFFERED=1`: Ensures Python output (like logs) is sent directly to the terminal without buffering.
  - `DJANGO_SETTINGS_MODULE=feedback_board.settings`: Specifies the Django settings module to use.

**Important Security Notes for Production:**

- **`SECRET_KEY`**: The `SECRET_KEY` in `backend/feedback_board/settings.py` is for development only. For production, generate a strong, unique secret key and manage it securely (e.g., via environment variables).
- **`DEBUG`**: Set `DEBUG = False` in `backend/feedback_board/settings.py` for production.
- **`ALLOWED_HOSTS`**: Configure `ALLOWED_HOSTS` in `backend/feedback_board/settings.py` with your production domain(s).
- **HTTPS**: For production, serve your application over HTTPS. Set `SESSION_COOKIE_SECURE = True` and `CSRF_COOKIE_SECURE = True` in Django settings when using HTTPS.
- **CORS**: Adjust `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS` in Django settings to match your frontend's production domain.

## Future Enhancements / To-Do

- User registration for submitting feedback (if differentiation is needed).
- Email notifications for admins upon new feedback submission.
- More advanced analytics and reporting on feedback trends.
- Deployment scripts/guides for production environments (e.g., Kubernetes, Docker Swarm).
- Comprehensive unit and integration tests for both frontend and backend.
- Implement user upvoting/downvoting or commenting on feedback items.
- Rich text editor for feedback content.

## Contributing

Contributions are welcome! If you'd like to contribute, please fork the repository and submit a pull request. For major changes, please open an issue first to discuss what you would like to change.

---
