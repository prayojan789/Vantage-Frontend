import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'

export default function Layout() {
  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column' }}>
      <Navbar />
      <main style={{ flex:1, maxWidth:1320, width:'100%', margin:'0 auto', padding:'40px 40px 80px', position:'relative', zIndex:1 }}>
        <Outlet />
      </main>
      <footer style={{
        maxWidth: 1320, width:'100%', margin:'0 auto',
        padding:'24px 40px 32px',
        display:'flex', justifyContent:'space-between', alignItems:'center',
        fontSize:'0.7rem', color:'var(--muted)',
        borderTop: '1px solid var(--border)',
        position:'relative', zIndex:1,
      }}>
        <span>© 2026 Vantage · Nepal News Intelligence</span>
        <span className="font-mono" style={{ letterSpacing:'0.04em' }}>v1.0 · distilbert-vantage-v1</span>
      </footer>
    </div>
  )
}
