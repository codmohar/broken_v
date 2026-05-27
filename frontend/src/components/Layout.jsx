import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Overview', icon: 'dashboard' },
  { path: '/dashboard', label: 'Dashboard', icon: 'monitoring' },
  { path: '/analysis', label: 'Analysis', icon: 'analytics' },
  { path: '/map', label: 'Map', icon: 'map' },
  { path: '/simulator', label: 'Simulator', icon: 'science' },
  { path: '/disease-detection', label: 'Disease Detection', icon: 'biotech' },
  { path: '/soil-analysis', label: 'Soil Analysis', icon: 'grass' },
  { path: '/weather-forecast', label: 'Weather Forecast', icon: 'cloud' },
];

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`bg-sidebar text-white flex flex-col transition-all duration-300 ${
          collapsed ? 'w-[72px]' : 'w-[240px]'
        }`}
      >
        {/* Logo / Brand */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <span className="material-symbols-outlined text-green-400 text-2xl">eco</span>
          {!collapsed && (
            <span className="text-base font-bold tracking-tight whitespace-nowrap">
              AgroGuardian AI
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 overflow-y-auto custom-scrollbar">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'bg-sidebar-active text-white'
                        : 'text-white/70 hover:bg-sidebar-hover hover:text-white'
                    }`
                  }
                >
                  <span className="material-symbols-outlined text-xl">{item.icon}</span>
                  {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center py-4 border-t border-white/10 text-white/50 hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined text-xl">
            {collapsed ? 'chevron_right' : 'chevron_left'}
          </span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-main-bg">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
