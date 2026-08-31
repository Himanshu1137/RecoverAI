# RecoverAI — Phase 1 to 8

## Phase 1
Project foundation: React, FastAPI, database and ML folders.

## Phase 2
Synthetic payment data and ML preparation.

## Phase 3
Scikit-learn recovery prediction API.

## Phase 4
Recovery recommendation engine and agent-tool foundation.

## Phase 5
React dashboard, recovery page, AI Agent page and analytics UI.

## Phase 6
Merchant approval, recovery simulation, outcomes and feedback metrics.

## Phase 7
Production readiness:
- Pydantic validation
- centralized configuration
- error handling
- health checks
- tests
- Docker
- environment templates

## Phase 8
AI Agent architecture:
- LLM provider abstraction
- tool registry
- tool schemas
- orchestrator
- natural-language recovery analysis

Default LLM provider is `mock` so the package runs without an API key.

## Final Architecture

React
↓
FastAPI
↓
AI Agent / Tool Orchestrator
↙        ↓         ↘
PostgreSQL  Scikit-learn  Analytics
↓             ↓             ↓
Transaction Data  Prediction  Outcomes
        ↘        ↓        ↙
          Decision Layer
               ↓
        Merchant Action
               ↓
        Recovery Outcome
               ↓
          Feedback Data
