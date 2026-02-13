import React from "react";
import Footer from "../components/Footer";

export default function Help() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-400 to-orange-600 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 py-20 sm:py-28">
        {/* Header */}
        <div className="mb-16 animate-[fadeIn_0.8s_ease-out]">
          <div className="inline-block mb-4">
            <span className="text-cyan-700 text-sm font-medium tracking-[0.3em] uppercase border-b-2 border-cyan-700 pb-2">
              Staff Portal
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-serif mb-4 text-slate-900 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Help Center
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl">
            Reservation System Guidelines for Ocean View Resort Team
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-600 to-amber-600 mt-6"></div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Admin Access Card */}
          <div className="lg:col-span-1 animate-[slideInLeft_0.9s_ease-out]">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 shadow-2xl text-white h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-3xl mb-6">
                  🔐
                </div>
                <h2 className="text-2xl font-serif mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Admin Access
                </h2>
                <div className="bg-amber-500/20 backdrop-blur-sm rounded-lg p-4 border border-amber-400/30 mb-6">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <p className="text-amber-200 text-sm font-semibold mb-1">Restricted Access</p>
                      <p className="text-amber-100 text-xs">Admin credentials are confidential and must be obtained from the IT department or system administrator.</p>
                    </div>
                  </div>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  <strong className="text-white">Admin Capabilities:</strong>
                </p>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">✓</span>
                    <span>Create managers and receptionists</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">✓</span>
                    <span>Manage all administrator accounts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">✓</span>
                    <span>Full system access and operations</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Guidelines */}
          <div className="lg:col-span-2 space-y-6 animate-[slideInRight_0.9s_ease-out]">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xl flex-shrink-0">
                  👥
                </div>
                <div>
                  <h3 className="text-2xl font-serif text-slate-900 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    Customer Flow
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Customers must first check room availability on the home page. Only if rooms are available can they register and log in to make a reservation.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-xl flex-shrink-0">
                  📝
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-serif text-slate-900 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    Add Reservation
                  </h3>
                  <p className="text-slate-600 mb-4 leading-relaxed">
                    Required information for new bookings:
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-slate-700">
                      <div className="w-2 h-2 rounded-full bg-cyan-600"></div>
                      <span className="text-sm">Guest name</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <div className="w-2 h-2 rounded-full bg-cyan-600"></div>
                      <span className="text-sm">Address</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <div className="w-2 h-2 rounded-full bg-cyan-600"></div>
                      <span className="text-sm">Contact number</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <div className="w-2 h-2 rounded-full bg-cyan-600"></div>
                      <span className="text-sm">Room type</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <div className="w-2 h-2 rounded-full bg-cyan-600"></div>
                      <span className="text-sm">Check-in (today only)</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <div className="w-2 h-2 rounded-full bg-cyan-600"></div>
                      <span className="text-sm">Check-out (future)</span>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                    <p className="text-sm text-cyan-900">
                      <strong>Note:</strong> Times must be in AM/PM format. The system auto-generates reservation numbers and calculates bills.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Role-Based Access Grid */}
        <div className="mb-12 animate-[fadeInUp_1s_ease-out]">
          <h2 className="text-3xl font-serif text-slate-900 mb-8 text-center" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Role Permissions
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Manager Card */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 shadow-xl text-white hover:scale-105 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl mb-4">
                👔
              </div>
              <h3 className="text-xl font-serif mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Manager
              </h3>
              <ul className="space-y-2 text-sm text-amber-50">
                <li className="flex items-start gap-2">
                  <span className="text-white mt-1">✓</span>
                  <span>Add, update, and delete rooms</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white mt-1">✓</span>
                  <span>Create and cancel reservations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white mt-1">✓</span>
                  <span>View customer information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="opacity-50 mt-1">✗</span>
                  <span className="opacity-75">Cannot create or delete admins</span>
                </li>
              </ul>
            </div>

            {/* Receptionist Card */}
            <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl p-6 shadow-xl text-white hover:scale-105 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl mb-4">
                🎯
              </div>
              <h3 className="text-xl font-serif mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Receptionist
              </h3>
              <ul className="space-y-2 text-sm text-cyan-50">
                <li className="flex items-start gap-2">
                  <span className="text-white mt-1">✓</span>
                  <span>Create walk-in reservations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white mt-1">✓</span>
                  <span>View reservations and rooms</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white mt-1">✓</span>
                  <span>Check room availability</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="opacity-50 mt-1">✗</span>
                  <span className="opacity-75">Cannot add/delete rooms</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="opacity-50 mt-1">✗</span>
                  <span className="opacity-75">Cannot view customer list</span>
                </li>
              </ul>
            </div>

            {/* Guest Card */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 shadow-xl text-white hover:scale-105 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl mb-4">
                🏨
              </div>
              <h3 className="text-xl font-serif mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Guest Access
              </h3>
              <ul className="space-y-2 text-sm text-blue-50">
                <li className="flex items-start gap-2">
                  <span className="text-white mt-1">✓</span>
                  <span>View their own reservations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white mt-1">✓</span>
                  <span>Update their bookings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white mt-1">✓</span>
                  <span>Delete reservations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-white mt-1">✓</span>
                  <span>Download bill as PDF</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Security Best Practices */}
        <div className="mb-12 animate-[fadeInUp_1.05s_ease-out]">
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 shadow-lg border-2 border-red-200">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-3xl flex-shrink-0">
                🔒
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-serif text-slate-900 mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Security Best Practices
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white/70 rounded-lg p-4 border border-red-200">
                    <h4 className="font-semibold text-red-900 mb-2 text-sm">🚫 Never Share Credentials</h4>
                    <p className="text-slate-700 text-sm">Do not share your login credentials with anyone, including colleagues or via email/chat.</p>
                  </div>
                  <div className="bg-white/70 rounded-lg p-4 border border-red-200">
                    <h4 className="font-semibold text-red-900 mb-2 text-sm">🔐 Use Strong Passwords</h4>
                    <p className="text-slate-700 text-sm">Change default passwords immediately and use unique, complex passwords for each account.</p>
                  </div>
                  <div className="bg-white/70 rounded-lg p-4 border border-red-200">
                    <h4 className="font-semibold text-red-900 mb-2 text-sm">🚪 Always Log Out</h4>
                    <p className="text-slate-700 text-sm">Log out when leaving your workstation, even for short breaks.</p>
                  </div>
                  <div className="bg-white/70 rounded-lg p-4 border border-red-200">
                    <h4 className="font-semibold text-red-900 mb-2 text-sm">📞 Report Suspicious Activity</h4>
                    <p className="text-slate-700 text-sm">Immediately report any unauthorized access attempts to IT.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="animate-[fadeInUp_1.1s_ease-out]">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-10 shadow-lg border border-white/20 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-3xl mx-auto mb-6">
              💬
            </div>
            <h2 className="text-2xl font-serif text-slate-900 mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Need Assistance?
            </h2>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              For admin credentials, technical support, or further assistance with the reservation system, please contact the IT department.
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-full font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105">
              Contact IT Support
            </button>
          </div>
        </div>
      </div>

      <Footer />

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
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
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