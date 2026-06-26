import { NavLink } from 'react-router-dom'
import { LayoutDashboard, BarChart3, Zap } from 'lucide-react'

const NAV = [
  { to:'/dashboard', label:'Dashboard',     icon:LayoutDashboard },
  { to:'/bias',      label:'Bias Report',   icon:BarChart3 },
  { to:'/live',      label:'Live Analysis', icon:Zap },
]

export default function Navbar() {
  return (
    <header style={{
      position:'sticky', top:0, zIndex:200,
      background:'rgba(245,240,232,0.9)',
      backdropFilter:'blur(16px)',
      WebkitBackdropFilter:'blur(16px)',
      borderBottom:'1.5px solid var(--border)',
    }}>
      <div style={{
        maxWidth:1280, margin:'0 auto',
        padding:'0 48px', height:58,
        display:'flex', alignItems:'center', gap:8,
      }}>

        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:8, marginRight:20 }}>
          <span style={{
            width:8, height:8, borderRadius:'50%',
            background:'var(--accent)', display:'inline-block',
          }} />
          <span className="font-syne" style={{
            fontWeight:800, fontSize:'1.1rem',
            letterSpacing:'-0.025em', color:'var(--ink)',
          }}>Vantage</span>
          <span style={{
            fontSize:'0.75rem', color:'var(--muted)',
            fontWeight:400, marginLeft:2,
          }}>🇳🇵 Nepal</span>
        </div>

        {/* Nav links */}
        <nav style={{ display:'flex', gap:2 }}>
          {NAV.map(({ to, label, icon:Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            } style={({ isActive }) => ({
              display:'flex', alignItems:'center', gap:6,
              padding:'7px 16px', borderRadius:99,
              fontSize:'0.82rem', fontWeight:isActive ? 600 : 500,
              textDecoration:'none',
            })}>
              <Icon size={13} />{label}
            </NavLink>
          ))}
        </nav>

        {/* Right: status + try demo */}
        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:20 }}>
          <div style={{ display:'flex', alignItems:'center', gap:7, fontSize:'0.72rem', color:'var(--muted)' }}>
            <span className="anim-pulse" style={{
              width:6, height:6, borderRadius:'50%',
              background:'#2a7a4b', display:'inline-block',
            }} />
            Pipeline active
          </div>
          <NavLink to="/live" style={{
            display:'flex', alignItems:'center', gap:6,
            background:'var(--ink)', color:'var(--paper)',
            borderRadius:99, padding:'8px 18px',
            fontSize:'0.78rem', fontWeight:600, letterSpacing:'0.01em',
            transition:'background .18s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--ink)'}
          >
            <Zap size={12} /> Try Live Demo
          </NavLink>
        </div>
      </div>
    </header>
  )
}
