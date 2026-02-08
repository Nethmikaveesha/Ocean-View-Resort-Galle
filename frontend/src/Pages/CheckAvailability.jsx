import { useState } from "react";

export default function CheckAvailability() {
  const [available, setAvailable] = useState(false);

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Check Availability</h2>

      <input type="date" className="border p-2 mr-2" />
      <input type="date" className="border p-2 mr-2" />

      <button
        onClick={() => setAvailable(true)}
        className="bg-blue-600 text-white px-4 py-2"
      >
        Check
      </button>

      {available && (
        <p className="mt-4 text-green-600">
          Rooms available! You may register.
        </p>
      )}
    </div>
  );
}
