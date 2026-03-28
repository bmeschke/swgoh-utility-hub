import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { Toaster } from 'sonner'
import ProtectedRoute from '@/components/protected-route'
import AdminRoute from '@/components/admin-route'
import Nav from '@/components/nav'
import Footer from '@/components/footer'
import PackLibraryPage from '@/routes/PackLibraryPage'
import PackDetailPage from '@/routes/PackDetailPage'
import EvaluatePackPage from '@/routes/EvaluatePackPage'
import PlanningPage from '@/routes/PlanningPage'
import IncomePage from '@/routes/IncomePage'
import IncomeBetaPage from '@/routes/IncomeBetaPage'
import AdminItemsPage from '@/routes/AdminItemsPage'
import NotFoundPage from '@/routes/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
      <Routes>
        <Route path="/" element={<Navigate to="/pack-library" replace />} />
        <Route path="/pack-library" element={<PackLibraryPage />} />
        <Route path="/pack-library/:packId" element={<PackDetailPage />} />
        <Route path="/evaluate-pack" element={<EvaluatePackPage />} />
        <Route
          path="/income"
          element={
            <ProtectedRoute>
              <IncomePage />
            </ProtectedRoute>
          }
        />
        <Route path="/income-beta" element={<IncomeBetaPage />} />
        <Route
          path="/planning/*"
          element={
            <ProtectedRoute>
              <PlanningPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/items"
          element={
            <AdminRoute>
              <AdminItemsPage />
            </AdminRoute>
          }
        />
<Route path="*" element={<NotFoundPage />} />
      </Routes>
      </main>
      <Footer />
      </div>
      <Analytics />
      <Toaster richColors position="bottom-right" />
    </BrowserRouter>
  )
}
