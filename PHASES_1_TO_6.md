# RecoverAI — Phase 1 to 6

## Phase 1
Project architecture, requirements and initial React/FastAPI/ML layout.

## Phase 2
FastAPI backend, database connection, transaction model and health endpoint.

## Phase 3
Scikit-learn recovery prediction model and prediction API.

## Phase 4
AI recovery recommendation layer:
- failed-payment retrieval
- recovery probability
- priority
- expected recovery
- recommended action

## Phase 5
React dashboard:
- Sidebar
- Dashboard
- Recovery page
- AI Agent page
- Analytics page
- React ↔ FastAPI API integration

## Phase 6
Recovery workflow:
- merchant approval
- recovery simulation
- recovery outcomes
- recovered revenue
- analytics
- feedback data foundation

## Run

### Backend
```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
pip install -r requirements.txt
python -m app.database.init_db
python -m app.database.seed
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173
Backend docs: http://127.0.0.1:8000/docs

This package uses a deterministic local/demo agent implementation in Phase 4-6.
Phase 8 can replace it with an actual LLM + tool-calling implementation.
