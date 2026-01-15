// src/App.js
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import AppNavbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing'; 
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import AdminTableManagement from './pages/AdminTableManagement';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="d-flex flex-column min-vh-100">
          <AppNavbar />
          
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Landing />} />  
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/customer" element={
                <ProtectedRoute role="customer">
                  <CustomerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/tables" element={
  <ProtectedRoute role="admin">
    <AdminTableManagement />
  </ProtectedRoute>
} />
              <Route path="*" element={<NotFound />} />

            </Routes>
          </main>
          
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

function ProtectedRoute({ children, role }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/customer'} />;
  }

  return children;
}

export default App;
