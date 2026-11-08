# Deploying the Record Management System to Render

This project uses three Render resources: a PostgreSQL database, a Node.js API web service, and a React static site. The included `render.yaml` describes these services as a Render Blueprint.

## Before you deploy

1. Create a GitHub repository and push the project to it. Do not commit passwords, tokens, or local `.env` files.
2. Confirm that the project root contains `render.yaml`, `package.json`, and `package-lock.json`, and that the client has its own package files.
3. Keep a backup of any local database records you need. The Render database starts empty; local PostgreSQL data is not automatically transferred.

## Deploy with the Blueprint

1. Sign in to Render and choose **New → Blueprint**.
2. Connect the GitHub repository containing this project.
3. Review the resources from `render.yaml` and create the Blueprint.
4. Wait for the PostgreSQL database, API service, and static site to finish provisioning and building.
5. In the Render dashboard, open the PostgreSQL database and use its SQL console to run the contents of `database/schema.sql` once. The API requires these four tables before account registration or data operations will work.
6. Open the API service URL plus `/health`. A JSON response such as `{"status":"ok"}` confirms the web service is responding.
7. Open the static site URL, create an account, sign in, and test employee, attendance, and payroll flows.

The Blueprint generates `JWT_SECRET` and connects the API to the database through Render's database connection string. The configuration assumes the default service URLs `https://record-management-client.onrender.com` and `https://record-management-api.onrender.com`. Render service names must be available; if Render assigns different URLs, update `CLIENT_URL` on the API and `REACT_APP_API_URL` on the static site to match the actual deployed URLs, then redeploy both services.

## Manual setup alternative

If you prefer not to use the Blueprint, create a Render PostgreSQL database, a Node web service, and a Static Site separately.

### Node API service

- **Root directory:** project root (leave blank)
- **Build command:** `npm install`
- **Start command:** `npm start`
- **Health check path:** `/health`
- **Environment variables:**
  - `NODE_ENV` = `production`
  - `JWT_SECRET` = generate a unique, long random secret in Render
  - `DATABASE_URL` = the Render database's internal connection string
  - `CLIENT_URL` = the deployed React site's complete HTTPS URL

### React static site

- **Root directory:** `record-management-client`
- **Build command:** `npm ci && npm run build`
- **Publish directory:** `build`
- **Environment variable:** `REACT_APP_API_URL` = the API service URL, including `https://` and without a trailing slash
- Add a rewrite rule from `/*` to `/index.html` with action **Rewrite** so client-side routes resolve correctly.

After creating both services, run `database/schema.sql` in the Render database SQL console. Set the static site's actual URL as `CLIENT_URL` on the API. Set the API's actual URL in `REACT_APP_API_URL` on the static site. Redeploy both services after changing environment variables.

## Database and data migration

The included schema creates the application tables in a new Render database, but does not copy local records. If existing data must be retained, export it from the local database and import it into Render after the schema is created. Check the foreign-key relationships and ID sequences after importing. Protect database backups because employee and payroll data can be sensitive.

## Important production notes

- The Blueprint uses Render's free plans as a low-cost demonstration starting point. Confirm current Render limits and database availability in your account; use an appropriate paid plan for persistent or business-critical data.
- Free web services may sleep when idle, so the first request can take longer while the service wakes.
- The app is a project foundation, not a fully compliant payroll platform. Do not treat stored payroll values as calculated or approved payroll.
- Before using real employee or payroll information, add role-based access, audit logging, stronger validation, backup/restore procedures, schema migrations, and a privacy/security review.
- Rotate any database password previously committed to source control. The application now reads connection settings from environment variables rather than embedding the local password in `db.js`.

## Local development environment variables

The API reads `PGUSER`, `PGHOST`, `PGDATABASE`, `PGPASSWORD`, and `PGPORT` for local PostgreSQL settings. It accepts `DATABASE_URL` instead when supplied. Set `JWT_SECRET` for a custom local token secret. The React app defaults to `http://localhost:5000`; set `REACT_APP_API_URL` before building if you need a different API address.