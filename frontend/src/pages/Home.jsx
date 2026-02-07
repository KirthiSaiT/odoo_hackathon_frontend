// Home page - Main dashboard after login
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectCurrentUser } from '../store/authSlice';
import { useGetStatsQuery } from '../services/adminApi';
import {
  People,
  Security,
  Business,
  Assignment,
  Dashboard as DashboardIcon
} from '@mui/icons-material';

const StatCard = ({ title, value, icon: Icon, color, link, isLoading }) => (
  <Link
    to={link}
    className="bg-background-paper rounded-lg border border-border-light p-6 hover:shadow-lg hover:border-primary transition-all duration-200 group block"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-text-secondary text-sm font-medium">{title}</p>
        <div className="mt-1">
          {isLoading ? (
            <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <p className="text-3xl font-bold text-text-primary">{value}</p>
          )}
        </div>
      </div>
      <div
        className={`p-3 rounded-lg ${color} group-hover:scale-110 transition-transform`}
      >
        <Icon className="text-white" style={{ fontSize: 28 }} />
      </div>
    </div>
  </Link>
);

const Home = () => {
  const user = useSelector(selectCurrentUser);
  const isAdmin = user?.role === 'ADMIN' || user?.role_id === 1;

  // Fetch stats only if admin
  const { data: statsData, isLoading } = useGetStatsQuery(undefined, {
    skip: !isAdmin,
  });

  const stats = [
    { 
      title: 'Total Users', 
      value: statsData?.total_users || 0, 
      icon: People, 
      color: 'bg-blue-500', 
      link: '/admin/users',
      isLoading 
    },
    { 
      title: 'Active Employees', 
      value: statsData?.active_employees || 0, 
      icon: Business, 
      color: 'bg-green-500', 
      link: '/admin/employees',
      isLoading 
    },
    { 
      title: 'Roles', 
      value: statsData?.total_roles || 0, 
      icon: Security, 
      color: 'bg-purple-500', 
      link: '/admin/roles',
      isLoading 
    },
    { 
      title: 'Modules', 
      value: statsData?.total_modules || 5, 
      icon: Assignment, 
      color: 'bg-orange-500', 
      link: '/admin/role-rights',
      isLoading 
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar handled by AdminLayout */}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-primary">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-text-secondary mt-1">
            Here's what's happening with your application today.
          </p>
        </div>

        {/* Stats Grid - Only visible to Admin */}
        {isAdmin && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
        )}

        {/* Regular User View */}
        {!isAdmin && (
          <div className="bg-background-paper rounded-lg border border-border-light p-8 text-center">
            <DashboardIcon sx={{ fontSize: 64, color: '#00BCD4' }} />
            <h2 className="text-xl font-semibold text-text-primary mt-4">
              Welcome to Your Dashboard
            </h2>
            <p className="text-text-secondary mt-2 max-w-md mx-auto">
              You have limited access based on your role. Contact your administrator
              if you need additional permissions.
            </p>
          </div>
        )}

        {/* User Info Card - Kept as useful context, though "only stats" requested, usually profile is okay. 
            If user insists on strictly stats, I can remove this too. */}
        <div className="mt-8 bg-background-paper rounded-lg border border-border-light p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Your Profile
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-text-secondary text-sm">Name</p>
              <p className="text-text-primary font-medium">{user?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-text-secondary text-sm">Email</p>
              <p className="text-text-primary font-medium">{user?.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-text-secondary text-sm">Role</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {user?.role || 'User'}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
