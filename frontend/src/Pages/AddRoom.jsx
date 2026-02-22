
export default function AddRoom() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-amber-50 py-12 px-4">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-tl from-amber-400 to-orange-600 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 animate-[fadeIn_0.8s_ease-out]">
          <div className="inline-block mb-4">
            <span className="text-cyan-700 text-sm font-medium tracking-[0.3em] uppercase border-b-2 border-cyan-700 pb-2">
              Room Management
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-serif mb-4 text-slate-900" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Add New Room
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-600 to-amber-600 mx-auto mb-4"></div>
          <p className="text-slate-600">
            Add a new room to the resort's inventory
          </p>
        </div>

        {/* Form */}
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-8 sm:p-10 border border-white/20 animate-[fadeInUp_0.9s_ease-out]">
          <div className="space-y-6">
            {/* Room Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Room Type
              </label>
              <input
                placeholder="e.g., Single, Double, Deluxe"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white/50 backdrop-blur-sm focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 outline-none"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Price per Night (LKR)
              </label>
              <input
                placeholder="e.g., 15000"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white/50 backdrop-blur-sm focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 outline-none"
              />
            </div>

            {/* Room Number */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Room Number
              </label>
              <input
                placeholder="e.g., 101"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white/50 backdrop-blur-sm focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 outline-none"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Room Image
              </label>
              <div className="relative">
                <input
                  type="file"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white/50 backdrop-blur-sm focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">Upload a high-quality image of the room</p>
            </div>

            {/* Preview Section */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 rounded-2xl p-6">
              <p className="text-sm font-medium text-slate-700 mb-3">Preview</p>
              <div className="aspect-video bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl flex items-center justify-center">
                <div className="text-center text-slate-400">
                  <span className="text-6xl mb-2 block">🏨</span>
                  <p className="text-sm">Room image preview will appear here</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-medium hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 text-lg">
              Add Room to Inventory
            </button>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-8 bg-cyan-50 border-2 border-cyan-200 rounded-2xl p-6 animate-[fadeInUp_1s_ease-out]">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl flex-shrink-0">
              💡
            </div>
            <div>
              <h4 className="font-semibold text-cyan-900 mb-2">Room Management Tips</h4>
              <ul className="space-y-1 text-sm text-cyan-800">
                <li>• Ensure all room types are unique and clearly named</li>
                <li>• Upload high-resolution images for better presentation</li>
                <li>• Double-check pricing before adding to inventory</li>
                <li>• Room numbers should be unique within the system</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}