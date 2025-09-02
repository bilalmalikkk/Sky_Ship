import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Login from '../components/LoginSimple';
import Dashboard from '../components/admin/Dashboard';
import CustomerManagement from '../components/admin/CustomerManagement';
import ShipmentManagement from '../components/admin/ShipmentManagement';
import UserManagement from '../components/admin/UserManagement';
import FileManagement from '../components/admin/FileManagement';

const Admin: React.FC = () => {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Debug logging
  console.log('Admin Component - Auth State:', { user, isAuthenticated, loading });

  useEffect(() => {
    console.log('Admin useEffect - checking auth:', { loading, isAuthenticated });
    // Don't redirect - let the component render the login form
    // The login form will be shown when !isAuthenticated
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    console.log('Admin: Showing loading spinner');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('Admin: User not authenticated, showing Login component');
    return <Login />;
  }

  console.log('Admin: User authenticated, showing dashboard');

  const handleLogout = () => {
    logout(() => {
      navigate('/');
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'employee':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Sky Ship Link</h1>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user?.role || '')}`}>
                {user?.role?.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user?.firstName || user?.username} {user?.lastName}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'customers', label: 'Customers' },
              { id: 'shipments', label: 'Shipments' },
              { id: 'users', label: 'Users' },
              { id: 'files', label: 'Files' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'customers' && <CustomerManagement />}
        {activeTab === 'shipments' && <ShipmentManagement />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'files' && <FileManagement />}
      </main>
    </div>
  );
};

export default Admin;