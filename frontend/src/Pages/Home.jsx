import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">
        Ocean View Resort – Galle
      </h1>
      <p className="mb-6">
        Check room availability before registering.
      </p>

      <button
        onClick={() => navigate("/check")}
        className="bg-green-600 text-white px-6 py-2 rounded"
      >
        Check Availability
      </button>
    </div>
  );
}
