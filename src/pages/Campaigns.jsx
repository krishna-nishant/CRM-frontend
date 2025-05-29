import { useState, useEffect } from 'react'
import axios from 'axios'
import { 
  MegaphoneIcon, 
  UserGroupIcon, 
  PlayIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PlusIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import CreateCampaign from '../components/CreateCampaign'
import LoadingSpinner from '../components/LoadingSpinner'

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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />
      case 'failed':
        return <XCircleIcon className="w-5 h-5 text-red-500" />
      case 'active':
        return <ClockIcon className="w-5 h-5 text-blue-500 animate-spin" />
      case 'draft':
        return <PlayIcon className="w-5 h-5 text-gray-500" />
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'active':
        return 'bg-blue-100 text-blue-800'
      case 'draft':
        return 'bg-gray-100 text-gray-600'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const CampaignCard = ({ campaign }) => {
    const stats = campaignStats[campaign._id] || {}
    const statusClass = getStatusBadgeColor(campaign.status)

    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <MegaphoneIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">{campaign.name}</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass} mt-1`}>
                  <span className="mr-1.5">{getStatusIcon(campaign.status)}</span>
                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                </span>
              </div>
            </div>
            {(campaign.status === 'pending' || campaign.status === 'draft') && (
              <button
                onClick={() => handleStartCampaign(campaign._id)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <PlayIcon className="h-4 w-4 mr-1.5" />
                Start
              </button>
            )}
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <UserGroupIcon className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Audience Size</p>
                <p className="text-lg font-medium text-gray-900">
                  {campaign.audienceSize.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Delivered</p>
                <p className="text-lg font-medium text-gray-900">
                  {(stats.sent || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <XCircleIcon className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Failed</p>
                <p className="text-lg font-medium text-red-600">
                  {(stats.failed || 0).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <ChartBarIcon className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Success Rate</p>
                <p className="text-lg font-medium text-green-600">
                  {stats.sent ? Math.round((stats.sent / (stats.sent + stats.failed)) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.round((stats.sent || 0) / campaign.audienceSize * 100)}%`
                }}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
        <button
          onClick={() => setShowNewCampaign(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign._id} campaign={campaign} />
        ))}
      </div>

      {showNewCampaign && (
        <CreateCampaign
          isOpen={showNewCampaign}
          onClose={() => setShowNewCampaign(false)}
          onSubmit={(newCampaign) => {
            setCampaigns(prev => [newCampaign, ...prev]);
            setShowNewCampaign(false);
            fetchCampaignStats(newCampaign._id);
          }}
        />
      )}
    </div>
  )
}

export default Campaigns 