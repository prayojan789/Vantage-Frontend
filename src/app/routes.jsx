import { Navigate } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout.jsx'
import Dashboard from '../pages/Dashboard.jsx'
import EventDetail from '../pages/EventDetail.jsx'
import BiasReport from '../pages/BiasReport.jsx'
import LiveAnalysis from '../pages/LiveAnalysis.jsx'

export const appRoutes = [
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'event/:id', element: <EventDetail /> },
      { path: 'bias', element: <BiasReport /> },
      { path: 'live', element: <LiveAnalysis /> },
    ],
  },
]
