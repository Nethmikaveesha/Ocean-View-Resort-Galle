import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import About from "./pages/About";
import Help from "./pages/Help";
import Login from "./pages/Login";
import Register from "./pages/Register";

import CustomerDashboard from "./pages/CustomerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AddReservation from "./pages/AddReservation";
import ViewReservation from "./pages/ViewReservation";
import AddRoom from "./pages/AddRoom";
import CheckAvailability from "./pages/CheckAvailability";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/help" element={<Help />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Customer */}
        <Route path="/check" element={<CheckAvailability />} />
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/reservation/add" element={<AddReservation />} />
        <Route path="/reservation/view" element={<ViewReservation />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/add-room" element={<AddRoom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
