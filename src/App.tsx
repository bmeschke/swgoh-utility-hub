import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from '@/components/protected-route'
import AdminRoute from '@/components/admin-route'
import Nav from '@/components/nav'
import HomePage from '@/routes/HomePage'
import PackLibraryPage from '@/routes/PackLibraryPage'
import PackDetailPage from '@/routes/PackDetailPage'
import EvaluatePackPage from '@/routes/EvaluatePackPage'
import PlanningPage from '@/routes/PlanningPage'
import AdminItemsPage from '@/routes/AdminItemsPage'
import NotFoundPage from '@/routes/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pack-library" element={<PackLibraryPage />} />
        <Route path="/pack-library/:packId" element={<PackDetailPage />} />
        <Route path="/evaluate-pack" element={<EvaluatePackPage />} />
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
    </BrowserRouter>
  )
}
