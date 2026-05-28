# Backend

FastAPI backend for AgroGuardian AI.

## Run

```powershell
python -m uvicorn app:app --host 127.0.0.1 --port 8000
```

## Environment

Copy `.env.example` to `.env` and fill:

```text
OPENWEATHER_API_KEY=...
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-1.5-flash
```

## Key Endpoints

- `GET /api/health`
- `GET /api/weather/local?lat=...&lon=...`
- `POST /api/ai/advice`
- `POST /api/detect-disease`

