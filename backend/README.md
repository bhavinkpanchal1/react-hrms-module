# HRMS Django API

Django REST Framework backend for the React HRMS frontend. It implements the
current recruitment and employee modules and preserves the field names already
used by the TypeScript API clients (`jobId`, `candidateId`, and paginated
`results`).

## Local setup

```bash
cd backend
python3 -m venv env
env/bin/pip install -r requirements.txt
env/bin/python manage.py migrate
env/bin/python manage.py createsuperuser
env/bin/python manage.py runserver
```

The API runs at `http://localhost:8000/api/`. No `.env` file is required: local
development defaults to debug mode, anonymous API access, SQLite, and CORS for
the standard Vite development origins.

To load demo recruitment records:

```bash
env/bin/python manage.py seed_demo
```

## React integration

The frontend is configured to use this backend by default. To temporarily use
its old in-memory data, set `VITE_USE_MOCK_API=true`.

The frontend already defaults to `http://localhost:8000/api`, so no other local
configuration is needed. To use another backend URL, create `frontend/.env.local`:

```dotenv
VITE_API_BASE_URL=http://localhost:8000/api
VITE_USE_MOCK_API=false
```

## Authentication

The React login page is currently a placeholder. For that reason, anonymous API
access is enabled only when Django is in debug mode. Set
`API_ALLOW_ANONYMOUS=false` to require authentication.

JWT endpoints:

- `POST /api/auth/token/` with `username` and `password`
- `POST /api/auth/token/refresh/` with `refresh`
- `POST /api/auth/token/verify/` with `token`

The React Axios interceptor already sends `access_token` from local storage as a
Bearer token.

## API endpoints

- `/api/recruitment/jobs/`
- `/api/recruitment/candidates/`
- `/api/recruitment/interviews/`
- `/api/recruitment/offers/`
- `/api/recruitment/pipeline/`
- `/api/employees/`
- `/api/health/`
- `/api/docs/` (Swagger UI)
- `/admin/` (Django admin)

List endpoints support `?search=...`, `?ordering=...`, and domain filters such as
`?status=open`, `?jobId=1`, or `?candidateId=1`.

## PostgreSQL

Install the PostgreSQL requirements and set the `DB_*` variables shown in
`.env.example`:

```bash
env/bin/pip install -r requirements-postgres.txt
```

## Verification

```bash
env/bin/python manage.py check
env/bin/python manage.py test
env/bin/python manage.py spectacular --validate --file /tmp/hrms-schema.yml
```
