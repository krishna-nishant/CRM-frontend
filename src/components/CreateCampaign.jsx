import { useState } from 'react';
import Modal from './Modal';
import RuleBuilder from './RuleBuilder';
import NaturalLanguageInput from './NaturalLanguageInput';
import LoadingSpinner from './LoadingSpinner';
import axios from 'axios';

const CreateCampaign = ({ isOpen, onClose, onSubmit }) => {
  const [campaignData, setCampaignData] = useState({
    name: '',
    message: '',
    rules: []
  });

  const [previewStats, setPreviewStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submitData = {
        ...campaignData,
        rules: campaignData.rules.map(({ id, ...rule }) => rule)
      };
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/campaigns`,
        submitData,
        { withCredentials: true }
      );
      onSubmit(response.data);
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async () => {
    if (!campaignData.rules.length) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/campaigns/preview`,
        { rules: campaignData.rules.map(({ id, ...rule }) => rule) },
        { withCredentials: true }
      );
      setPreviewStats(response.data);
    } catch (error) {
      console.error('Error getting preview:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRulesGenerated = (rules) => {
    const rulesWithIds = rules.map(rule => ({
      ...rule,
      id: Date.now() + Math.random()
    }));
    setCampaignData(prev => ({ ...prev, rules: rulesWithIds }));
    handlePreview();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Campaign">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Campaign Name
          </label>
          <input
            type="text"
            value={campaignData.name}
            onChange={(e) => setCampaignData({ ...campaignData, name: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="Enter campaign name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message Template
          </label>
          <textarea
            value={campaignData.message}
            onChange={(e) => setCampaignData({ ...campaignData, message: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="Hi {name}, here's a special offer for you!"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Define Your Audience
          </label>
          <div className="space-y-4">
            <NaturalLanguageInput onRulesGenerated={handleRulesGenerated} />
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or use the rule builder
                </span>
              </div>
            </div>
            <RuleBuilder
              rules={campaignData.rules}
              onChange={(rules) => {
                setCampaignData({ ...campaignData, rules });
                setPreviewStats(null);
              }}
            />
          </div>
        </div>

        {previewStats && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900">Audience Preview</h3>
            <p className="text-blue-700">Estimated audience size: {previewStats.audienceSize}</p>
            <p className="text-blue-700">Estimated delivery time: {previewStats.estimatedDeliveryTime}</p>
          </div>
        )}

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={handlePreview}
            disabled={loading || !campaignData.rules.length}
            className={`px-4 py-2 rounded inline-flex items-center ${
              loading || !campaignData.rules.length
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Loading...
              </>
            ) : (
              'Preview Audience'
            )}
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded text-white inline-flex items-center ${
              loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Creating...
              </>
            ) : (
              'Create Campaign'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateCampaign; 