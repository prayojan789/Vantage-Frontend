import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'

export default function Layout() {
  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', background:'var(--paper)' }}>
      <Navbar />
      <main style={{ flex:1, maxWidth:1280, width:'100%', margin:'0 auto', padding:'36px 48px 60px' }}>
        <Outlet />
      </main>
    </div>
  )
}
