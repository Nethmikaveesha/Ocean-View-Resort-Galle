import { useState } from "react";
import { loginUser } from "./services/authService";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    try {
      const res = await loginUser(form);
      alert("Login successful");
      console.log(res.data);
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      <input name="username" onChange={handleChange} placeholder="Username" className="border p-2 w-full mb-2" />
      <input name="password" type="password" onChange={handleChange} placeholder="Password" className="border p-2 w-full mb-4" />

      <button onClick={handleLogin} className="bg-blue-600 text-white px-6 py-2 rounded">
        Login
      </button>
    </div>
  );
}
