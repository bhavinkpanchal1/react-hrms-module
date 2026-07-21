# React HRMS

Human resources management system with a React/TypeScript frontend and a
Django REST Framework backend.

- Frontend setup: [frontend/README.md](frontend/README.md)
- Backend setup and API reference: [backend/README.md](backend/README.md)

## Quick start

Run the API:

```bash
cd backend
python3 -m venv env
env/bin/pip install -r requirements.txt
env/bin/python manage.py migrate
env/bin/python manage.py runserver
```

Run the React app in another terminal:

```bash
cd frontend
npm install
npm run dev
```

No environment files are required for local development. React defaults to
`http://localhost:5173`, Django defaults to `http://localhost:8000`, and the
frontend consumes `http://localhost:8000/api`. Swagger API docs are available at
`http://localhost:8000/api/docs/`.
