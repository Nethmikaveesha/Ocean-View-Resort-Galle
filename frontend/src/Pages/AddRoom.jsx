export default function AddRoom() {
  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Add Room</h2>

      <input placeholder="Room Type" className="border p-2 block mb-2" />
      <input placeholder="Price" className="border p-2 block mb-2" />
      <input type="file" className="border p-2 block mb-4" />

      <button className="bg-blue-700 text-white px-6 py-2">
        Add Room
      </button>
    </div>
  );
}
