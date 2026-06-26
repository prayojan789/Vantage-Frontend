/**
 * VANTAGE API SERVICE
 * ───────────────────
 * All HTTP calls live here. Vite dev proxy forwards /api/* → http://localhost:8000
 * Set USE_MOCK = false in src/utils/config.js when your FastAPI backend is running.
 *
 * ENDPOINTS (match these in FastAPI):
 *   GET  /events        → { events:[...], total:N }
 *   GET  /events/:id    → { id, title, date, articles:[...] }
 *   GET  /bias          → { media_houses:[...], top_entities:[...] }
 *   POST /analyze       → { entities:[...], overall_sentiment, processing_ms }
 *   GET  /sources       → { sources:[...] }
 *
 * See src/utils/mockData.js for exact JSON shapes.
 */
import axios from 'axios'

const client = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

client.interceptors.response.use(
  res => res.data,
  err => Promise.reject(new Error(err.response?.data?.detail || err.message || 'Request failed'))
)

export const getEvents    = (params = {}) => client.get('/events', { params })
export const getEventById = id            => client.get(`/events/${id}`)
export const getBiasReport = (params={})  => client.get('/bias', { params })
export const analyzeText  = text          => client.post('/analyze', { text })
export const getSources   = ()            => client.get('/sources')
