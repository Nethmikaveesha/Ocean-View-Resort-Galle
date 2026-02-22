
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyReservations } from "../Services/api";

export default function CustomerDashboard() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem("username") || "";

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getMyReservations(username);
        setReservations(data || []);
      } catch (_) {
        setReservations([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50 py-12 px-4">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-tl from-amber-400 to-orange-600 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-[fadeIn_0.8s_ease-out]">
          <div className="inline-block mb-4">
            <span className="text-cyan-700 text-sm font-medium tracking-[0.3em] uppercase border-b-2 border-cyan-700 pb-2">
              Welcome Back
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-serif mb-4 text-slate-900" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            My Dashboard
          </h2>
          <p className="text-xl text-slate-600">Manage your reservations at Ocean View Resort</p>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-600 to-amber-600 mx-auto mt-6"></div>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 gap-6 mb-12 animate-[fadeInUp_0.9s_ease-out]">
          <Link
            to="/add-reservation"
            className="group bg-white/70 backdrop-blur-lg rounded-3xl border border-white/20 p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-3xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                ➕
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-serif text-slate-900 mb-2 group-hover:text-cyan-700 transition-colors" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Add New Reservation
                </h3>
                <p className="text-slate-600">Book your next stay with us</p>
              </div>
            </div>
          </Link>

          <Link
            to="/view-reservation"
            className="group bg-white/70 backdrop-blur-lg rounded-3xl border border-white/20 p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-3xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                📋
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-serif text-slate-900 mb-2 group-hover:text-cyan-700 transition-colors" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Manage Reservations
                </h3>
                <p className="text-slate-600">View, update, or cancel bookings</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Reservations Section */}
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl border border-white/20 p-8 sm:p-10 shadow-2xl animate-[fadeInUp_1s_ease-out]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-3xl font-serif text-slate-900 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Your Reservations
              </h3>
              <p className="text-slate-600">Recent bookings and upcoming stays</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl text-white shadow-lg">
              📅
            </div>
          </div>

          {reservations.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-5xl mx-auto mb-6">
                🏖️
              </div>
              <h4 className="text-2xl font-serif text-slate-900 mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                No Reservations Yet
              </h4>
              <p className="text-slate-600 mb-6">Start planning your perfect getaway at Ocean View Resort</p>
              <Link
                to="/add-reservation"
                className="inline-block px-8 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-teal-500/50 transition-all duration-300 hover:scale-105"
              >
                Create Your First Reservation
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {reservations.map((resv, index) => (
                <div
                  key={resv.reservationNumber}
                  className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 hover:scale-102"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                          {resv.roomType?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Reservation #{resv.reservationNumber}</p>
                          <p className="text-lg font-semibold text-slate-900">{resv.guestName}</p>
                        </div>
                      </div>
                      
                      <div className="grid sm:grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-slate-500">Room Type</p>
                          <p className="font-medium text-slate-900">{resv.roomType}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Check-in</p>
                          <p className="font-medium text-slate-900">{resv.checkIn}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Check-out</p>
                          <p className="font-medium text-slate-900">{resv.checkOut}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Total Bill</p>
                          <p className="font-semibold text-cyan-700 text-lg">LKR {resv.totalBill?.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                    
                    <Link
                      to="/view-reservation"
                      className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 text-center"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        {reservations.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-4 justify-center animate-[fadeInUp_1.1s_ease-out]">
            <Link
              to="/add-reservation"
              className="px-6 py-3 bg-white/70 backdrop-blur-sm border-2 border-cyan-600 text-cyan-700 rounded-xl font-medium hover:bg-cyan-50 transition-all duration-300 hover:scale-105"
            >
              Add Another Reservation
            </Link>
            <Link
              to="/view-reservation"
              className="px-6 py-3 bg-white/70 backdrop-blur-sm border-2 border-slate-600 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-all duration-300 hover:scale-105"
            >
              Manage All Reservations
            </Link>
          </div>
        )}
      </div>

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