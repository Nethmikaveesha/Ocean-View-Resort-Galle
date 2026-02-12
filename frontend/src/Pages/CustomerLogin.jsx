import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../Services/authService";
import { AuthContext } from "../context/AuthContext";

export default function CustomerLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!sessionStorage.getItem("availabilityVerified")) {
      setError("Please check room availability first, then return here to log in.");
      return;
    }

    try {
      const res = await loginUser({ username, password });
      if (res.data?.token || res.data) {
        localStorage.setItem("userRole", "customer");
        localStorage.setItem("username", username);
        if (res.data?.token) localStorage.setItem("token", res.data.token);
        login({ role: "customer", username });
        navigate("/add-reservation");
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      const status = err?.response?.status;
      const data = err?.response?.data;
      const msg = typeof data === "string" ? data : data?.message;
      const msgStr = (msg || "").toLowerCase();
      if (status === 401 || msgStr.includes("bad credential") || msgStr.includes("invalid")) {
        setError("Invalid username or password");
      } else if (err?.message === "Network Error" || !err?.response) {
        setError("Cannot reach server. Please ensure the backend is running.");
      } else {
        setError(typeof msg === "string" ? msg : "Login failed. Try again.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 mt-10 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Customer Login</h2>
      <p className="text-sm text-gray-600 mb-4">Log in to add a reservation. You must have checked availability first.</p>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          className="border p-2 w-full mb-2 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700">
          Login
        </button>
        <p className="mt-3 text-sm text-gray-600">
          New customer? <Link to="/customer-register" className="text-blue-600 underline">Register here</Link>
        </p>
      </form>
    </div>
  );
}
