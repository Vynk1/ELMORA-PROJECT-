import React, { useState, useEffect, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  isAdmin
} from '../lib/adminApi';
import { useAuth } from '../contexts/AuthContext.jsx';

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [adminAccess, setAdminAccess] = useState(null);
  const [loading, setLoading] = useState(false); // Start with false
  const [activeTab, setActiveTab] = useState('analytics');
  
  // Chart colors
  const colors = {
    primary: '#8b5cf6',
    secondary: '#06b6d4',
    accent: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444'
  };
  
  // Hardcoded mock data for demonstration
  const analytics = {
    totalUsers: 42,
    totalJournals: 128,
    totalMeditationMinutes: 340,
    totalMeditationSessions: 67,
    activeUsersLast7Days: 18
  };

  const journalData = [
    { week: '8/26', journals: 8 },
    { week: '9/2', journals: 12 },
    { week: '9/9', journals: 15 },
    { week: '9/16', journals: 11 },
    { week: '9/23', journals: 18 },
    { week: '9/30', journals: 14 },
    { week: '10/7', journals: 20 },
    { week: '10/14', journals: 16 },
    { week: '10/21', journals: 22 },
    { week: '10/28', journals: 19 },
    { week: '11/4', journals: 25 },
    { week: '11/11', journals: 23 }
  ];

  const meditationData = [
    { week: '8/26', sessions: 5, minutes: 45 },
    { week: '9/2', sessions: 8, minutes: 72 },
    { week: '9/9', sessions: 6, minutes: 58 },
    { week: '9/16', sessions: 10, minutes: 95 },
    { week: '9/23', sessions: 7, minutes: 63 },
    { week: '9/30', sessions: 12, minutes: 108 },
    { week: '10/7', sessions: 9, minutes: 81 },
    { week: '10/14', sessions: 14, minutes: 126 },
    { week: '10/21', sessions: 11, minutes: 99 },
    { week: '10/28', sessions: 16, minutes: 144 },
    { week: '11/4', sessions: 13, minutes: 117 },
    { week: '11/11', sessions: 18, minutes: 162 }
  ];

  const userGrowthData = [
    { week: '8/26', newUsers: 3, totalUsers: 8 },
    { week: '9/2', newUsers: 4, totalUsers: 12 },
    { week: '9/9', newUsers: 2, totalUsers: 14 },
    { week: '9/16', newUsers: 5, totalUsers: 19 },
    { week: '9/23', newUsers: 3, totalUsers: 22 },
    { week: '9/30', newUsers: 4, totalUsers: 26 },
    { week: '10/7', newUsers: 6, totalUsers: 32 },
    { week: '10/14', newUsers: 3, totalUsers: 35 },
    { week: '10/21', newUsers: 4, totalUsers: 39 },
    { week: '10/28', newUsers: 2, totalUsers: 41 },
    { week: '11/4', newUsers: 5, totalUsers: 46 },
    { week: '11/11', newUsers: 3, totalUsers: 49 }
  ];

  const topUsers = [
    {
      id: '1',
      name: 'Sarah Connor',
      joinDate: '8/15/2024',
      journalEntries: 28,
      meditationSessions: 22,
      meditationMinutes: 264,
      totalActivity: 50
    },
    {
      id: '2', 
      name: 'Alex Rodriguez',
      joinDate: '8/20/2024',
      journalEntries: 24,
      meditationSessions: 18,
      meditationMinutes: 216,
      totalActivity: 42
    },
    {
      id: '3',
      name: 'Emma Thompson',
      joinDate: '8/25/2024',
      journalEntries: 20,
      meditationSessions: 15,
      meditationMinutes: 180,
      totalActivity: 35
    },
    {
      id: '4',
      name: 'Michael Chen',
      joinDate: '9/1/2024',
      journalEntries: 18,
      meditationSessions: 14,
      meditationMinutes: 168,
      totalActivity: 32
    },
    {
      id: '5',
      name: 'Luna Martinez',
      joinDate: '9/5/2024',
      journalEntries: 16,
      meditationSessions: 12,
      meditationMinutes: 144,
      totalActivity: 28
    },
    {
      id: '6',
      name: 'David Johnson',
      joinDate: '9/10/2024',
      journalEntries: 14,
      meditationSessions: 11,
      meditationMinutes: 132,
      totalActivity: 25
    },
    {
      id: '7',
      name: 'Sophia Williams',
      joinDate: '9/15/2024',
      journalEntries: 12,
      meditationSessions: 9,
      meditationMinutes: 108,
      totalActivity: 21
    },
    {
      id: '8',
      name: 'James Wilson',
      joinDate: '9/20/2024',
      journalEntries: 10,
      meditationSessions: 8,
      meditationMinutes: 96,
      totalActivity: 18
    },
    {
      id: '9',
      name: 'Olivia Garcia',
      joinDate: '9/25/2024',
      journalEntries: 9,
      meditationSessions: 7,
      meditationMinutes: 84,
      totalActivity: 16
    },
    {
      id: '10',
      name: 'Noah Brown',
      joinDate: '10/1/2024',
      journalEntries: 8,
      meditationSessions: 6,
      meditationMinutes: 72,
      totalActivity: 14
    }
  ];

  // Check admin access
  useEffect(() => {
    checkAdminAccess();
  }, [user]);

  const checkAdminAccess = async () => {
    try {
      if (!user) {
        setAdminAccess(false);
        return;
      }
      
      const hasAccess = await isAdmin();
      setAdminAccess(hasAccess);
    } catch (err) {
      console.error('Error checking admin access:', err);
      setAdminAccess(false);
    }
  };

  const refreshData = () => {
    // Simulate refresh with a brief loading state
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  // Show loading while checking auth
  if (authLoading || adminAccess === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <div className="text-gray-600">Checking access...</div>
        </div>
      </div>
    );
  }

  // Redirect if not admin
  if (!adminAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  const pieColors = [colors.primary, colors.secondary, colors.accent, colors.warning, colors.danger];

  const MetricCard = ({ title, value, subtitle, icon, color = 'bg-white' }) => (
    <div className={`${color} rounded-2xl p-6 shadow-sm border border-gray-100`}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl">{icon}</div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-800">{value}</div>
          <div className="text-sm text-gray-600">{title}</div>
        </div>
      </div>
      {subtitle && (
        <div className="text-xs text-gray-500 mt-2">{subtitle}</div>
      )}
    </div>
  );

  const TabButton = ({ id, label, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`px-6 py-3 rounded-2xl font-medium transition-all ${
        isActive
          ? 'bg-indigo-500 text-white shadow-md'
          : 'bg-white text-gray-600 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-light text-gray-800 mb-2">
              📊 Admin Dashboard
            </h1>
            <p className="text-lg text-gray-600">
              Analytics and insights for Elmora
            </p>
          </div>
          <button
            onClick={refreshData}
            disabled={loading}
            className="bg-indigo-500 text-white px-6 py-3 rounded-2xl font-medium hover:bg-indigo-600 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Loading...' : '🔄 Refresh'}
          </button>
        </div>


        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-8 bg-gray-100 p-2 rounded-2xl w-fit">
          <TabButton
            id="overview"
            label="📈 Overview"
            isActive={activeTab === 'overview'}
            onClick={setActiveTab}
          />
          <TabButton
            id="analytics"
            label="📊 Analytics"
            isActive={activeTab === 'analytics'}
            onClick={setActiveTab}
          />
          <TabButton
            id="users"
            label="👥 Users"
            isActive={activeTab === 'users'}
            onClick={setActiveTab}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            <span className="ml-3 text-gray-600">Loading analytics...</span>
          </div>
        )}

        {!loading && (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <MetricCard
                    title="Total Users"
                    value={analytics.totalUsers?.toLocaleString() || '0'}
                    subtitle="Registered accounts"
                    icon="👥"
                    color="bg-gradient-to-br from-blue-50 to-indigo-100"
                  />
                  <MetricCard
                    title="Journal Entries"
                    value={analytics.totalJournals?.toLocaleString() || '0'}
                    subtitle="Total entries created"
                    icon="📖"
                    color="bg-gradient-to-br from-green-50 to-emerald-100"
                  />
                  <MetricCard
                    title="Meditation Minutes"
                    value={analytics.totalMeditationMinutes?.toLocaleString() || '0'}
                    subtitle={`${analytics.totalMeditationSessions || 0} total sessions`}
                    icon="🧘"
                    color="bg-gradient-to-br from-purple-50 to-violet-100"
                  />
                  <MetricCard
                    title="Active Users"
                    value={analytics.activeUsersLast7Days || '0'}
                    subtitle="Last 7 days"
                    icon="⚡"
                    color="bg-gradient-to-br from-orange-50 to-amber-100"
                  />
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Stats</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-indigo-600">
                        {analytics.totalUsers > 0 ? 
                          Math.round((analytics.activeUsersLast7Days || 0) / analytics.totalUsers * 100) : 0}%
                      </div>
                      <div className="text-sm text-gray-600">Weekly Active Rate</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {analytics.totalUsers > 0 ? 
                          Math.round((analytics.totalJournals || 0) / analytics.totalUsers * 100) / 100 : 0}
                      </div>
                      <div className="text-sm text-gray-600">Avg Entries per User</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">
                        {analytics.totalMeditationSessions > 0 ? 
                          Math.round((analytics.totalMeditationMinutes || 0) / analytics.totalMeditationSessions) : 0}
                      </div>
                      <div className="text-sm text-gray-600">Avg Session Length (min)</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-600">
                        {analytics.totalUsers > 0 ? 
                          Math.round((analytics.totalMeditationSessions || 0) / analytics.totalUsers * 100) / 100 : 0}
                      </div>
                      <div className="text-sm text-gray-600">Avg Sessions per User</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-8">
                {console.log('Analytics tab rendering, userGrowthData:', userGrowthData)}
                {console.log('Colors object:', colors)}
                
                {/* Debug Info */}
                <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-yellow-800">Debug Info:</h4>
                  <p className="text-yellow-700">User Growth Data Length: {userGrowthData?.length || 0}</p>
                  <p className="text-yellow-700">Journal Data Length: {journalData?.length || 0}</p>
                  <p className="text-yellow-700">Meditation Data Length: {meditationData?.length || 0}</p>
                  <p className="text-yellow-700">Colors Primary: {colors?.primary || 'undefined'}</p>
                </div>

                {/* User Growth Chart */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">User Growth (Last 12 Weeks)</h3>
                  <div className="h-80">
                    {userGrowthData && userGrowthData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={userGrowthData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="week" 
                            stroke="#666"
                            fontSize={12}
                          />
                          <YAxis stroke="#666" fontSize={12} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#fff',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px'
                            }}
                          />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="totalUsers"
                            stroke={colors.primary}
                            fill={colors.primary}
                            fillOpacity={0.3}
                            name="Total Users"
                          />
                          <Area
                            type="monotone"
                            dataKey="newUsers"
                            stroke={colors.secondary}
                            fill={colors.secondary}
                            fillOpacity={0.3}
                            name="New Users"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-gray-500">No user growth data available</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Journal and Meditation Charts */}
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Journal Activity */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Journal Activity</h3>
                    <div className="h-64">
                      {journalData && journalData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={journalData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis 
                              dataKey="week" 
                              stroke="#666"
                              fontSize={12}
                            />
                            <YAxis stroke="#666" fontSize={12} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px'
                              }}
                            />
                            <Bar
                              dataKey="journals"
                              fill={colors.accent}
                              name="Journal Entries"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-gray-500">No journal data available</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Meditation Activity */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Meditation Activity</h3>
                    <div className="h-64">
                      {meditationData && meditationData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={meditationData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis 
                              dataKey="week" 
                              stroke="#666"
                              fontSize={12}
                            />
                            <YAxis stroke="#666" fontSize={12} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px'
                              }}
                            />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="sessions"
                              stroke={colors.primary}
                              strokeWidth={3}
                              dot={{ fill: colors.primary, strokeWidth: 2, r: 4 }}
                              name="Sessions"
                            />
                            <Line
                              type="monotone"
                              dataKey="minutes"
                              stroke={colors.warning}
                              strokeWidth={3}
                              dot={{ fill: colors.warning, strokeWidth: 2, r: 4 }}
                              name="Total Minutes"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-gray-500">No meditation data available</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-8">
                {/* Top Active Users */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Most Active Users</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Rank</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Journal Entries</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Meditation Sessions</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Meditation Minutes</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Total Activity</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topUsers.map((user, index) => (
                          <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <span className="text-lg font-bold text-gray-600">#{index + 1}</span>
                                {index < 3 && (
                                  <span className="ml-2">
                                    {index === 0 && '🥇'}
                                    {index === 1 && '🥈'}
                                    {index === 2 && '🥉'}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-medium text-gray-800">{user.name}</div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-center">
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                                  {user.journalEntries}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-center">
                                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm">
                                  {user.meditationSessions}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-center">
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                                  {user.meditationMinutes}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-center">
                                <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm font-medium">
                                  {user.totalActivity}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">{user.joinDate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {topUsers.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No users found
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;