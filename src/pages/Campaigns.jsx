import { useState, useEffect } from 'react'
import axios from 'axios'
import CreateCampaign from '../components/CreateCampaign'

const Campaigns = () => {
  const [showNewCampaign, setShowNewCampaign] = useState(false)
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    message: '',
    rules: [{ condition: 'totalSpent', operator: 'gt', value: 0 }]
  })
  const [previewStats, setPreviewStats] = useState(null)

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/campaigns', {
        withCredentials: true
      })
      setCampaigns(response.data)
    } catch (error) {
      console.error('Error fetching campaigns:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePreview = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3000/api/campaigns/preview',
        { rules: newCampaign.rules },
        { withCredentials: true }
      )
      setPreviewStats(response.data)
    } catch (error) {
      console.error('Error previewing campaign:', error)
    }
  }

  const handleCreateCampaign = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:3000/api/campaigns', newCampaign, {
        withCredentials: true
      })
      setShowNewCampaign(false)
      setNewCampaign({
        name: '',
        message: '',
        rules: [{ condition: 'totalSpent', operator: 'gt', value: 0 }]
      })
      fetchCampaigns()
    } catch (error) {
      console.error('Error creating campaign:', error)
    }
  }

  const addRule = () => {
    setNewCampaign({
      ...newCampaign,
      rules: [...newCampaign.rules, { condition: 'totalSpent', operator: 'gt', value: 0 }]
    })
  }

  const updateRule = (index, field, value) => {
    const updatedRules = [...newCampaign.rules]
    updatedRules[index] = { ...updatedRules[index], [field]: value }
    setNewCampaign({ ...newCampaign, rules: updatedRules })
  }

  const removeRule = (index) => {
    const updatedRules = newCampaign.rules.filter((_, i) => i !== index)
    setNewCampaign({ ...newCampaign, rules: updatedRules })
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
                Delivered
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Failed
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {campaigns.map((campaign) => (
              <tr key={campaign._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    campaign.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {campaign.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{campaign.audienceSize}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{campaign.delivered}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{campaign.failed}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showNewCampaign && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-xl font-bold mb-4">Create New Campaign</h2>
            <form onSubmit={handleCreateCampaign}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Campaign Name</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    required
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={newCampaign.message}
                    onChange={(e) => setNewCampaign({ ...newCampaign, message: e.target.value })}
                    placeholder="Use {name} to personalize the message"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Targeting Rules</label>
                  {newCampaign.rules.map((rule, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <select
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={rule.condition}
                        onChange={(e) => updateRule(index, 'condition', e.target.value)}
                      >
                        <option value="totalSpent">Total Spent</option>
                        <option value="lastPurchase">Last Purchase</option>
                      </select>
                      <select
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={rule.operator}
                        onChange={(e) => updateRule(index, 'operator', e.target.value)}
                      >
                        <option value="gt">Greater than</option>
                        <option value="lt">Less than</option>
                        <option value="eq">Equal to</option>
                      </select>
                      <input
                        type="number"
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={rule.value}
                        onChange={(e) => updateRule(index, 'value', Number(e.target.value))}
                      />
                      {newCampaign.rules.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRule(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addRule}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Add Rule
                  </button>
                </div>

                {previewStats && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-md">
                    <h3 className="text-sm font-medium text-gray-700">Preview</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Estimated audience size: {previewStats.audienceSize}
                      <br />
                      Estimated delivery time: {previewStats.estimatedDeliveryTime}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handlePreview}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Preview
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewCampaign(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  Create Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Campaigns 