# RecoverAI — Intelligent Revenue Recovery Agent

Complete Phase 1–8 full-stack project with the exact RecoverAI demo dashboard
design, responsive light/dark UI, recovery predictions, analytics, CSV import
and an AI recovery agent.

## Stack
- Vite + JavaScript frontend (React component source is also included)
- FastAPI
- PostgreSQL / SQLite fallback
- Scikit-learn
- AI Agent tool-calling architecture
- Recharts
- Docker

## Run Backend
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

## Run Frontend
```bash
cd frontend
npm install
npm run build
npm run dev
```

The default frontend uses the same structure and styling as the published
RecoverAI demo. It automatically connects to the local FastAPI backend and
falls back to safe demo data when the API is offline.

For a hosted backend, update `frontend/public/config.js` with the API URL.

The frontend is available at `http://localhost:5173` and the API documentation
at `http://localhost:8000/docs`.

## Demo login

- Email: `demo@recoverai.local`
- Password: `RecoverAI123!`

Demo data is created automatically when `AUTO_SEED_DEMO=true`.

## Tests
```bash
cd backend
pytest

cd ../frontend
npm run build
npm run qa
```

## Docker
```bash
docker compose up --build
```

## Configuration

- Copy `backend/.env.example` to `backend/.env`.
- Copy `frontend/.env.example` to `frontend/.env`.
- The included `mock` AI provider works without an external API key.
- Replace `JWT_SECRET` before any production deployment.
- To connect a real provider, configure `backend/app/services/llm_service.py`.

The backend auto-creates and auto-seeds demo data by default.
Set `AUTO_SEED_DEMO=false` to disable this behavior.

All included payment data is synthetic/demo data.
