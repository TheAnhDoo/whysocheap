export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          TailwindCSS Test
        </h1>
        <div className="space-y-4">
          <div className="bg-purple-100 p-4 rounded-lg">
            <p className="text-purple-800 font-medium">Purple Background</p>
          </div>
          <div className="bg-pink-100 p-4 rounded-lg">
            <p className="text-pink-800 font-medium">Pink Background</p>
          </div>
          <button className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-semibold">
            Test Button
          </button>
        </div>
      </div>
    </div>
  )
}
