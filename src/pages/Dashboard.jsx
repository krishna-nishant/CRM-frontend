const Dashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Total Customers</h2>
          <p className="text-4xl font-bold text-blue-600">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Active Campaigns</h2>
          <p className="text-4xl font-bold text-green-600">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Message Delivery Rate</h2>
          <p className="text-4xl font-bold text-purple-600">0%</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 