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
      background:'var(--sidebar-bg)',
      borderRight:'1px solid rgba(255,255,255,0.07)',
      display:'flex', flexDirection:'column',
      height:'100vh', position:'sticky', top:0, zIndex:100,
    }}>
      {/* Brand */}
      <div style={{
        height:58, display:'flex', alignItems:'center',
        padding:'0 20px', gap:9,
        borderBottom:'1px solid rgba(255,255,255,0.07)',
      }}>
        <span style={{ width:8, height:8, borderRadius:'50%', background:'var(--accent)', display:'block' }} />
        <span className="font-syne" style={{ fontWeight:800, fontSize:'1.05rem', color:'var(--paper)', letterSpacing:'-0.025em' }}>Vantage</span>
        <span style={{ fontSize:'0.8rem', marginLeft:2 }}>🇳🇵</span>
      </div>

      {/* Status */}
      <div style={{ padding:'14px 20px', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:7, fontSize:'0.7rem', color:'rgba(245,240,232,0.4)' }}>
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
            background: isActive ? 'rgba(200,66,58,0.18)' : 'transparent',
            color: isActive ? '#f5c6c4' : 'rgba(245,240,232,0.45)',
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
      <div style={{ marginTop:'auto', padding:'16px 20px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
        <p style={{ fontSize:'0.62rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(245,240,232,0.25)', marginBottom:10, display:'flex', alignItems:'center', gap:6 }}>
          <Newspaper size={10} /> Tracked Sources
        </p>
        {SOURCES.map(s => (
          <div key={s} style={{ fontSize:'0.7rem', color:'rgba(245,240,232,0.3)', padding:'2px 0', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s}</div>
        ))}
      </div>
    </aside>
  )
}
