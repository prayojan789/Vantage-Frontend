import { NavLink } from 'react-router-dom'
import { LayoutDashboard, BarChart3, Zap, Sparkles } from 'lucide-react'

const NAV = [
  { to:'/dashboard', label:'Dashboard',     icon:LayoutDashboard },
  { to:'/bias',      label:'Bias Report',   icon:BarChart3 },
  { to:'/live',      label:'Live Analysis', icon:Zap },
]

export default function Navbar() {
  return (
    <header className="glass" style={{ position:'sticky', top:0, zIndex:200, borderRadius:0 }}>
      <div className="container" style={{ height:64, display:'flex', alignItems:'center', gap:8 }}>

        {/* Brand */}
        <NavLink to="/dashboard" style={{ display:'flex', alignItems:'center', gap:10, marginRight:24, textDecoration:'none' }}>
          <span style={{ width:34, height:34, borderRadius:10, background:'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 60%)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 8px 20px -8px rgba(99,102,241,0.35)' }}>
            <Sparkles size={16} color="white" />
          </span>
          <div style={{ display:'flex', flexDirection:'column', lineHeight:1.1 }}>
            <span className="font-syne" style={{ fontWeight:800, fontSize:'1.1rem', letterSpacing:'-0.02em', color:'var(--text)' }}>
              Vantage
            </span>
            <span style={{ fontSize:'0.62rem', color:'var(--muted)', fontWeight:500, letterSpacing:'0.06em' }}>
              NEPAL · NEWS INTEL
            </span>
          </div>
        </NavLink>

        {/* Nav links */}
        <nav style={{ display:'flex', gap:4 }}>
          {NAV.map(({ to, label, icon:Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 18px', borderRadius:12, fontSize:'0.85rem', fontWeight:600, textDecoration:'none' }}>
              <Icon size={14} />{label}
            </NavLink>
          ))}
        </nav>

        {/* Right side */}
        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:16 }}>
          <div className="glass" style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 14px', borderRadius:99, fontSize:'0.72rem', fontWeight:600, color:'var(--muted)' }}>
            <span className="anim-pulse" style={{ width:8, height:8, borderRadius:'50%', background:'linear-gradient(135deg, #10b981, #06b6d4)', display:'inline-block' }} />
            Pipeline active · 7 sources
          </div>
          <NavLink to="/live" className="btn-primary" style={{ padding:'9px 18px' }}>
            <Zap size={13} /> Try Live Demo
          </NavLink>
        </div>
      </div>
    </header>
  )
}
