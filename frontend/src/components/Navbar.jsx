// import React, { useContext } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import { ROLE_ADMIN, ROLE_MANAGER, ROLE_RECEPTIONIST, ROLE_CUSTOMER } from "../constants/roles";

// export default function Navbar() {
//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const userRole = user?.role || localStorage.getItem("userRole");

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     <nav className="bg-teal-800 text-white py-6 px-6 flex justify-between items-center shadow-md">
//       <div className="text-xl font-bold">
//         <Link to="/">Ocean View Resort</Link>
//       </div>

//       <div className="flex flex-wrap items-center gap-4">
//         <Link to="/" className="hover:underline">Home</Link>
//         <Link to="/about" className="hover:underline">About</Link>
//         <Link to="/help" className="hover:underline">Help</Link>

//         {userRole === ROLE_ADMIN ? (
//           <>
//             <Link to="/admin-dashboard" className="hover:underline">Admin Dashboard</Link>
//             <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded">
//               Logout
//             </button>
//           </>
//         ) : userRole === ROLE_MANAGER ? (
//           <>
//             <Link to="/manager-dashboard" className="hover:underline">Manager Dashboard</Link>
//             <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded">
//               Logout
//             </button>
//           </>
//         ) : userRole === ROLE_RECEPTIONIST ? (
//           <>
//             <Link to="/receptionist-dashboard" className="hover:underline">Receptionist Dashboard</Link>
//             <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded">
//               Logout
//             </button>
//           </>
//         ) : userRole === ROLE_CUSTOMER ? (
//           <>
//             <Link to="/customer-dashboard" className="hover:underline">Dashboard</Link>
//             <Link to="/add-reservation" className="hover:underline">Add Reservation</Link>
//             <Link to="/view-reservation" className="hover:underline">My Reservations</Link>
//             <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded">
//               Logout
//             </button>
//           </>
//         ) : (
//           <Link to="/login" className="hover:underline">Staff Login</Link>
//         )}
//       </div>
//     </nav>
//   );
// }
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ROLE_ADMIN, ROLE_MANAGER, ROLE_RECEPTIONIST, ROLE_CUSTOMER } from "../constants/roles";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const userRole = user?.role || localStorage.getItem("userRole");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl sticky top-0 z-50 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xl shadow-lg">
              🌊
            </div>
            <Link to="/" className="text-2xl font-serif hover:text-cyan-400 transition-colors" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Ocean View Resort
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <Link to="/" className="text-slate-200 hover:text-cyan-400 transition-colors font-medium">
              Home
            </Link>
            <Link to="/about" className="text-slate-200 hover:text-cyan-400 transition-colors font-medium">
              About
            </Link>
            <Link to="/help" className="text-slate-200 hover:text-cyan-400 transition-colors font-medium">
              Help
            </Link>

            {userRole === ROLE_ADMIN ? (
              <>
                <Link to="/admin-dashboard" className="text-slate-200 hover:text-cyan-400 transition-colors font-medium">
                  Admin Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 font-medium"
                >
                  Logout
                </button>
              </>
            ) : userRole === ROLE_MANAGER ? (
              <>
                <Link to="/manager-dashboard" className="text-slate-200 hover:text-cyan-400 transition-colors font-medium">
                  Manager Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 font-medium"
                >
                  Logout
                </button>
              </>
            ) : userRole === ROLE_RECEPTIONIST ? (
              <>
                <Link to="/receptionist-dashboard" className="text-slate-200 hover:text-cyan-400 transition-colors font-medium">
                  Receptionist Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 font-medium"
                >
                  Logout
                </button>
              </>
            ) : userRole === ROLE_CUSTOMER ? (
              <>
                <Link to="/customer-dashboard" className="text-slate-200 hover:text-cyan-400 transition-colors font-medium">
                  Dashboard
                </Link>
                <Link to="/add-reservation" className="text-slate-200 hover:text-cyan-400 transition-colors font-medium">
                  Add Reservation
                </Link>
                <Link to="/view-reservation" className="text-slate-200 hover:text-cyan-400 transition-colors font-medium">
                  My Reservations
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 font-medium"
              >
                Staff Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-10 h-10 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 animate-[slideDown_0.3s_ease-out]">
            <div className="flex flex-col gap-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 text-slate-200 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Home
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 text-slate-200 hover:bg-slate-700 rounded-lg transition-colors"
              >
                About
              </Link>
              <Link
                to="/help"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 text-slate-200 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Help
              </Link>

              {userRole === ROLE_ADMIN ? (
                <>
                  <Link
                    to="/admin-dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 text-slate-200 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    Admin Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all text-left"
                  >
                    Logout
                  </button>
                </>
              ) : userRole === ROLE_MANAGER ? (
                <>
                  <Link
                    to="/manager-dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 text-slate-200 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    Manager Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all text-left"
                  >
                    Logout
                  </button>
                </>
              ) : userRole === ROLE_RECEPTIONIST ? (
                <>
                  <Link
                    to="/receptionist-dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 text-slate-200 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    Receptionist Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all text-left"
                  >
                    Logout
                  </button>
                </>
              ) : userRole === ROLE_CUSTOMER ? (
                <>
                  <Link
                    to="/customer-dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 text-slate-200 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/add-reservation"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 text-slate-200 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    Add Reservation
                  </Link>
                  <Link
                    to="/view-reservation"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 text-slate-200 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    My Reservations
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Staff Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Global Styles */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&display=swap');
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </nav>
  );
}