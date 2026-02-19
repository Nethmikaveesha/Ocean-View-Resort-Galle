// 
import React from "react";
import { Link } from "react-router-dom";

const PHONE_ICON = (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const SOCIAL_LINKS = [
  {
    name: "Facebook",
    url: "https://www.facebook.com",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    name: "X (Twitter)",
    url: "https://x.com",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white mt-20 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-tl from-amber-400 to-orange-600 rounded-full blur-3xl"></div>
      </div>

      {/* Wave decoration at top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg className="relative block w-full h-12" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor" className="text-slate-50 opacity-10"></path>
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl shadow-lg">
                🌊
              </div>
              <h3 className="text-2xl font-serif" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Ocean View Resort
              </h3>
            </div>
            <p className="text-cyan-200 mb-2">Galle, Sri Lanka</p>
            <p className="text-slate-400 mb-4">Luxury stay by the ocean</p>
            <a
              href="tel:+943734277"
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors group"
            >
              <span className="w-10 h-10 rounded-full bg-cyan-900/50 flex items-center justify-center group-hover:bg-cyan-800/50 transition-colors">
                {PHONE_ICON}
              </span>
              <span className="font-medium">+94 3734277</span>
            </a>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h4 className="text-lg font-serif mb-6 text-cyan-200" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Quick Links
            </h4>
            <nav className="flex flex-col gap-3">
              <Link
                to="/"
                className="text-slate-300 hover:text-cyan-400 transition-colors inline-flex items-center justify-center gap-2 group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 group-hover:scale-150 transition-transform"></span>
                Home
              </Link>
              <Link
                to="/about"
                className="text-slate-300 hover:text-cyan-400 transition-colors inline-flex items-center justify-center gap-2 group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 group-hover:scale-150 transition-transform"></span>
                About
              </Link>
              <Link
                to="/help"
                className="text-slate-300 hover:text-cyan-400 transition-colors inline-flex items-center justify-center gap-2 group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 group-hover:scale-150 transition-transform"></span>
                Help
              </Link>
              <Link
                to="/staff-login"
                className="text-slate-300 hover:text-cyan-400 transition-colors inline-flex items-center justify-center gap-2 group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 group-hover:scale-150 transition-transform"></span>
                Staff
              </Link>
            </nav>
          </div>

          {/* Social Media */}
          <div className="text-center md:text-right">
            <h4 className="text-lg font-serif mb-6 text-cyan-200" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Connect With Us
            </h4>
            <div className="flex items-center justify-center md:justify-end gap-3">
              {SOCIAL_LINKS.map(({ name, url, icon }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-700/50 backdrop-blur-sm hover:bg-gradient-to-br hover:from-cyan-500 hover:to-blue-600 text-white transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/50 border border-slate-600 hover:border-cyan-400"
                  aria-label={name}
                >
                  {icon}
                </a>
              ))}
            </div>
            <p className="text-slate-400 text-sm mt-6">
              Follow us for exclusive offers and updates
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700/50 pt-8 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-slate-400 text-sm">
            <span>&copy; {new Date().getFullYear()} Ocean View Resort.</span>
            <span className="hidden sm:inline">•</span>
            <span>All rights reserved.</span>
            <span className="hidden sm:inline">•</span>
            <span>Terms of Service</span>
            <span className="hidden sm:inline">•</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&display=swap');
      `}</style>
    </footer>
  );
}