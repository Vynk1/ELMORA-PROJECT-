import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { isAdmin } from '../lib/adminApi.js';

const AdminAccess = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [adminAccess, setAdminAccess] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkAdminAccess();
  }, [user]);

  const checkAdminAccess = async () => {
    try {
      if (!user) {
        setAdminAccess(false);
        setChecking(false);
        return;
      }

      const hasAccess = await isAdmin();
      setAdminAccess(hasAccess);
      console.log('🔍 Admin access check result:', hasAccess);
    } catch (error) {
      console.error('Admin access check error:', error);
      setAdminAccess(false);
    } finally {
      setChecking(false);
    }
  };

  const goToAdminDashboard = () => {
    console.log('🚀 Navigating to admin dashboard...');
    navigate('/admin');
  };

  if (!user) return null;

  if (checking) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-blue-100 border border-blue-300 rounded-lg p-3 shadow-md">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-blue-800 text-sm">Checking admin access...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!adminAccess) return null;

  return (
    <>
      {/* Fixed position admin banner */}
      <div className="fixed top-20 right-4 z-[9999]">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg p-4 shadow-xl border-2 border-white">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-xl">👑</span>
              <div className="text-white">
                <div className="text-sm font-bold">ADMIN ACCESS</div>
                <div className="text-xs opacity-90">{user.email}</div>
              </div>
            </div>
            <button
              onClick={goToAdminDashboard}
              className="bg-white text-indigo-600 px-4 py-2 rounded-md text-sm font-bold hover:bg-gray-100 transition-colors shadow-md w-full"
            >
              📊 OPEN ADMIN DASHBOARD
            </button>
          </div>
        </div>
      </div>
      
      {/* Also add a floating action button */}
      <div className="fixed bottom-4 right-4 z-[9998]">
        <button
          onClick={goToAdminDashboard}
          className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          title="Admin Dashboard"
        >
          <span className="text-lg">🛡️</span>
        </button>
      </div>
    </>
  );
};

export default AdminAccess;