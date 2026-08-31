# RecoverAI — Intelligent Revenue Recovery Agent

Complete Phase 1–8 starter project.

## Stack
- React + Vite
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
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Run Frontend
```bash
cd frontend
npm install
npm run dev
```

## Tests
```bash
cd backend
pytest
```

## Docker
```bash
docker compose up --build
```

## Phase 8 AI Agent
The included default provider is `mock`, so no external API key is needed.
To connect a real provider, extend:
`backend/app/services/llm_service.py`

The backend auto-creates and auto-seeds demo data by default.
Set `AUTO_SEED_DEMO=false` to disable this behavior.

All included payment data is synthetic/demo data.
