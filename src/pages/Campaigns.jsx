import { useState, useEffect } from 'react'

const Campaigns = () => {
  const [showNewCampaign, setShowNewCampaign] = useState(false)
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true)
        // const response = await fetch('/api/campaigns')
        // const data = await response.json()
        // setCampaigns(data)
        setCampaigns([])
      } catch (error) {
        console.error('Error fetching campaigns:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCampaigns()
  }, [])

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Campaigns</h1>
        <button 
          onClick={() => setShowNewCampaign(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Campaign
        </button>
      </div>

      <div className="grid gap-6">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : campaigns.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-lg font-medium text-gray-900">No campaigns yet</h3>
            <p className="mt-2 text-gray-500">Create your first campaign to get started</p>
          </div>
        ) : (
          campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{campaign.name}</h3>
                  <p className="mt-1 text-gray-500">Created on {new Date(campaign.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  campaign.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {campaign.status}
                </span>
              </div>
              
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Audience Size</p>
                  <p className="text-lg font-semibold">{campaign.audienceSize}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Delivered</p>
                  <p className="text-lg font-semibold text-green-600">{campaign.delivered}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Failed</p>
                  <p className="text-lg font-semibold text-red-600">{campaign.failed}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Campaign creation modal will be added here */}
    </div>
  )
}

export default Campaigns 