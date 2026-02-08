import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "./services/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Admin hard-coded login
      if (username === "admin" && password === "admin123") {
        localStorage.setItem("userRole", "admin");
        navigate("/admin-dashboard");
        return;
      }

      // Customer login via backend
      const res = await loginUser({ username, password });
      if (res.success) {
        localStorage.setItem("userRole", "customer");
        localStorage.setItem("username", username);
        navigate("/customer-dashboard");
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError("Login failed. Try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 mt-10 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          className="border p-2 w-full mb-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
