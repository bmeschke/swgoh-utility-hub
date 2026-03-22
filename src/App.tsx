import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from '@/components/protected-route'
import HomePage from '@/routes/HomePage'
import PackLibraryPage from '@/routes/PackLibraryPage'
import EvaluatePackPage from '@/routes/EvaluatePackPage'
import PlanningPage from '@/routes/PlanningPage'
import NotFoundPage from '@/routes/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pack-library" element={<PackLibraryPage />} />
        <Route path="/evaluate-pack" element={<EvaluatePackPage />} />
        <Route
          path="/planning/*"
          element={
            <ProtectedRoute>
              <PlanningPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
