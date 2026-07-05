import { NavLink } from 'react-router-dom'
import { LayoutDashboard, BarChart3, Zap, Newspaper, Activity } from 'lucide-react'

const NAV = [
  { to:'/dashboard', label:'Dashboard',    icon:LayoutDashboard, desc:'Clustered Events' },
  { to:'/bias',      label:'Bias Report',  icon:BarChart3,       desc:'Media Analysis' },
  { to:'/live',      label:'Live Analysis',icon:Zap,             desc:'ABSA Playground' },
]
const SOURCES = ['The Kathmandu Post','Republica','OnlineKhabar English','The Himalayan Times','My Republica','Setopati English']

export default function Sidebar() {
  return (
    <aside style={{
      width:230, flexShrink:0,
      background:'var(--surface-1)',
      borderRight:'1px solid var(--border)',
      display:'flex', flexDirection:'column',
      height:'100vh', position:'sticky', top:0, zIndex:100,
    }}>
      {/* Brand */}
      <div style={{
        height:58, display:'flex', alignItems:'center',
        padding:'0 20px', gap:9,
        borderBottom:'1px solid var(--border)',
      }}>
        <span style={{ width:8, height:8, borderRadius:'50%', background:'var(--accent)', display:'block' }} />
        <span style={{ fontWeight:700, fontSize:'1.05rem', color:'var(--text)', letterSpacing:'-0.015em' }}>Vantage</span>
        <span style={{ fontSize:'0.8rem', marginLeft:2 }}>🇳🇵</span>
      </div>

      {/* Status */}
      <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--border)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:7, fontSize:'0.7rem', color:'var(--muted)' }}>
          <span className="anim-pulse" style={{ width:5, height:5, borderRadius:'50%', background:'#2a7a4b', display:'inline-block' }} />
          Pipeline active · 7 sources
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding:'10px 10px', display:'flex', flexDirection:'column', gap:2 }}>
        {NAV.map(({ to, label, icon:Icon, desc }) => (
          <NavLink key={to} to={to} style={({ isActive }) => ({
            display:'flex', alignItems:'center', gap:10,
            padding:'10px 12px', borderRadius:10,
            fontSize:'0.82rem', fontWeight:500, textDecoration:'none',
            transition:'all .18s',
            background: isActive ? 'var(--surface-2)' : 'transparent',
            color: isActive ? 'var(--text)' : 'var(--muted)',
            borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
          })}>
            <Icon size={14} />
            <div>
              <div>{label}</div>
              <div style={{ fontSize:'0.62rem', opacity:0.6, marginTop:1 }}>{desc}</div>
            </div>
          </NavLink>
        ))}
      </nav>

      {/* Sources */}
      <div style={{ marginTop:'auto', padding:'16px 20px', borderTop:'1px solid var(--border)' }}>
        <p style={{ fontSize:'0.62rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--muted)', marginBottom:10, display:'flex', alignItems:'center', gap:6 }}>
          <Newspaper size={10} /> Tracked Sources
        </p>
        {SOURCES.map(s => (
          <div key={s} style={{ fontSize:'0.7rem', color:'var(--muted)', padding:'2px 0', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s}</div>
        ))}
      </div>
    </aside>
  )
}
