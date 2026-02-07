import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

/**
 * UserLayout - Layout for regular users (no sidebar)
 * Used for Shop, Cart, Orders, User Details pages
 */
const UserLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <div className="sticky top-0 z-10">
        <Navbar showLogo={true} />
      </div>

      {/* Page Content */}
      <main className="flex-1 p-6 overflow-x-hidden overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
