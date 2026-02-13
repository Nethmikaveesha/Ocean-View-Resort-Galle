// import { useState, useContext, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import { loginUser } from "../Services/authService";
// import { ROLE_ADMIN, ROLE_MANAGER, ROLE_RECEPTIONIST } from "../constants/roles";

// export default function Login() {
//   const navigate = useNavigate();
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const { login } = useContext(AuthContext);

//   const fromCheckAvailability = () => sessionStorage.getItem("availabilityVerified") && sessionStorage.getItem("selectedRoom");

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const role = localStorage.getItem("userRole");
//     if (token && role) {
//       if (role === ROLE_ADMIN) navigate("/admin-dashboard", { replace: true });
//       else if (role === ROLE_MANAGER) navigate("/manager-dashboard", { replace: true });
//       else if (role === ROLE_RECEPTIONIST) navigate("/receptionist-dashboard", { replace: true });
//       else if (role === "customer") navigate("/customer-dashboard", { replace: true });
//     }
//   }, [navigate]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     try {
//       const res = await loginUser({ username, password });
//       if (res.data?.token) {
//         const role = (res.data?.role || "").toLowerCase();
//         // Staff-only when accessed from navbar (no Check Availability flow). Customers must come from Check Availability.
//         if (role === "customer" && !fromCheckAvailability()) {
//           setError("Customers must use Check Availability, select a room, then log in from that page.");
//           return;
//         }
//         localStorage.setItem("userRole", role);
//         localStorage.setItem("token", res.data.token);
//         localStorage.setItem("username", username);
//         login({ role, username });
//         if (role === ROLE_ADMIN) navigate("/admin-dashboard");
//         else if (role === ROLE_MANAGER) navigate("/manager-dashboard");
//         else if (role === ROLE_RECEPTIONIST) navigate("/receptionist-dashboard");
//         else navigate("/add-reservation");
//       } else {
//         setError("Invalid credentials");
//       }
//     } catch (err) {
//       const msg = err?.response?.data?.message || "Invalid username or password";
//       setError(msg);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-8 mt-10 border rounded shadow">
//       <h2 className="text-2xl font-bold mb-4 text-center">{fromCheckAvailability() ? "Customer Login" : "Staff Login"}</h2>
//       <p className="text-sm text-gray-600 mb-4">
//         {fromCheckAvailability()
//           ? "Log in to complete your reservation with your selected room."
//           : "Admin, Manager, or Receptionist only. Customers must use Check Availability to register and log in."}
//       </p>
//       {error && <p className="text-red-500 mb-2">{error}</p>}
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Username"
//           className="border p-2 w-full mb-2 rounded"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           className="border p-2 w-full mb-4 rounded"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700">
//           Login
//         </button>
//       </form>
//     </div>
//   );
// }
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { loginUser } from "../Services/authService";
import { ROLE_ADMIN, ROLE_MANAGER, ROLE_RECEPTIONIST } from "../constants/roles";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);

  const fromCheckAvailability = () => sessionStorage.getItem("availabilityVerified") && sessionStorage.getItem("selectedRoom");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    if (token && role) {
      if (role === ROLE_ADMIN) navigate("/admin-dashboard", { replace: true });
      else if (role === ROLE_MANAGER) navigate("/manager-dashboard", { replace: true });
      else if (role === ROLE_RECEPTIONIST) navigate("/receptionist-dashboard", { replace: true });
      else if (role === "customer") navigate("/customer-dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await loginUser({ username, password });
      if (res.data?.token) {
        const role = (res.data?.role || "").toLowerCase();
        // Staff-only when accessed from navbar (no Check Availability flow). Customers must come from Check Availability.
        if (role === "customer" && !fromCheckAvailability()) {
          setError("Customers must use Check Availability, select a room, then log in from that page.");
          return;
        }
        localStorage.setItem("userRole", role);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", username);
        login({ role, username });
        if (role === ROLE_ADMIN) navigate("/admin-dashboard");
        else if (role === ROLE_MANAGER) navigate("/manager-dashboard");
        else if (role === ROLE_RECEPTIONIST) navigate("/receptionist-dashboard");
        else navigate("/add-reservation");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Invalid username or password";
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50 flex items-center justify-center px-4 py-12">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-tl from-amber-400 to-orange-600 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-md w-full">
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-8 sm:p-10 border border-white/20 animate-[fadeInUp_0.6s_ease-out]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg">
              🔐
            </div>
            <h2 className="text-3xl font-serif text-slate-900 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {fromCheckAvailability() ? "Customer Login" : "Staff Login"}
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-600 to-amber-600 mx-auto mb-4"></div>
            <p className="text-slate-600 text-sm leading-relaxed">
              {fromCheckAvailability()
                ? "Log in to complete your reservation with your selected room."
                : "Admin, Manager, or Receptionist only. Customers must use Check Availability to register and log in."}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 animate-[shake_0.3s_ease-in-out]">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <p className="text-red-700 text-sm flex-1">{error}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white/50 backdrop-blur-sm focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white/50 backdrop-blur-sm focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-medium hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 text-lg"
            >
              Login
            </button>
          </form>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');
        
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
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}