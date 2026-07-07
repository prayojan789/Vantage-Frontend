/**
 * AIInsights.jsx
 * ──────────────
 * Vantage Nepal news intelligence frontend — AI Insights page.
 *
 * Surfaces AI-generated narrative insights about the current news
 * landscape as a vertical list of explainable insight cards. Each card
 * carries a title, 2–3 sentence narrative, a confidence pill, and
 * provenance metadata (events + article count).
 *
 * Insights are grounded in the existing MOCK_EVENTS dataset — no new
 * fixtures introduced.
 */
import { Lightbulb, TrendingUp, Users, AlertTriangle, BarChart3, Compass } from 'lucide-react'
import PageMetadata from '../components/PageMetadata.jsx'
import { Badge } from '../components/ui/Badge.jsx'

// ── Hardcoded insights (grounded in MOCK_EVENTS) ──
const INSIGHTS = [
  {
    icon: AlertTriangle,
    iconColor: '#ef4444',
    title: 'Coalition instability is the dominant theme',
    body:
      "Three of the six tracked events in the last 14 days revolve around coalition pressure, cabinet reshuffles, and party infighting. Coverage skews negative, suggesting the political narrative is anchored in instability rather than governance outcomes.",
    confidence: { tone:'high',     label:'High confidence' },
    provenance: 'Based on 3 events · 8 articles',
  },
  {
    icon: TrendingUp,
    iconColor: '#10b981',
    title: 'RSP is gaining disproportionately positive coverage',
    body:
      'OnlineKhabar English and The Himalayan Times frame RSP and Balen Shah in a positive light across multiple events. Mentions cluster around reformist framing rather than policy specifics, indicating a brand-driven rather than issue-driven trend.',
    confidence: { tone:'medium',   label:'Medium confidence' },
    provenance: 'Based on 2 events · 5 articles',
  },
  {
    icon: Users,
    iconColor: '#6366f1',
    title: 'KP Oli draws the most coverage — and the most negative sentiment',
    body:
      'Oli appears in cabinet-reshuffle, UML-congress, and coalition-stability stories. Sentiment is negative in two of those contexts and neutral-to-positive only in the procedural Congress coverage, which is consistent with an opposition-leader pattern.',
    confidence: { tone:'high',     label:'High confidence' },
    provenance: 'Based on 3 events · 9 articles',
  },
  {
    icon: BarChart3,
    iconColor: '#3b82f6',
    title: 'Macroeconomic coverage is sparse but uniformly positive',
    body:
      'Only one tracked event covers the GDP-revision story, but both covering outlets (My Republica, The Himalayan Times) report a positive tone. This is a thin sample, so the optimism should be interpreted as a single-event signal rather than a trend.',
    confidence: { tone:'low',      label:'Low confidence' },
    provenance: 'Based on 1 event · 2 articles',
  },
  {
    icon: Lightbulb,
    iconColor: '#a855f7',
    title: 'Border and constitutional stories stay neutral',
    body:
      'The Terai-border dispute and the Supreme-Court threshold ruling are both covered with neutral framing across multiple outlets. This suggests these topics have not yet been politicized in English-language coverage — a possible opening for sustained narrative tracking.',
    confidence: { tone:'medium',   label:'Medium confidence' },
    provenance: 'Based on 2 events · 7 articles',
  },
  {
    icon: Compass,
    iconColor: '#f59e0b',
    title: 'Media-house tone is converging, not diverging',
    body:
      "Across the past week, sentiment trajectories for Kathmandu Post, Republica, OnlineKhabar, and The Himalayan Times are not moving further apart. Today's daily-coverage variance is being driven by event selection, not by editorial tilt.",
    confidence: { tone:'medium',   label:'Medium confidence' },
    provenance: 'Based on 4 outlets · 30-day trend',
  },
]

// Map our insight confidence tones → Badge tones
const BADGE_TONE = {
  high:   'success',
  medium: 'warning',
  low:    'info',
}

export default function AIInsights() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:32 }}>
      <PageMetadata
        title="AI Insights | Vantage"
        description="Explainable, narrative AI insights about Nepal's current news landscape."
      />

      {/* ── Hero ── */}
      <div
        className="hero-gradient anim-fade-up anim-gradient"
        style={{
          borderRadius:24, padding:'40px 44px',
          position:'relative', overflow:'hidden',
          boxShadow:'0 24px 60px -24px rgba(11,16,32,0.45)',
        }}
      >
        <span className="orb orb-pink"   style={{ width:260, height:260, right:-40, top:-80 }} />
        <span className="orb orb-indigo" style={{ width:200, height:200, left:'-40px', bottom:'-60px' }} />
        <span className="orb orb-purple" style={{ width:160, height:160, right:'32%', top:'40%' }} />

        <div style={{ position:'relative', zIndex:1, maxWidth:600 }}>
          <p className="section-label" style={{ color:'#c7d2fe', marginBottom:12 }}>Explainable AI</p>
          <h1 className="font-serif" style={{ fontSize:'2.4rem', color:'var(--text)', lineHeight:1.05, letterSpacing:'-0.02em', margin:'0 0 12px' }}>
            AI <em style={{ fontStyle:'italic', color:'var(--accent)', fontWeight:600 }}>Insights</em>
          </h1>
          <p style={{ color:'rgba(248,250,252,0.7)', fontSize:'0.92rem', fontWeight:300, maxWidth:500, lineHeight:1.7 }}>
            Narrative summaries generated from clustered events, entity sentiment, and source tone.
            Every insight is grounded in the underlying articles — no black boxes.
          </p>
        </div>
      </div>

      {/* ── Insight cards ── */}
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        {INSIGHTS.map((ins, i) => {
          const Icon = ins.icon
          // anim-fade-up → anim-fade-up-1 → anim-fade-up-2 …
          const staggerClass = i === 0 ? 'anim-fade-up' : `anim-fade-up-${i}`
          return (
            <div
              key={ins.title}
              className={`card ${staggerClass}`}
              style={{ padding:'24px 28px', display:'flex', flexDirection:'column', gap:14 }}
            >
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:18, flexWrap:'wrap' }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:14, flex:1, minWidth:260 }}>
                  <div style={{
                    width:40, height:40, borderRadius:11, flexShrink:0,
                    background:`linear-gradient(135deg, ${ins.iconColor}22, ${ins.iconColor}10)`,
                    border:`1px solid ${ins.iconColor}30`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}>
                    <Icon size={18} style={{ color: ins.iconColor }} />
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <h3 className="font-syne" style={{
                      fontSize:'1.05rem', fontWeight:700,
                      color:'var(--text)', margin:'0 0 8px',
                      letterSpacing:'-0.01em',
                    }}>
                      {ins.title}
                    </h3>
                    <p style={{
                      fontSize:'0.85rem', color:'var(--text)', opacity:0.78,
                      lineHeight:1.65, margin:0,
                    }}>
                      {ins.body}
                    </p>
                  </div>
                </div>
                <Badge tone={BADGE_TONE[ins.confidence.tone]} className="shrink-0">
                  {ins.confidence.label}
                </Badge>
              </div>

              <div style={{
                display:'flex', alignItems:'center', gap:8,
                fontSize:'0.72rem', color:'var(--muted)',
                paddingTop:12, borderTop:'1px solid var(--border)',
              }}>
                <span
                  className="font-mono"
                  style={{
                    background:'var(--surface-2)',
                    padding:'3px 8px', borderRadius:5,
                    fontWeight:600, color:'var(--text)',
                  }}
                >
                  {ins.provenance}
                </span>
                <span style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:5 }}>
                  <Compass size={11} />
                  Generated from MOCK_EVENTS
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
