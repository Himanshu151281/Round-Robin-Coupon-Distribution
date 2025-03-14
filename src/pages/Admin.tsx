
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/admin/LoginForm';
import AdminDashboard from '@/components/admin/AdminDashboard';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const adminAuth = sessionStorage.getItem('isAdmin');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAdmin');
    setIsAuthenticated(false);
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated ? (
        <div className="flex flex-col min-h-screen">
          <header className="bg-white border-b border-gray-200 py-4">
            <div className="container mx-auto px-4 flex justify-between items-center">
              <h1 className="text-xl font-bold text-coupon-800">Coupon Distribution Admin</h1>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </header>
          <main className="flex-1">
            <AdminDashboard />
          </main>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen p-4">
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        </div>
      )}
    </div>
  );
};

export default Admin;
