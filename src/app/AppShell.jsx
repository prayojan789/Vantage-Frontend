import { Suspense } from 'react'
import { BrowserRouter, useRoutes } from 'react-router-dom'
import RouteErrorBoundary from '../components/RouteErrorBoundary.jsx'
import PageLoading from '../components/PageLoading.jsx'
import { appRoutes } from './routes.jsx'

function AppRoutes() {
  return useRoutes(appRoutes)
}

export default function AppShell() {
  return (
    <BrowserRouter>
      <RouteErrorBoundary>
        <Suspense fallback={<PageLoading label="Preparing the Vantage workspace…" />}>
          <AppRoutes />
        </Suspense>
      </RouteErrorBoundary>
    </BrowserRouter>
  )
}
