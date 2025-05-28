import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import CreateCampaign from '../components/CreateCampaign'

const Campaigns = () => {
  const [showNewCampaign, setShowNewCampaign] = useState(false)
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [campaignStats, setCampaignStats] = useState({})
  const [pollingCampaigns, setPollingCampaigns] = useState(new Set())

  useEffect(() => {
    fetchCampaigns()
  }, [])

  // Set up polling for active campaigns
  useEffect(() => {
    const pollInterval = setInterval(() => {
      campaigns.forEach(campaign => {
        if (campaign.status === 'active' || pollingCampaigns.has(campaign._id)) {
          fetchCampaignStats(campaign._id)
        }
      })
    }, 2000) // Poll every 2 seconds

    return () => clearInterval(pollInterval)
  }, [campaigns, pollingCampaigns])

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/campaigns`, {
        withCredentials: true
      })
      setCampaigns(response.data)
      // Fetch stats for each campaign
      response.data.forEach(campaign => {
        fetchCampaignStats(campaign._id)
      })
    } catch (error) {
      console.error('Error fetching campaigns:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCampaignStats = async (campaignId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/campaigns/${campaignId}/stats`,
        { withCredentials: true }
      )
      setCampaignStats(prev => ({
        ...prev,
        [campaignId]: response.data
      }))

      // Update campaign status in the campaigns list if needed
      setCampaigns(prevCampaigns => {
        const campaignIndex = prevCampaigns.findIndex(c => c._id === campaignId)
        if (campaignIndex === -1) return prevCampaigns

        const updatedCampaigns = [...prevCampaigns]
        if (response.data.status !== updatedCampaigns[campaignIndex].status) {
          updatedCampaigns[campaignIndex] = {
            ...updatedCampaigns[campaignIndex],
            status: response.data.status
          }
        }
        return updatedCampaigns
      })

      // Stop polling if campaign is completed or failed
      if (response.data.status === 'completed' || response.data.status === 'failed') {
        setPollingCampaigns(prev => {
          const updated = new Set(prev)
          updated.delete(campaignId)
          return updated
        })
      }
    } catch (error) {
      console.error(`Error fetching stats for campaign ${campaignId}:`, error)
    }
  }

  const handleStartCampaign = async (campaignId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/campaigns/${campaignId}/start`,
        {},
        { withCredentials: true }
      )
      setPollingCampaigns(prev => new Set([...prev, campaignId]))
      fetchCampaigns()
    } catch (error) {
      console.error('Error starting campaign:', error)
      alert('Failed to start campaign. Please try again.')
    }
  }

  const handleCreateCampaign = async (campaignData) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/campaigns`, campaignData, {
        withCredentials: true
      })
      setShowNewCampaign(false)
      fetchCampaigns()
    } catch (error) {
      console.error('Error creating campaign:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
        <button 
          onClick={() => setShowNewCampaign(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Create Campaign
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Audience Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {campaigns.map((campaign) => {
              const stats = campaignStats[campaign._id] || { queued: 0, sent: 0, failed: 0 }
              const total = stats.queued + stats.sent + stats.failed || campaign.audienceSize || 0
              const progress = total > 0 ? Math.round(((stats.sent + stats.failed) / total) * 100) : 0

              return (
                <tr key={campaign._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      campaign.status === 'completed' ? 'bg-green-100 text-green-800' :
                      campaign.status === 'active' ? 'bg-blue-100 text-blue-800' :
                      campaign.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{campaign.audienceSize}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          campaign.status === 'failed' ? 'bg-red-600' :
                          campaign.status === 'completed' ? 'bg-green-600' :
                          'bg-blue-600'
                        }`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="text-xs mt-1 text-gray-500">
                      {stats.sent} sent, {stats.failed} failed, {stats.queued} queued
                      {campaign.status === 'active' && (
                        <span className="ml-2 animate-pulse">Processing...</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {campaign.status === 'draft' && (
                      <button
                        onClick={() => handleStartCampaign(campaign._id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700"
                      >
                        Start Campaign
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <CreateCampaign
        isOpen={showNewCampaign}
        onClose={() => setShowNewCampaign(false)}
        onSubmit={handleCreateCampaign}
      />
    </div>
  )
}

export default Campaigns 