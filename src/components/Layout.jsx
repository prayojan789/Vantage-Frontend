import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'

export default function Layout() {
  return (
    <div className="main-container">
      <Navbar />
      <main className="site-main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <span>© 2026 Vantage · Nepal News Intelligence</span>
        <span className="font-mono" style={{ letterSpacing:'0.04em' }}>v1.0 · distilbert-vantage-v1</span>
      </footer>
    </div>
  )
}
