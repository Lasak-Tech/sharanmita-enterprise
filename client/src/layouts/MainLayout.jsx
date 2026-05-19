import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  FileUp, 
  LogOut, 
  Menu, 
  X,
  User,
  Settings,
  Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { clsx } from 'clsx';

const SidebarItem = ({ icon: Icon, label, to, active, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={clsx(
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
      active 
        ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
        : "text-slate-600 hover:bg-slate-100 hover:text-blue-600"
    )}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </Link>
);

const MainLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminLinks = [
    { icon: LayoutDashboard, label: 'Overview', to: '/app/admin' },
    { icon: Users, label: 'Customers', to: '/app/admin/customers' },
    { icon: FileUp, label: 'Upload Data', to: '/app/admin/upload' },
    { icon: CreditCard, label: 'Payments', to: '/app/admin/payments' },
  ];

  const employeeLinks = [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/app/employee' },
    { icon: Users, label: 'Customers', to: '/app/employee/customers' },
  ];

  const customerLinks = [
    { icon: LayoutDashboard, label: 'My Billing', to: '/app/customer' },
    { icon: CreditCard, label: 'Payment History', to: '/app/customer/history' },
  ];

  const links = user?.role === 'ADMIN' ? adminLinks : 
                user?.role === 'EMPLOYEE' ? employeeLinks : customerLinks;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
            S
          </div>
          <span className="text-xl font-bold text-slate-800">Sharanmita Cable</span>
        </div>

        <nav className="flex-1 space-y-2">
          {links.map((link) => (
            <SidebarItem 
              key={link.to} 
              {...link} 
              active={location.pathname === link.to} 
            />
          ))}
        </nav>

        <div className="pt-6 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 shrink-0">
          <button 
            className="lg:hidden p-2 text-slate-600"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className="hidden lg:block text-slate-500 font-medium">
            Welcome back, <span className="text-slate-800 font-bold">{user?.name}</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors relative">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800 leading-none">{user?.name}</p>
                <p className="text-xs text-slate-500 mt-1 capitalize">{user?.role.toLowerCase()}</p>
              </div>
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 border border-slate-200">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          <Outlet />
        </div>
      </main>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <aside className="absolute inset-y-0 left-0 w-72 bg-white p-6 shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between mb-10 px-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">S</div>
                <span className="text-xl font-bold text-slate-800">Sharanmita Cable</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <nav className="space-y-2">
              {links.map((link) => (
                <SidebarItem 
                  key={link.to} 
                  {...link} 
                  active={location.pathname === link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                />
              ))}
            </nav>
          </aside>
        </div>
      )}
    </div>
  );
};

export default MainLayout;
