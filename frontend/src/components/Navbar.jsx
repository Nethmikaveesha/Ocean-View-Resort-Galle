import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-700 text-white p-4 flex gap-6">
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/help">Help</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
    </nav>
  );
}
