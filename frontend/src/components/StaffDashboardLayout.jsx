import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export function MetricCard({ icon, label, value, iconBg = "bg-purple-500" }) {
  return (
    <div className="rounded-2xl bg-purple-50 border border-purple-100 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">{label}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
        <div className={`w-14 h-14 rounded-xl ${iconBg} flex items-center justify-center text-2xl text-white shadow`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function StaffDashboardLayout({
  roleLabel,
  badgeColor,
  navItems,
  activeSection,
  onSectionChange,
  children,
  headerTitle,
  headerSubtitle,
  headerDescription,
}) {
  const { logout } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 text-white flex flex-col fixed h-full shadow-xl">
        <div className="p-5 border-b border-slate-700">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="text-2xl">🏨</span>
            <span>Ocean View Resort</span>
          </Link>
          <div className={`mt-3 inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase ${badgeColor}`}>
            {roleLabel}
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left transition-colors ${
                  isActive ? "bg-slate-600 text-white" : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors font-medium"
          >
            <span className="text-xl">🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 p-8">
        {/* Header card */}
        <div className="rounded-2xl bg-gradient-to-r from-purple-100 to-pink-50 border border-purple-100 p-6 mb-8 shadow-sm relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{headerTitle}</h1>
              <p className="text-gray-600 mt-1">{headerSubtitle}</p>
              {headerDescription && <p className="text-sm text-gray-500 mt-0.5">{headerDescription}</p>}
            </div>
            <div className={`w-16 h-16 rounded-full ${badgeColor} flex items-center justify-center text-2xl font-bold text-white shadow-lg`}>
              {roleLabel.charAt(0)}
            </div>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}
