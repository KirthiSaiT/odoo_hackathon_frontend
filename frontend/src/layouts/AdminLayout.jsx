import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar'; // Reusing Navbar for top right controls

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Toggle for mobile
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content Area */}
      <div 
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'lg:ml-64' : 'ml-0'
        }`}
      >
        {/* Top Header / Navbar */}
        {/* We reuse Navbar but might want to hide the logo there since Sidebar has it */}
        <div className="sticky top-0 z-10">
            <Navbar showLogo={false} onMenuClick={toggleSidebar} />
        </div>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-x-hidden overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
