# 🇳🇵 Vantage — Nepal News Intelligence Dashboard

## Quick Start

```bash
npm install
npm run dev    # → http://localhost:5173
```

Works fully in mock mode. No backend needed to run.

## Connect Backend (3 steps)

1. `src/utils/config.js` → set `USE_MOCK = false`
2. `vite.config.js` → confirm proxy target is your FastAPI port (default 8000)
3. Add CORS to FastAPI:
```python
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173"], allow_methods=["*"], allow_headers=["*"])
```

## API Endpoints (see src/services/api.js for full shapes)

| Method | Path | Page |
|--------|------|------|
| GET | /events | Dashboard |
| GET | /events/:id | EventDetail |
| GET | /bias | BiasReport |
| POST | /analyze | LiveAnalysis |
| GET | /sources | Dashboard filter |

## Stack
React 18 · Vite 5 · Tailwind 3 · Recharts 2 · Axios · Lucide React
