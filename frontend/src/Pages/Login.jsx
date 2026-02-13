import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { loginUser } from "../Services/authService";
import { ROLE_ADMIN, ROLE_MANAGER, ROLE_RECEPTIONIST } from "../constants/roles";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    if (token && role) {
      if (role === ROLE_ADMIN) navigate("/admin-dashboard", { replace: true });
      else if (role === ROLE_MANAGER) navigate("/manager-dashboard", { replace: true });
      else if (role === ROLE_RECEPTIONIST) navigate("/receptionist-dashboard", { replace: true });
      else navigate("/customer-dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await loginUser({ username, password });
      if (res.data?.token) {
        const role = (res.data?.role || "").toLowerCase();
        localStorage.setItem("userRole", role);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", username);
        login({ role, username });
        if (role === ROLE_ADMIN) navigate("/admin-dashboard");
        else if (role === ROLE_MANAGER) navigate("/manager-dashboard");
        else if (role === ROLE_RECEPTIONIST) navigate("/receptionist-dashboard");
        else {
          const fromCheck = sessionStorage.getItem("availabilityVerified");
          navigate(fromCheck ? "/add-reservation" : "/customer-dashboard");
        }
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Invalid username or password";
      setError(msg);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 mt-10 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <p className="text-sm text-gray-600 mb-4">
        Admin or customer? Use your username and password to sign in.
      </p>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          className="border p-2 w-full mb-2 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700">
          Login
        </button>
        <p className="mt-3 text-sm text-gray-600">
          New customer? <Link to="/register" className="text-blue-600 underline">Register here</Link>
        </p>
      </form>
    </div>
  );
}
