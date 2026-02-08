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
  TrendingUp, 
  CreditCard, 
  AccountBalanceWallet, 
  Layers,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';

import { StatCard } from '../components/dashboard/StatCard';
import { useGetDashboardStatsQuery } from '../services/orderApi';


const Home = () => {
  const user = useSelector(selectCurrentUser);
  const isAdmin = user?.role === 'ADMIN' || user?.role_id === 1;

  // Fetch Admin Stats
  const { data: adminStats, isLoading: isAdminLoading } = useGetStatsQuery(undefined, {
    skip: !isAdmin,
  });

  // Fetch User Dashboard Stats
  const { data: userStats, isLoading: isUserLoading } = useGetDashboardStatsQuery(undefined, {
    skip: isAdmin,
  });

  const adminStatCards = [
    { title: 'Total Users', value: adminStats?.total_users || 0, icon: People, color: 'bg-blue-500', link: '/admin/users', isLoading: isAdminLoading },
    { title: 'Active Employees', value: adminStats?.active_employees || 0, icon: Business, color: 'bg-green-500', link: '/admin/employees', isLoading: isAdminLoading },
    { title: 'Roles', value: adminStats?.total_roles || 0, icon: Security, color: 'bg-purple-500', link: '/admin/roles', isLoading: isAdminLoading },
    { title: 'Modules', value: adminStats?.total_modules || 5, icon: Assignment, color: 'bg-orange-500', link: '/admin/role-rights', isLoading: isAdminLoading },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-10">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">
                {user?.name?.[0] || 'U'}
             </div>
             <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    Welcome back, {user?.name || 'User'}!
                </h1>
                <p className="text-gray-500 mt-1">
                    Here's a look at your account overview today.
                </p>
             </div>
          </div>
        </div>

        {/* Admin Dashboard */}
        {isAdmin && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {adminStatCards.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
        )}

        {/* Regular User Dashboard */}
        {!isAdmin && (
          <div className="space-y-8">
            {/* User Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between group hover:border-primary transition-all">
                  <div className="flex justify-between items-start">
                     <div>
                        <p className="text-sm font-medium text-gray-500">Total Subscriptions</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-1">{userStats?.total_subscriptions || 0}</h3>
                     </div>
                     <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                        <Layers />
                     </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs font-medium text-green-600">
                     <TrendingUp fontSize="small" />
                     <span>Active Modules</span>
                  </div>
               </div>

               <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between group hover:border-primary transition-all">
                  <div className="flex justify-between items-start">
                     <div>
                        <p className="text-sm font-medium text-gray-500">Amount Spent</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-1">
                            ${(userStats?.total_spent || 0).toLocaleString()}
                        </h3>
                     </div>
                     <div className="p-3 bg-green-50 text-green-600 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                        <CreditCard />
                     </div>
                  </div>
                  <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                     <div 
                        className="h-full bg-green-500 transition-all duration-1000 ease-out"
                        style={{ width: userStats?.total_spent > 0 ? '70%' : '0%' }}
                     ></div>
                  </div>
               </div>

               <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between group hover:border-primary transition-all">
                  <div className="flex justify-between items-start">
                     <div>
                        <p className="text-sm font-medium text-gray-500">Total Due</p>
                        <h3 className="text-3xl font-bold text-red-600 mt-1">
                            ${(userStats?.total_due || 0).toLocaleString()}
                        </h3>
                     </div>
                     <div className="p-3 bg-red-50 text-red-600 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                        <AccountBalanceWallet />
                     </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs font-medium">
                     <span className="text-gray-500">Payment Status</span>
                     <span className={userStats?.total_due > 0 ? 'text-red-600' : 'text-green-600'}>
                        {userStats?.total_due > 0 ? 'Action Required' : 'All Clear'}
                     </span>
                  </div>
               </div>
            </div>

            {/* Visual Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
                  <h3 className="text-xl font-bold text-gray-900 mb-8">Spending Visualization</h3>
                  <div className="flex items-end justify-between h-48 gap-4 px-2">
                     {/* Dynamic Bars based on history */}
                     {(userStats?.spending_history || [20, 45, 30, 80, 50, 90]).map((val, i) => (
                        <div 
                           key={i} 
                           className="flex-1 bg-primary/10 rounded-t-xl relative group"
                           style={{ height: '100%' }}
                        >
                           <div 
                              className="absolute bottom-0 w-full bg-primary rounded-t-xl transition-all duration-1000 ease-out flex flex-col items-center justify-end"
                              style={{ 
                                height: `${(val / Math.max(...(userStats?.spending_history || [100]), 1)) * 100}%`,
                                opacity: 0.3 + (i * 0.12)
                              }}
                           >
                              <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-gray-900 text-white text-[10px] px-2 py-1 rounded transition-opacity">
                                 ${val}
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
                  <div className="mt-6 flex justify-between px-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                     <span>Jan</span>
                     <span>Feb</span>
                     <span>Mar</span>
                     <span>Apr</span>
                     <span>May</span>
                     <span>Jun</span>
                  </div>
               </div>

               <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                     <TrendingUp className="text-primary" />
                     Growth Status
                  </h3>
                  <div className="flex-1 flex flex-col justify-center">
                     <div className="space-y-6">
                        <div>
                           <div className="flex justify-between text-sm font-bold mb-2">
                              <span className="text-gray-600 uppercase tracking-wider">Plan Utilization</span>
                              <span className="text-primary tracking-tighter">85%</span>
                           </div>
                           <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-primary w-[85%] rounded-full shadow-lg shadow-primary/20"></div>
                           </div>
                        </div>
                        <div>
                           <div className="flex justify-between text-sm font-bold mb-2">
                              <span className="text-gray-600 uppercase tracking-wider">Account Efficiency</span>
                              <span className="text-blue-500 tracking-tighter">92%</span>
                           </div>
                           <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500 w-[92%] rounded-full shadow-lg shadow-blue-500/20"></div>
                           </div>
                        </div>
                     </div>
                     <p className="mt-8 text-sm text-gray-500 leading-relaxed italic border-l-4 border-primary/20 pl-4">
                        "Your account efficiency has improved by 12% since last month. Keep optimizing your project sessions for better ROI."
                     </p>
                  </div>
               </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
