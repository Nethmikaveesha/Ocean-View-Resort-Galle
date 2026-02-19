import React from "react";
import Footer from "../components/Footer";
import { ROLE_ADMIN, ROLE_MANAGER, ROLE_RECEPTIONIST } from "../constants/roles";

export default function Help() {
  const userRole = localStorage.getItem("userRole")?.toLowerCase() || "";

  const isAdmin = userRole === ROLE_ADMIN;
  const isManager = userRole === ROLE_MANAGER;
  const isReceptionist = userRole === ROLE_RECEPTIONIST;

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
            {isAdmin && "Admin Guidelines for Ocean View Resort"}
            {isManager && "Manager Guidelines for Ocean View Resort"}
            {isReceptionist && "Receptionist Guidelines for Ocean View Resort"}
            {!isAdmin && !isManager && !isReceptionist && "Reservation System Guidelines for Ocean View Resort Team"}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-600 to-amber-600 mt-6"></div>
        </div>

        {/* Admin-specific content */}
        {isAdmin && (
          <div className="space-y-8 animate-[fadeInUp_0.9s_ease-out]">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 shadow-2xl text-white relative overflow-hidden">
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
                      <span>Add and edit rooms</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">✓</span>
                      <span>Full system access and operations</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xl flex-shrink-0">
                      👥
                    </div>
                    <div>
                      <h3 className="text-xl font-serif text-slate-900 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        Role Overview
                      </h3>
                      <p className="text-slate-600 leading-relaxed text-sm">
                        Admins oversee the system; Managers handle rooms, pricing, reservations, and customers; Receptionists handle walk-in bookings, view reservations, and check availability.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 shadow-lg border-2 border-red-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-xl flex-shrink-0">
                      🔒
                    </div>
                    <div>
                      <h3 className="text-xl font-serif text-slate-900 mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        Security
                      </h3>
                      <p className="text-slate-700 text-sm">
                        Use a strong password and log out when leaving your workstation. Never share credentials. Report any suspicious activity to IT.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-10 shadow-lg border border-white/20 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-3xl mx-auto mb-6">
                💬
              </div>
              <h2 className="text-2xl font-serif text-slate-900 mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Need Assistance?
              </h2>
              <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                For technical support or password reset, please contact the IT department.
              </p>
              <button className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-full font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105">
                Contact IT Support
              </button>
            </div>
          </div>
        )}

        {/* Manager-specific content */}
        {isManager && (
          <div className="space-y-8 animate-[fadeInUp_0.9s_ease-out]">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-8 shadow-2xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl mb-6">
                    👔
                  </div>
                  <h2 className="text-2xl font-serif mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    Your Permissions
                  </h2>
                  <ul className="space-y-2 text-sm text-amber-50">
                    <li className="flex items-start gap-2">
                      <span className="text-white mt-1">✓</span>
                      <span>Add, edit, and delete rooms</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-white mt-1">✓</span>
                      <span>Update room pricing</span>
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
                      <span className="opacity-90">Cannot create or delete admins</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-xl flex-shrink-0">
                      📝
                    </div>
                    <div>
                      <h3 className="text-xl font-serif text-slate-900 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        Add Reservation
                      </h3>
                      <p className="text-slate-600 leading-relaxed text-sm mb-3">
                        Select room type and dates first to see available rooms. Choose a room, enter guest details and times, then save.
                      </p>
                      <div className="grid sm:grid-cols-2 gap-2 text-sm text-slate-700">
                        <span>• Guest name</span><span>• Address</span><span>• Contact</span><span>• Room type</span>
                        <span>• Check-in / out</span><span>• Times (AM/PM)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xl flex-shrink-0">
                      👥
                    </div>
                    <div>
                      <h3 className="text-xl font-serif text-slate-900 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        Customer Flow
                      </h3>
                      <p className="text-slate-600 leading-relaxed text-sm">
                        Guests can book online or via reception. Use Create Reservation in your dashboard to add bookings for walk-ins or phone bookings.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <h3 className="text-lg font-serif text-slate-900 mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                💰 Managing Rooms & Pricing
              </h3>
              <p className="text-slate-600 text-sm mb-3">
                Use <strong>Manage Rooms</strong> to edit or delete existing rooms. Use <strong>Update Pricing</strong> to change room rates. Changes apply immediately to new reservations.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 shadow-lg border-2 border-red-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-xl flex-shrink-0">
                    🔒
                  </div>
                  <div>
                    <h3 className="text-xl font-serif text-slate-900 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      Security
                    </h3>
                    <p className="text-slate-700 text-sm">
                      Log out when leaving your workstation. Never share credentials. Report any unauthorized access to IT.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 text-center flex flex-col justify-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl mx-auto mb-3">💬</div>
                <h3 className="text-xl font-serif text-slate-900 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Need Help?
                </h3>
                <p className="text-slate-600 text-sm mb-4">
                  Contact the IT department for technical support or password reset.
                </p>
                <button className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-full font-medium hover:shadow-lg text-sm self-center">
                  Contact IT
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Receptionist-specific content */}
        {isReceptionist && (
          <div className="space-y-8 animate-[fadeInUp_0.9s_ease-out]">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-3xl p-8 shadow-2xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl mb-6">
                    🎯
                  </div>
                  <h2 className="text-2xl font-serif mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    Your Permissions
                  </h2>
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
                      <span className="opacity-90">Cannot add/delete rooms</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="opacity-50 mt-1">✗</span>
                      <span className="opacity-90">Cannot view customer list</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-xl flex-shrink-0">
                      📝
                    </div>
                    <div>
                      <h3 className="text-xl font-serif text-slate-900 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        Walk-in Reservations
                      </h3>
                      <p className="text-slate-600 leading-relaxed text-sm">
                        In your dashboard, use <strong>Walk-in Reservation</strong> or <strong>Create Walk-in Reservation</strong>. Select room type and dates first to see available rooms. Choose a room, enter guest details and check-in/check-out times, then save.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xl flex-shrink-0">
                      👥
                    </div>
                    <div>
                      <h3 className="text-xl font-serif text-slate-900 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        Customer Flow
                      </h3>
                      <p className="text-slate-600 leading-relaxed text-sm">
                        Guests may book online or walk in. Use Walk-in Reservation for guests arriving at the front desk without a prior booking.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <h3 className="text-lg font-serif text-slate-900 mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                ✓ Check Availability
              </h3>
              <p className="text-slate-600 text-sm">
                Use <strong>Check Availability</strong> in your dashboard to see which rooms are free for given dates. You can also go to the public check page to verify availability from a guest's perspective.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 shadow-lg border-2 border-red-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-xl flex-shrink-0">
                    🔒
                  </div>
                  <div>
                    <h3 className="text-xl font-serif text-slate-900 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      Security
                    </h3>
                    <p className="text-slate-700 text-sm">
                      Log out when leaving your workstation. Never share credentials. Report any suspicious activity to your supervisor or IT.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 text-center flex flex-col justify-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl mx-auto mb-3">💬</div>
                <h3 className="text-xl font-serif text-slate-900 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Need Help?
                </h3>
                <p className="text-slate-600 text-sm mb-4">
                  Contact the IT department for technical support or password reset.
                </p>
                <button className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-full font-medium hover:shadow-lg text-sm self-center">
                  Contact IT
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Non-staff / fallback */}
        {!isAdmin && !isManager && !isReceptionist && (
          <div className="animate-[fadeInUp_0.9s_ease-out]">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-10 shadow-lg border border-white/20 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-3xl mx-auto mb-6">
                💬
              </div>
              <h2 className="text-2xl font-serif text-slate-900 mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Staff Help Center
              </h2>
              <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                This help center is for Ocean View Resort staff. Please log in with your staff credentials to view role-specific guidelines. For assistance, contact the IT department.
              </p>
              <button className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-full font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105">
                Contact IT Support
              </button>
            </div>
          </div>
        )}
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