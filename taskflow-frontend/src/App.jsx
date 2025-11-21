import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import { ROUTES, ROLES } from '@/utils/constants';
import { ToastContainer } from 'react-toastify';
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/Dashboard";
import NotFound from "./pages/common/NotFound";
import Unauthorized from "./pages/common/Unauthorized";
import Tasks from "./pages/Tasks/Tasks";
import Projects from "./pages/Projects/Projects";
import ProjectDetail from "./pages/Projects/ProjectDetail";
import EditProject from "./pages/Projects/EditProject";
import ProjectTasks from "./pages/Tasks/ProjectTasks";

const App = () => {
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
        {/* Pages publiques accessibles uniquement si non connecté */}
        <Route
          path={ROUTES.HOME}
          element={
            <ProtectedRoute redirectIfAuthenticated>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.LOGIN}
          element={
            <ProtectedRoute redirectIfAuthenticated>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.REGISTER}
          element={
            <ProtectedRoute redirectIfAuthenticated>
              <Register />
            </ProtectedRoute>
          }
        />

        {/* Dashboard accessible après connexion */}
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.TASKS}
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.PROJECTS}
          element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          }
        />

        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/projects/:id/edit" element={<EditProject />} />
        <Route path="/projects/:projectId/tasks" element={<ProjectTasks />} />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        <Route path={ROUTES.UNAUTHORIZED} element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
