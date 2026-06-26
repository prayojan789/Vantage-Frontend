import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import EventDetail from './pages/EventDetail.jsx'
import BiasReport from './pages/BiasReport.jsx'
import LiveAnalysis from './pages/LiveAnalysis.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/event/:id"  element={<EventDetail />} />
          <Route path="/bias"       element={<BiasReport />} />
          <Route path="/live"       element={<LiveAnalysis />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
