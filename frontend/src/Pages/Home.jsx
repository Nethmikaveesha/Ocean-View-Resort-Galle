import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRooms } from "../Services/api";

export default function Home() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getRooms();
        setRooms(data || []);
      } catch (err) {
        setError("Failed to load rooms.");
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div>
      {/* Hero image */}
      <div className="relative w-full h-[400px] sm:h-[500px] overflow-hidden">
        <img
          src="/resort-hero.jpg"
          alt="Ocean View Resort - Pool and Gardens"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl sm:text-5xl font-bold mb-2 drop-shadow-lg">Ocean View Resort</h1>
            <p className="text-xl sm:text-2xl drop-shadow">Galle</p>
          </div>
        </div>
      </div>

      <div className="p-8">
        <p className="text-gray-600 mb-8">Check room availability before registering.</p>

      {/* Rooms added by admin - with images */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Our Rooms</h2>
        {loading ? (
          <p className="text-gray-500">Loading rooms...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : rooms.length === 0 ? (
          <p className="text-gray-500">No rooms added yet. Contact admin.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white"
              >
                <div className="aspect-[4/3] bg-gray-200 flex items-center justify-center">
                  {room.imageBase64 ? (
                    <img
                      src={room.imageBase64}
                      alt={room.type}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-4xl">{room.type?.charAt(0) || "R"}</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{room.type}</h3>
                  <p className="text-gray-600">LKR {room.price?.toLocaleString() || "0"} / night</p>
                  <p className="text-sm text-gray-500">Room #{room.roomNumber || room.id}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

        <button
          onClick={() => navigate("/check")}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium"
        >
          Check Availability
        </button>
      </div>
    </div>
  );
}
