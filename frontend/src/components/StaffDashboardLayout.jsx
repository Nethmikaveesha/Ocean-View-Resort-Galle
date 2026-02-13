// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";

// export function MetricCard({ icon, label, value, iconBg = "bg-purple-500" }) {
//   return (
//     <div className="rounded-2xl bg-purple-50 border border-purple-100 p-6 shadow-sm hover:shadow-md transition-shadow">
//       <div className="flex items-start justify-between">
//         <div>
//           <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">{label}</p>
//           <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
//         </div>
//         <div className={`w-14 h-14 rounded-xl ${iconBg} flex items-center justify-center text-2xl text-white shadow`}>
//           {icon}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function StaffDashboardLayout({
//   roleLabel,
//   badgeColor,
//   navItems,
//   activeSection,
//   onSectionChange,
//   children,
//   headerTitle,
//   headerSubtitle,
//   headerDescription,
// }) {
//   const { logout } = React.useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Sidebar */}
//       <aside className="w-64 bg-slate-800 text-white flex flex-col fixed h-full shadow-xl">
//         <div className="p-5 border-b border-slate-700">
//           <Link to="/" className="flex items-center gap-2 font-bold text-lg">
//             <span className="text-2xl">🏨</span>
//             <span>Ocean View Resort</span>
//           </Link>
//           <div className={`mt-3 inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase ${badgeColor}`}>
//             {roleLabel}
//           </div>
//         </div>

//         <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
//           {navItems.map((item) => {
//             const isActive = activeSection === item.id;
//             return (
//               <button
//                 key={item.id}
//                 onClick={() => onSectionChange(item.id)}
//                 className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left transition-colors ${
//                   isActive ? "bg-slate-600 text-white" : "text-slate-300 hover:bg-slate-700 hover:text-white"
//                 }`}
//               >
//                 <span className="text-xl">{item.icon}</span>
//                 <span className="font-medium">{item.label}</span>
//               </button>
//             );
//           })}
//         </nav>

//         <div className="p-3 border-t border-slate-700">
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors font-medium"
//           >
//             <span className="text-xl">🚪</span>
//             Logout
//           </button>
//         </div>
//       </aside>

//       {/* Main content */}
//       <main className="flex-1 ml-64 p-8">
//         {/* Header card */}
//         <div className="rounded-2xl bg-gradient-to-r from-purple-100 to-pink-50 border border-purple-100 p-6 mb-8 shadow-sm relative overflow-hidden">
//           <div className="flex items-start justify-between">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-800">{headerTitle}</h1>
//               <p className="text-gray-600 mt-1">{headerSubtitle}</p>
//               {headerDescription && <p className="text-sm text-gray-500 mt-0.5">{headerDescription}</p>}
//             </div>
//             <div className={`w-16 h-16 rounded-full ${badgeColor} flex items-center justify-center text-2xl font-bold text-white shadow-lg`}>
//               {roleLabel.charAt(0)}
//             </div>
//           </div>
//         </div>

//         {children}
//       </main>
//     </div>
//   );
// }
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export function MetricCard({ icon, label, value, iconBg = "bg-purple-500" }) {
  return (
    <div className="rounded-2xl bg-white/70 backdrop-blur-lg border border-white/20 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-[fadeInUp_0.6s_ease-out]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600 uppercase tracking-wide mb-2">{label}</p>
          <p className="text-4xl font-serif text-slate-900" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {value}
          </p>
        </div>
        <div className={`w-16 h-16 rounded-xl ${iconBg} flex items-center justify-center text-3xl text-white shadow-lg`}>
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
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-tl from-amber-400 to-orange-600 rounded-full blur-3xl"></div>
      </div>

      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col fixed h-full shadow-2xl border-r border-white/10 z-50">
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-700/50">
          <Link to="/" className="flex items-center gap-3 mb-4 group">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              🌊
            </div>
            <span className="font-serif text-xl group-hover:text-cyan-400 transition-colors" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Ocean View Resort
            </span>
          </Link>
          <div className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase ${badgeColor} shadow-lg`}>
            {roleLabel}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item, index) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/50 scale-105"
                    : "text-slate-300 hover:bg-slate-700/50 hover:text-white hover:scale-102"
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-700/50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl w-full bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 font-medium"
          >
            <span className="text-2xl">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-72 p-8 relative">
        {/* Header card */}
        <div className="rounded-3xl bg-white/70 backdrop-blur-lg border border-white/20 p-8 mb-8 shadow-2xl relative overflow-hidden animate-[fadeIn_0.8s_ease-out]">
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 pointer-events-none"></div>
          
          <div className="relative flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-serif text-slate-900 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {headerTitle}
              </h1>
              <p className="text-xl text-slate-700 font-medium mb-1">{headerSubtitle}</p>
              {headerDescription && (
                <p className="text-sm text-slate-500">{headerDescription}</p>
              )}
            </div>
            <div className={`w-20 h-20 rounded-2xl ${badgeColor} flex items-center justify-center text-3xl font-bold text-white shadow-xl`}>
              {roleLabel.charAt(0)}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="animate-[fadeInUp_0.9s_ease-out]">
          {children}
        </div>
      </main>

      {/* Global Styles */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}