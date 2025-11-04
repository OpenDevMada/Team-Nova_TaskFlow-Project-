import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from "./pages/auth/Login"
import { ROUTES, ROLES } from '@/utils/constants';
import { ToastContainer } from 'react-toastify';
import AdminDashboard from "./pages/Dashboard";

function App() {

  return (
    <Router>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

        <Routes>
          <Route path={ROUTES.HOME} element={<Login />} />
          <Route path={ROUTES.LOGIN} element={<Login />} />
          {/* <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} /> */}

          {/* Admin Routes */}
          {/* <Route
            path="/admin/*"
            element={
                <AdminDashboard />
            }
          /> */}

          <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
  )
}

export default App
