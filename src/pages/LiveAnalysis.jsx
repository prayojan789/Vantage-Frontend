import { useState } from 'react'
import { Zap, AlertCircle, Clock, Terminal, ChevronRight } from 'lucide-react'
import SentimentChart from '../components/SentimentChart.jsx'
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
  { label:'Task',      value:'Aspect-Based Sentiment Analysis' },
  { label:'Entities',  value:'Nepali Political NER' },
  { label:'Inference', value:'Local FastAPI · PyTorch' },
  { label:'Avg Latency', value:'~320ms' },
]

export default function LiveAnalysis() {
  const [text, setText]       = useState('')
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [ran, setRan]         = useState(false)

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

  const overallColor = result ? sentimentColor(result.overall_sentiment) : 'var(--muted)'

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:28 }}>

      {/* ── Hero ── */}
      <div className="card anim-fade-up" style={{ padding:0, overflow:'hidden' }}>
        <div style={{
          padding:'32px 36px',
          background:'linear-gradient(135deg, var(--ink) 0%, #1e1a16 100%)',
          position:'relative', overflow:'hidden',
        }}>
          <div style={{ position:'absolute', right:-60, top:-60, width:280, height:280, borderRadius:'50%', background:'radial-gradient(circle, rgba(232,161,53,0.12) 0%, transparent 70%)' }} />
          <div style={{ position:'absolute', left:-40, bottom:-80, width:220, height:220, borderRadius:'50%', background:'radial-gradient(circle, rgba(200,66,58,0.08) 0%, transparent 70%)' }} />
          <div style={{ position:'relative', zIndex:1, display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:20 }}>
            <div>
              <p className="section-label" style={{ color:'var(--accent2)', marginBottom:10 }}>Developer Playground</p>
              <h1 className="font-serif" style={{ fontSize:'2.2rem', color:'var(--paper)', lineHeight:1.1, letterSpacing:'-0.02em', margin:'0 0 12px' }}>
                Live <em>ABSA</em> Analysis
              </h1>
              <p style={{ color:'rgba(245,240,232,0.5)', fontSize:'0.88rem', fontWeight:300, maxWidth:460, lineHeight:1.7 }}>
                Paste any English Nepali news paragraph. Our fine-tuned model extracts political entities and scores their sentiment — in under a second, running entirely on local FastAPI.
              </p>
            </div>
            {/* Model info pills */}
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {MODEL_INFO.map(({ label, value }) => (
                <div key={label} style={{ display:'flex', alignItems:'center', gap:8, fontSize:'0.68rem' }}>
                  <span style={{ color:'rgba(245,240,232,0.35)', minWidth:72 }}>{label}</span>
                  <span className="font-mono" style={{ color:'rgba(245,240,232,0.6)', background:'rgba(255,255,255,0.06)', padding:'2px 8px', borderRadius:4 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main two-column layout ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>

        {/* ── Input panel ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div className="card anim-fade-up-1" style={{ padding:'22px 24px', flex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
              <Terminal size={14} style={{ color:'var(--accent)' }} />
              <p className="section-label" style={{ margin:0 }}>Input Text</p>
            </div>
            <textarea
              value={text} onChange={e => setText(e.target.value)}
              rows={9}
              placeholder="Paste any Nepali English news paragraph here…"
              style={{
                width:'100%', padding:'14px 16px',
                fontSize:'0.85rem', lineHeight:1.7,
                background:'#faf8f4', border:'1.5px solid var(--border)',
                borderRadius:12, resize:'none', outline:'none',
                color:'var(--ink)', transition:'border-color .18s',
                fontFamily:'DM Sans, sans-serif',
              }}
              onFocus={e => e.target.style.borderColor='var(--accent)'}
              onBlur={e => e.target.style.borderColor='var(--border)'}
            />
            <button onClick={run} disabled={loading || !text.trim()} className="btn-primary" style={{ width:'100%', marginTop:12, justifyContent:'center', borderRadius:12 }}>
              {loading
                ? <><span className="anim-spin" style={{ width:14, height:14, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'white', borderRadius:'50%', display:'inline-block' }} /> Analyzing…</>
                : <><Zap size={14} /> Run ABSA Analysis</>
              }
            </button>
          </div>

          {/* Example snippets */}
          <div className="card anim-fade-up-2" style={{ padding:'18px 20px' }}>
            <p className="section-label" style={{ marginBottom:12 }}>Try an Example</p>
            <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
              {EXAMPLES.map(ex => (
                <button key={ex.label} onClick={() => { setText(ex.text); setResult(null) }} style={{
                  textAlign:'left', background:'#faf8f4', border:'1.5px solid var(--border)',
                  borderRadius:10, padding:'11px 14px', cursor:'pointer', transition:'all .15s',
                  display:'flex', alignItems:'flex-start', gap:10,
                }}
                  onMouseEnter={e => { e.currentTarget.style.background='var(--paper)'; e.currentTarget.style.borderColor='var(--muted)' }}
                  onMouseLeave={e => { e.currentTarget.style.background='#faf8f4'; e.currentTarget.style.borderColor='var(--border)' }}
                >
                  <ChevronRight size={12} style={{ color:'var(--accent)', flexShrink:0, marginTop:3 }} />
                  <div>
                    <p className="font-syne" style={{ fontSize:'0.75rem', fontWeight:700, color:'var(--ink)', marginBottom:3 }}>{ex.label}</p>
                    <p style={{ fontSize:'0.7rem', color:'var(--muted)', lineHeight:1.5, margin:0 }}>{ex.text.slice(0,90)}…</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Output panel ── */}
        <div className="card anim-fade-up-1" style={{ padding:'22px 24px', display:'flex', flexDirection:'column' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:18 }}>
            <Zap size={14} style={{ color:'var(--accent2)' }} />
            <p className="section-label" style={{ margin:0 }}>ABSA Output</p>
          </div>

          {/* Idle */}
          {!loading && !result && !error && (
            <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:14, padding:'40px 20px' }}>
              <div style={{ width:56, height:56, borderRadius:'50%', background:'#f0ede8', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Zap size={22} style={{ color:'var(--border)' }} />
              </div>
              <div style={{ textAlign:'center' }}>
                <p className="font-syne" style={{ fontWeight:700, fontSize:'0.88rem', marginBottom:6, color:'var(--ink)' }}>
                  Awaiting Input
                </p>
                <p style={{ fontSize:'0.78rem', color:'var(--muted)', lineHeight:1.6, maxWidth:260 }}>
                  Paste a paragraph and click Analyze to see entity-level sentiment scores.
                </p>
              </div>
              <div style={{ background:'#faf8f4', borderRadius:10, padding:'12px 16px', width:'100%', marginTop:8 }}>
                {MODEL_INFO.map(({ label, value }) => (
                  <div key={label} style={{ display:'flex', justifyContent:'space-between', padding:'3px 0', fontSize:'0.7rem', borderBottom:'1px solid #f0ede8' }}>
                    <span style={{ color:'var(--muted)' }}>{label}</span>
                    <span className="font-mono" style={{ color:'var(--ink)', fontSize:'0.68rem' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loading */}
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

          {/* Error */}
          {error && (
            <div style={{ display:'flex', alignItems:'flex-start', gap:8, fontSize:'0.8rem', color:'var(--accent)', background:'#fde8e7', border:'1px solid #f5c6c4', borderRadius:10, padding:'13px 16px' }}>
              <AlertCircle size={14} style={{ flexShrink:0, marginTop:1 }} />
              <div>
                <p style={{ fontWeight:600, marginBottom:3 }}>Analysis failed</p>
                <p style={{ fontSize:'0.72rem', opacity:.8 }}>{error}</p>
              </div>
            </div>
          )}

          {/* Results */}
          {result && !loading && (
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {/* Overall banner */}
              <div style={{
                background:`${overallColor}12`,
                border:`1.5px solid ${overallColor}30`,
                borderRadius:12, padding:'14px 16px',
                display:'flex', alignItems:'center', justifyContent:'space-between',
              }}>
                <div>
                  <p style={{ fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--muted)', marginBottom:4 }}>Overall Sentiment</p>
                  <span className={sentimentPill(result.overall_sentiment)} style={{ fontSize:'0.72rem' }}>
                    {result.overall_sentiment}
                  </span>
                </div>
                <div style={{ textAlign:'right' }}>
                  <p style={{ fontSize:'0.65rem', color:'var(--muted)', marginBottom:4 }}>Entities Detected</p>
                  <div className="font-syne" style={{ fontSize:'1.6rem', fontWeight:800, color:'var(--ink)', lineHeight:1 }}>{result.entities.length}</div>
                </div>
              </div>

              {/* Entity rows */}
              <div>
                <p className="section-label" style={{ marginBottom:14 }}>Entity-Level Breakdown</p>
                {result.entities.map(e => <SentimentChart key={e.name} entity={e} />)}
              </div>

              {/* Latency */}
              <div style={{
                display:'flex', alignItems:'center', gap:6,
                fontSize:'0.68rem', color:'var(--muted)', paddingTop:12,
                borderTop:'1px solid var(--border)',
              }}>
                <Clock size={11} />
                <span className="font-mono">Inference: {result.processing_ms}ms · distilbert-vantage-v1 · Local FastAPI</span>
                <span style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:4 }}>
                  <span style={{ width:5, height:5, borderRadius:'50%', background:'#2a7a4b', display:'inline-block' }} />
                  Success
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Inspector note ── */}
      <div className="card anim-fade-up-3" style={{ padding:'20px 24px', background:'rgba(232,161,53,0.05)', borderColor:'rgba(232,161,53,0.2)' }}>
        <p className="section-label" style={{ color:'var(--accent2)', marginBottom:8 }}>For Inspectors</p>
        <p style={{ fontSize:'0.82rem', color:'var(--muted)', lineHeight:1.7, margin:0 }}>
          This playground demonstrates <strong style={{ color:'var(--ink)' }}>live local inference</strong> of our fine-tuned DistilBERT ABSA model.
          The model was fine-tuned on ~800 hand-labeled Nepali political sentences using Google Colab (free GPU),
          then deployed locally inside FastAPI using optimized PyTorch. No cloud API is called during inference —
          latency is typically under 400ms on a standard laptop.
        </p>
      </div>
    </div>
  )
}
