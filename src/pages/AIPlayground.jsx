/**
 * AIPlayground.jsx
 * ────────────────
 * Vantage Nepal news intelligence frontend — AI Playground page.
 *
 * A panel-layout rework of LiveAnalysis: paste any English Nepali news
 * paragraph and run aspect-based sentiment analysis (ABSA). Extracted
 * entities are rendered with a SentimentChart and a per-paragraph
 * overall sentiment pill. No hero gradient — uses the standard panel
 * layout via PageHeader.
 */
import { useState } from 'react'
import { Zap, AlertCircle, Clock, Terminal, ChevronRight, Cpu, Sparkles } from 'lucide-react'
import SentimentChart from '../components/SentimentChart.jsx'
import PageMetadata from '../components/PageMetadata.jsx'
import { PageHeader } from '../layouts/PageContainer.jsx'
import { USE_MOCK } from '../utils/config.js'
import { MOCK_ANALYZE } from '../utils/mockData.js'
import { analyzeText } from '../services/api.js'
import { sentimentPill, sentimentColor } from '../utils/helpers.js'

const EXAMPLES = [
  { label:'Coalition Tensions', text:"PM Dahal met with RSP leader Rabi Lamichhane today, where both parties agreed to review the coalition's six-month agenda. Critics from NC called the meeting unproductive and a distraction from governance." },
  { label:'UML Congress', text:"KP Oli addressed thousands of UML cadres in Kathmandu, claiming the party was stronger than ever. Independent mayor Balen Shah dismissed the speech as empty rhetoric from a crumbling establishment." },
  { label:'Economic Report', text:"Nepal's GDP is projected to grow at 5.1% according to the World Bank. Finance Minister praised the NRB's monetary policy while opposition leaders questioned whether citizens would feel the benefits." },
]

const MODEL_INFO = [
  { label:'Model',     value:'distilbert-vantage-v1' },
  { label:'Task',      value:'Aspect-Based Sentiment' },
  { label:'Entities',  value:'Nepali Political NER' },
  { label:'Inference', value:'Local FastAPI · PyTorch' },
  { label:'Avg Latency', value:'~320ms' },
]

export default function AIPlayground() {
  const [text, setText]     = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState(null)
  const [ran, setRan]       = useState(false)

  const run = async () => {
    if (!text.trim()) return
    setLoading(true); setError(null); setResult(null)
    try {
      const data = USE_MOCK
        ? await new Promise(res => setTimeout(() => res(MOCK_ANALYZE(text)), 600 + Math.random()*400))
        : await analyzeText(text)
      setResult(data); setRan(true)
    } catch(e) { setError(e.message) }
    finally { setLoading(false) }
  }

  const overallColor = result ? sentimentColor(result.overall_sentiment) : '#6366f1'

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:28 }}>
      <PageMetadata
        title="AI Playground | Vantage"
        description="Explore aspect-based sentiment analysis on arbitrary Nepali news text."
      />

      {/* ── Standard panel header (no hero) ── */}
      <PageHeader
        eyebrow={
          <span style={{ display:'inline-flex', alignItems:'center', gap:6 }}>
            <Sparkles size={11} /> Model Exploration
          </span>
        }
        title={<>AI <em style={{ fontStyle:'italic', color:'var(--accent)', fontWeight:600 }}>Playground</em></>}
        description="Paste any English Nepali news paragraph and inspect what the ABSA model extracts — entities, sentiment scores, and overall tone."
        actions={
          <span style={{
            display:'inline-flex', alignItems:'center', gap:6,
            fontSize:'0.72rem', fontWeight:600,
            background:'linear-gradient(135deg, #eef2ff, #faf5ff)',
            color:'var(--accent)',
            border:'1px solid #e0e7ff',
            borderRadius:99, padding:'6px 12px',
          }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'#10b981', display:'inline-block' }} />
            distilbert-vantage-v1
          </span>
        }
      />

      {/* ── Main two-column layout ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>

        {/* ── Input panel ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div className="card anim-fade-up-1" style={{ padding:'24px 26px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
              <div style={{
                width:32, height:32, borderRadius:9,
                background:'linear-gradient(135deg, var(--accent), var(--accent-2))',
                display:'flex', alignItems:'center', justifyContent:'center',
                boxShadow:'0 6px 16px -6px rgba(99,102,241,0.5)',
              }}>
                <Terminal size={14} color="white" />
              </div>
              <p className="section-label" style={{ margin:0 }}>Input Text</p>
            </div>
            <textarea
              value={text} onChange={e => setText(e.target.value)}
              rows={9}
              placeholder="Paste any Nepali English news paragraph here…"
              style={{
                width:'100%', padding:'16px 18px',
                fontSize:'0.88rem', lineHeight:1.7,
                background:'var(--surface-2)', border:'1.5px solid transparent',
                borderRadius:12, resize:'none', outline:'none',
                color:'var(--text)', transition:'all .18s',
              }}
              onFocus={e => { e.target.style.borderColor='var(--accent)'; e.target.style.background='white' }}
              onBlur={e => { e.target.style.borderColor='transparent'; e.target.style.background='var(--surface-2)' }}
            />
            <button onClick={run} disabled={loading || !text.trim()} className="btn-primary" style={{ width:'100%', marginTop:14, justifyContent:'center', borderRadius:12, padding:'13px' }}>
              {loading
                ? <><span className="anim-spin" style={{ width:14, height:14, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'white', borderRadius:'50%', display:'inline-block' }} /> Analyzing…</>
                : <><Zap size={14} /> Run ABSA Analysis</>
              }
            </button>
          </div>

          <div className="card anim-fade-up-2" style={{ padding:'20px 22px' }}>
            <p className="section-label" style={{ marginBottom:14 }}>Try an Example</p>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {EXAMPLES.map(ex => (
                <button key={ex.label} onClick={() => { setText(ex.text); setResult(null) }} style={{
                  textAlign:'left', background:'var(--surface-2)', border:'1.5px solid transparent',
                  borderRadius:11, padding:'12px 14px', cursor:'pointer', transition:'all .15s',
                  display:'flex', alignItems:'flex-start', gap:10,
                }}
                  onMouseEnter={e => { e.currentTarget.style.background='white'; e.currentTarget.style.borderColor='var(--accent)' }}
                  onMouseLeave={e => { e.currentTarget.style.background='var(--surface-2)'; e.currentTarget.style.borderColor='transparent' }}
                >
                  <ChevronRight size={12} style={{ color:'var(--accent)', flexShrink:0, marginTop:3 }} />
                  <div>
                    <p className="font-syne" style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--text)', marginBottom:3 }}>{ex.label}</p>
                    <p style={{ fontSize:'0.72rem', color:'var(--muted)', lineHeight:1.5, margin:0 }}>{ex.text.slice(0,90)}…</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Output panel ── */}
        <div className="card anim-fade-up-1" style={{ padding:'24px 26px', display:'flex', flexDirection:'column' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
            <div style={{
              width:32, height:32, borderRadius:9,
              background:'linear-gradient(135deg, var(--accent-3), var(--accent-2))',
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:'0 6px 16px -6px rgba(6,182,212,0.5)',
            }}>
              <Zap size={14} color="white" />
            </div>
            <p className="section-label" style={{ margin:0 }}>ABSA Output</p>
          </div>

          {!loading && !result && !error && (
            <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:14, padding:'40px 20px' }}>
              <div style={{
                width:64, height:64, borderRadius:18,
                background:'linear-gradient(135deg, var(--surface-2), white)',
                display:'flex', alignItems:'center', justifyContent:'center',
                border:'1px solid var(--border)',
              }}>
                <Zap size={26} style={{ color:'var(--accent)' }} />
              </div>
              <div style={{ textAlign:'center' }}>
                <p className="font-syne" style={{ fontWeight:700, fontSize:'0.95rem', marginBottom:6, color:'var(--text)' }}>
                  Awaiting Input
                </p>
                <p style={{ fontSize:'0.78rem', color:'var(--muted)', lineHeight:1.6, maxWidth:260 }}>
                  Paste a paragraph and click Analyze to see entity-level sentiment scores.
                </p>
              </div>
            </div>
          )}

          {loading && (
            <div style={{ flex:1, display:'flex', flexDirection:'column', gap:14, paddingTop:8 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                <span className="anim-spin" style={{ width:14, height:14, border:'2px solid var(--border)', borderTopColor:'var(--accent)', borderRadius:'50%', display:'inline-block' }} />
                <span style={{ fontSize:'0.78rem', color:'var(--muted)' }}>Running ABSA model…</span>
              </div>
              {[...Array(3)].map((_, i) => (
                <div key={i} style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <div className="skeleton" style={{ height:12, width:'40%', borderRadius:4 }} />
                    <div className="skeleton" style={{ height:12, width:'20%', borderRadius:4 }} />
                  </div>
                  <div className="skeleton" style={{ height:6, width:'100%', borderRadius:99 }} />
                  <div className="skeleton" style={{ height:10, width:'70%', borderRadius:4 }} />
                </div>
              ))}
            </div>
          )}

          {error && (
            <div style={{ display:'flex', alignItems:'flex-start', gap:10, fontSize:'0.85rem', color:'var(--neg)', background:'#fef2f2', border:'1px solid #fecaca', borderRadius:12, padding:'14px 18px' }}>
              <AlertCircle size={15} style={{ flexShrink:0, marginTop:1 }} />
              <div>
                <p style={{ fontWeight:700, marginBottom:3 }}>Analysis failed</p>
                <p style={{ fontSize:'0.74rem', opacity:.85 }}>{error}</p>
              </div>
            </div>
          )}

          {result && !loading && (
            <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
              <div style={{
                background:`linear-gradient(135deg, ${overallColor}15, ${overallColor}08)`,
                border:`1.5px solid ${overallColor}30`,
                borderRadius:14, padding:'18px 20px',
                display:'flex', alignItems:'center', justifyContent:'space-between',
              }}>
                <div>
                  <p style={{ fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--muted)', marginBottom:6 }}>Overall Sentiment</p>
                  <span className={sentimentPill(result.overall_sentiment)} style={{ fontSize:'0.75rem' }}>
                    {result.overall_sentiment}
                  </span>
                </div>
                <div style={{ textAlign:'right' }}>
                  <p style={{ fontSize:'0.65rem', color:'var(--muted)', marginBottom:6 }}>Entities Detected</p>
                  <div className="font-syne" style={{ fontSize:'1.8rem', fontWeight:800, color:'var(--text)', lineHeight:1 }}>{result.entities.length}</div>
                </div>
              </div>

              <div>
                <p className="section-label" style={{ marginBottom:16 }}>Entity-Level Breakdown</p>
                {result.entities.map(e => <SentimentChart key={e.name} entity={e} />)}
              </div>

              <div style={{
                display:'flex', alignItems:'center', gap:8,
                fontSize:'0.72rem', color:'var(--muted)', paddingTop:14,
                borderTop:'1px solid var(--border)',
              }}>
                <Clock size={12} />
                <span className="font-mono">Inference: {result.processing_ms}ms · distilbert-vantage-v1</span>
                <span style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:5, color:'#047857', fontWeight:600 }}>
                  <span style={{ width:6, height:6, borderRadius:'50%', background:'#10b981', display:'inline-block' }} />
                  Success
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Small Model Specs footer note ── */}
      <div className="card anim-fade-up-3" style={{ padding:'18px 22px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:18, flexWrap:'wrap' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{
              width:28, height:28, borderRadius:8,
              background:'linear-gradient(135deg, var(--accent), var(--accent-2))',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <Cpu size={13} color="white" />
            </div>
            <span style={{ fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--muted)' }}>Model Specs</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:14, flexWrap:'wrap' }}>
            {MODEL_INFO.map(({ label, value }) => (
              <div key={label} style={{ display:'flex', alignItems:'center', gap:6, fontSize:'0.72rem' }}>
                <span style={{ color:'var(--muted)' }}>{label}</span>
                <span className="font-mono" style={{ color:'var(--text)', background:'var(--surface-2)', padding:'3px 8px', borderRadius:5, fontWeight:600 }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
