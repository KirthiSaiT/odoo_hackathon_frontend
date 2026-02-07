import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Dashboard,
  People,
  Security,
  Business,
  Settings,
  Work,
  AttachMoney,
  Person,
  Apartment,
  ConfirmationNumber,
} from '@mui/icons-material';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  // Navigation items configuration
  const navItems = [
    { type: 'header', label: 'Admin' },
    {
      type: 'link',
      label: 'Back to Site',
      path: '/home',
      icon: Dashboard,
    },
    {
      type: 'link',
      label: 'User Configuration',
      path: '/admin/users',
      icon: Person,
    },
    {
      type: 'link',
      label: 'Access Rights',
      path: '/admin/role-rights',
      icon: Security,
    },
    {
      type: 'link',
      label: 'HR Management',
      path: '/admin/employees',
      icon: Business,
    },
    {
      type: 'link',
      label: 'Work',
      path: '/admin/work',
      icon: Work,
    },
    {
      type: 'link',
      label: 'Finance',
      path: '/admin/finance',
      icon: AttachMoney,
    },
    {
      type: 'link',
      label: 'CRM',
      path: '/admin/crm',
      icon: People,
    },
    {
      type: 'link',
      label: 'Clients',
      path: '/admin/clients',
      icon: Person, // Or specific icon
    },
    {
      type: 'link',
      label: 'Company',
      path: '/admin/company',
      icon: Apartment,
    },
    {
      type: 'link',
      label: 'Tickets',
      path: '/admin/tickets',
      icon: ConfirmationNumber,
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-20 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      />

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 h-full bg-[#1a1a2e] text-white w-64 z-30 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center px-6 border-b border-gray-700">
          <Link to="/home" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
              <span className="font-bold text-lg">V</span>
            </div>
            <span className="font-bold text-xl tracking-tight">Vizroz ERP</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          {navItems.map((item, index) => {
            if (item.type === 'header') {
              return (
                <div key={index} className="px-3 mt-6 mb-2">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {item.label}
                  </span>
                </div>
              );
            }

            const Icon = item.icon;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Icon style={{ fontSize: 20 }} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* User Profile (Bottom) */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-600 flex items-center justify-center">
              <span className="font-semibold text-sm">U</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Admin User</p>
              <p className="text-xs text-gray-400 truncate">admin@vizroz.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
