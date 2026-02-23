import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRooms } from "../Services/api";
import Footer from "../components/Footer";

export default function Home() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getRooms();
        setRooms(data || []);
      } catch (err) {
        setError("Failed to load rooms.");
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50">
      {/* Hero Section */}
      <div className="relative w-full h-[600px] sm:h-[700px] overflow-hidden">
        <img
          src="/resort-hero.jpg"
          alt="Ocean View Resort - Pool and Gardens"
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-transparent"></div>
        
        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl animate-[fadeInUp_1s_ease-out]">
            <div className="mb-4">
              <span className="text-cyan-200 text-sm font-medium tracking-[0.3em] uppercase border-b-2 border-cyan-200 pb-2">
                Welcome to Paradise
              </span>
            </div>
            <h1 
              className="text-5xl sm:text-7xl lg:text-8xl font-serif mb-4 drop-shadow-2xl leading-tight" 
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Ocean View Resort
            </h1>
            <p className="text-2xl sm:text-3xl drop-shadow-lg mb-8 text-cyan-50" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Galle, Sri Lanka
            </p>
            <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Where the rhythm of the ocean meets unparalleled luxury
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => document.getElementById("experience-luxury")?.scrollIntoView({ behavior: "smooth" })}
                className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-full font-medium hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 text-lg"
              >
                Check Availability
              </button>
              <button
                onClick={() => navigate("/about")}
                className="px-8 py-4 bg-white/20 text-white rounded-full font-medium hover:bg-white/30 transition-all duration-300 backdrop-blur-md border border-white/30 hover:scale-105 text-lg"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-2 bg-white/70 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
        {/* Introduction */}
        <div id="experience-luxury" className="text-center mb-16 animate-[fadeIn_0.8s_ease-out] scroll-mt-20">
          <div className="inline-block mb-4">
            <span className="text-cyan-700 text-sm font-medium tracking-[0.3em] uppercase border-b-2 border-cyan-700 pb-2">
              Experience Luxury
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-serif mb-6 text-slate-900" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Discover Your Perfect Retreat
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-4">
            Check room availability and reserve your escape to paradise
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-600 to-amber-600 mx-auto"></div>
        </div>

        {/* Rooms Section */}
        <section className="mb-16">
          <div className="mb-12 text-center">
            <h3 className="text-3xl font-serif text-slate-900 mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Our Accommodations
            </h3>
            <p className="text-slate-600">Elegant rooms designed for your ultimate comfort</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-600">Loading our beautiful rooms...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
              <div className="text-5xl mb-4">⚠️</div>
              <p className="text-red-600 font-medium text-lg">{error}</p>
            </div>
          ) : rooms.length === 0 ? (
            <div className="bg-white/60 backdrop-blur-sm border-2 border-slate-200 rounded-2xl p-12 text-center shadow-lg">
              <div className="text-6xl mb-4">🏨</div>
              <p className="text-slate-600 text-lg mb-2">No rooms available at the moment</p>
              <p className="text-slate-500">Please contact our admin team for assistance</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.map((room, index) => (
                <div
                  key={room.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-[fadeInUp_0.6s_ease-out]"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Room Image */}
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden">
                    {room.imageBase64 ? (
                      <img
                        src={room.imageBase64}
                        alt={room.type}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-100 to-blue-100">
                        <span className="text-8xl text-cyan-300 font-serif" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                          {room.type?.charAt(0) || "R"}
                        </span>
                      </div>
                    )}
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                      <button 
                        onClick={() => navigate("/check", { state: { preselectedRoom: { id: room.id, type: room.type, price: room.price, roomNumber: room.roomNumber } } })}
                        className="px-6 py-2 bg-white text-slate-900 rounded-full font-medium hover:bg-cyan-50 transition-colors duration-300"
                      >
                        Check Availability
                      </button>
                    </div>
                  </div>

                  {/* Room Details */}
                  <div className="p-6">
                    <div className="mb-3">
                      <h3 className="text-2xl font-serif text-slate-900 mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        {room.type}
                      </h3>
                      <p className="text-sm text-slate-500">Room #{room.roomNumber || room.id}</p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Per Night</p>
                        <p className="text-2xl font-semibold text-cyan-700">
                          LKR {room.price?.toLocaleString() || "0"}
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform duration-300">
                        →
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CTA Section */}
        {!loading && !error && rooms.length > 0 && (
          <div className="text-center animate-[fadeInUp_1s_ease-out]">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 sm:p-16 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 to-amber-600/10"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <h3 className="text-3xl sm:text-4xl font-serif text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Ready to Experience Paradise?
                </h3>
                <p className="text-slate-300 max-w-2xl mx-auto text-lg">
                  Check availability for your preferred dates and secure your dream vacation at Ocean View Resort
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 animate-[fadeIn_1.2s_ease-out]">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-3xl mx-auto mb-4">
              🌊
            </div>
            <h4 className="text-xl font-serif text-slate-900 mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Oceanfront Views
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Wake up to stunning panoramic views of the Indian Ocean from your private balcony
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-3xl mx-auto mb-4">
              🍽️
            </div>
            <h4 className="text-xl font-serif text-slate-900 mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Gourmet Dining
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Savor exquisite cuisine featuring fresh seafood and authentic Sri Lankan flavors
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-3xl mx-auto mb-4">
              💆
            </div>
            <h4 className="text-xl font-serif text-slate-900 mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Spa & Wellness
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Rejuvenate your body and mind with traditional Ayurvedic treatments and therapies
            </p>
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