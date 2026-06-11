# Neural Nexus — AI Multi-Agent News

Neural Nexus is a demo news platform powered by a multi-agent AI pipeline. Agents gather, verify, analyze, write, review, and optionally publish AI-related articles. This repository includes a React + Vite frontend and a FastAPI backend that together demonstrate an end-to-end agent-driven content workflow.

Key features
- Multi-agent workflow to gather and produce news articles
- Frontend with article listing, full article view, and Medium integration UI
- Backend FastAPI service exposing workflow start, article, and Medium OAuth/publish endpoints
- MongoDB-backed storage for articles and OAuth connections

Repository layout

- backend/: FastAPI backend and integration endpoints
  - api.py — main API routes (workflow, articles, Medium OAuth)
  - requirements.txt — Python dependencies
- src/: React + Vite frontend
  - pages, components, hooks, lib, and styles for the UI
- public/: static assets served by the frontend
- package.json, tsconfig.json, vite.config.ts: frontend build and configuration

Quick start (development)

Prerequisites
- Node.js (18+ recommended) and npm/yarn
- Python 3.10+ and virtualenv/venv
- MongoDB instance running locally or remotely

Frontend

1. Install dependencies

```bash
cd neural-nexus-news-2
npm install
```

2. Start the dev server

```bash
npm run dev
```

The frontend runs on http://localhost:8080 by default.

Backend

1. Create and activate a Python virtual environment, then install requirements

```bash
cd backend
python -m venv .venv
.\\.venv\\Scripts\\Activate.ps1   # PowerShell on Windows
# or: source .venv/bin/activate  # macOS / Linux
pip install -r requirements.txt
```

2. Configure environment variables

Copy `.env.example` to `.env` and set the values for:

- `MONGODB_URI` — MongoDB connection string
- `MEDIUM_CLIENT_ID` and `MEDIUM_CLIENT_SECRET` — for Medium OAuth (optional)
- `MEDIUM_REDIRECT_URI` — redirect URL used for OAuth callbacks
- `OAUTH_ENCRYPTION_KEY` — 32-byte Fernet key (required if using Medium integration)

3. Run the API server

```bash
uvicorn backend.api:app --reload --port 8000
```

The backend listens on http://localhost:8000 by default.

Notes on Medium integration
- The backend includes endpoints to generate the Medium OAuth URL and to publish articles to Medium. If you want to test publishing, register an OAuth application on Medium and set `MEDIUM_CLIENT_ID`, `MEDIUM_CLIENT_SECRET`, and `MEDIUM_REDIRECT_URI` in your `.env`.
- The backend stores the Medium access token encrypted with the `OAUTH_ENCRYPTION_KEY`.

API endpoints (high level)

- POST `/workflow/start` — triggers a backend workflow run and returns `article`, `logs`, and `newsItems`.
- GET `/articles` — list all articles
- GET `/articles/{id}` — fetch a single article
- POST `/integrations/medium/auth-url` — get the Medium OAuth URL
- GET `/integrations/medium/callback` — Medium OAuth redirect handler
- POST `/articles/{article_id}/publish-medium` — publish an article to Medium

Development notes
- Frontend uses React Router and TanStack Query for data fetching. The UI expects the backend at `http://localhost:8000` by default — change `src/lib/api.ts` if needed.
- The repository contains mock/demo data and a simulated workflow runner; the backend `POST /workflow/start` endpoint writes a demo article to MongoDB and returns logs and news items.

Testing & building

- Run frontend build:

```bash
npm run build
```

- Run tests with Vitest:

```bash
npm test
```

Contributing

Contributions are welcome. Open an issue to discuss major changes before submitting a PR. Keep commits focused and add tests for new functionality.

License

This project does not include a license by default. Add a LICENSE file if you wish to make the project open-source.

Contact

For questions about running this demo or integrating Medium, open an issue or reach out via the repo maintainer.
# Welcome to our project Neural Nexus News

## How can I edit this code?

There are several ways of editing your application.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS



