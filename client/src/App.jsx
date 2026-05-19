import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminUpload from './pages/AdminUpload';
import EmployeeDashboard from './pages/EmployeeDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import QuickPay from './pages/QuickPay';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/app" replace />;
  }

  return children;
};

const DashboardRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  
  switch (user.role) {
    case 'ADMIN': return <Navigate to="/app/admin" />;
    case 'EMPLOYEE': return <Navigate to="/app/employee" />;
    case 'CUSTOMER': return <Navigate to="/app/customer" />;
    default: return <Navigate to="/login" />;
  }
};

const NotFound = () => (
  <div className="h-screen flex flex-col items-center justify-center text-slate-800">
    <h1 className="text-6xl font-black">404</h1>
    <p className="text-xl font-medium mt-4">Page Not Found</p>
    <Navigate to="/" className="mt-8 text-blue-600 font-bold hover:underline" />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public landing page — serial number lookup & payment */}
          <Route path="/" element={<QuickPay />} />
          <Route path="/login" element={<Login />} />

          {/* Protected dashboard routes */}
          <Route path="/app" element={<MainLayout />}>
            <Route index element={<DashboardRedirect />} />

            {/* Admin Routes */}
            <Route path="admin" element={
              <ProtectedRoute roles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="admin/customers" element={
              <ProtectedRoute roles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="admin/upload" element={
              <ProtectedRoute roles={['ADMIN']}>
                <AdminUpload />
              </ProtectedRoute>
            } />

            {/* Employee Routes */}
            <Route path="employee" element={
              <ProtectedRoute roles={['ADMIN', 'EMPLOYEE']}>
                <EmployeeDashboard />
              </ProtectedRoute>
            } />

            {/* Customer Routes */}
            <Route path="customer" element={
              <ProtectedRoute roles={['CUSTOMER']}>
                <CustomerDashboard />
              </ProtectedRoute>
            } />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
