import React from "react";
import Footer from "../components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50">
      {/* Decorative wave background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <svg className="absolute -top-20 left-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="#0891b2" fillOpacity="0.3" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
        </svg>
      </div>

      <div className="relative max-w-6xl mx-auto px-6 sm:px-8 py-20 sm:py-28">
        {/* Header Section */}
        <div className="mb-16 animate-[fadeIn_0.8s_ease-out]">
          <div className="inline-block mb-4">
            <span className="text-cyan-700 text-sm font-medium tracking-[0.3em] uppercase border-b-2 border-cyan-700 pb-2">
              Discover
            </span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-serif mb-6 text-slate-900 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Ocean View Resort
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-600 to-amber-600 mb-8"></div>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left Column - Main Content */}
          <div className="space-y-8 animate-[slideInLeft_0.9s_ease-out]">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
              <h2 className="text-2xl font-serif mb-4 text-slate-800" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                A Sanctuary by the Sea
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
                Ocean View Resort offers a luxury stay by the ocean in Galle, Sri Lanka. Experience tranquility, breathtaking views, and world-class hospitality.
              </p>
            </div>

            <div className="bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-2xl p-8 shadow-xl text-white hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
              <h3 className="text-xl font-serif mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Where Luxury Meets Nature
              </h3>
              <p className="text-cyan-50 leading-relaxed">
                Nestled along the pristine coastline of Galle, our resort seamlessly blends modern luxury with the natural beauty of Sri Lanka's southern shores.
              </p>
            </div>
          </div>

          {/* Right Column - Features */}
          <div className="space-y-6 animate-[slideInRight_0.9s_ease-out]">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:bg-white/80 transition-all duration-300 group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  🌊
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-2 text-lg">Oceanfront Excellence</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Wake up to panoramic views of the Indian Ocean from our carefully designed rooms and suites.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:bg-white/80 transition-all duration-300 group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  ✨
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-2 text-lg">World-Class Hospitality</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Our dedicated team ensures every moment of your stay is exceptional, memorable, and perfectly tailored.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:bg-white/80 transition-all duration-300 group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  🏝️
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-2 text-lg">Historic Galle</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Explore the UNESCO World Heritage Fort, pristine beaches, and vibrant culture of Sri Lanka's gem.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-20 text-center animate-[fadeInUp_1s_ease-out]">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 to-amber-600/10"></div>
            <div className="relative z-10">
              <h3 className="text-3xl font-serif text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Your Paradise Awaits
              </h3>
              <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
                Discover the perfect blend of luxury, tranquility, and adventure at Ocean View Resort, Galle.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button className="px-8 py-3 bg-cyan-600 text-white rounded-full font-medium hover:bg-cyan-500 transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 hover:scale-105">
                  Book Your Stay
                </button>
                <button className="px-8 py-3 bg-white/10 text-white rounded-full font-medium hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/30 hover:scale-105">
                  Explore Rooms
                </button>
              </div>
            </div>
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
};

export default About;