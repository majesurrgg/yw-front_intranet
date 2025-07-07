import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Postulants from './pages/Postulants';
import StaffVolunteers from './pages/StaffVolunteers';
import AdvisorVolunteers from './pages/AdvisorVolunteers';
import ResetPasswordPage from './pages/ResetPasswordPage';
import PostulantDetail from './pages/PostulantDetail';
import VoluntarioDetail from './pages/VoluntarioDetail';
import AdviserVolunteers from './pages/AdviserVolunteers';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route path="/" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="postulantes" element={<Postulants />} />
        <Route path="staff" element={<StaffVolunteers />} />
        <Route path="asesores" element={<AdvisorVolunteers />} />
        <Route path="postulants/:id" element={<PostulantDetail />} />
        <Route path="staff-volunteers/:id" element={<VoluntarioDetail />} />
        <Route path="adviser-volunteers" element={<AdviserVolunteers />} />
      </Route>
    </Routes>
  );
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
