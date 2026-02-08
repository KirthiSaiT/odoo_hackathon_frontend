import React from 'react';
import { Link } from 'react-router-dom';

export const StatCard = ({ title, value, icon: Icon, color, link, isLoading }) => (
  <Link
    to={link || '#'}
    className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:border-primary transition-all duration-300 group block relative overflow-hidden"
  >
    <div className="flex items-center justify-between relative z-10">
      <div>
        <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">{title}</p>
        <div className="mt-2 text-3xl font-black text-gray-900 tracking-tighter">
          {isLoading ? (
            <div className="h-9 w-20 bg-gray-100 animate-pulse rounded-lg"></div>
          ) : (
            value
          )}
        </div>
      </div>
      <div
        className={`p-4 rounded-2xl ${color} shadow-lg shadow-current/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
      >
        <Icon className="text-white" style={{ fontSize: 32 }} />
      </div>
    </div>
    
    {/* Subtle Decorative element */}
    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-gray-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
  </Link>
);
