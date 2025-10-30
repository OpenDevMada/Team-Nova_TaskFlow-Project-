import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ROUTES } from '@/utils/constant';
import NotFound from "./pages/common/NotFound";
import { AuthProvider } from "./hooks/useAuth";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>

        <Routes>
          <Route path={ROUTES.HOME} element={<Login />} />
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />

          {/* Admin Routes */}
          <Route
            path="/tasks/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
