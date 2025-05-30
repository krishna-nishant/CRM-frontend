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
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

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

  const handleGetSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/campaigns/suggestions`,
        {},
        { withCredentials: true }
      );
      setSuggestions(response.data.suggestions);
    } catch (error) {
      console.error('Error getting suggestions:', error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    setCampaignData({
      name: suggestion.name,
      message: suggestion.message,
      rules: suggestion.rules ? suggestion.rules.map(rule => ({
        ...rule,
        id: Date.now() + Math.random()
      })) : []
    });
    setSuggestions([]);
    handlePreview();
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
      <div className="mb-6">
        <button
          type="button"
          onClick={handleGetSuggestions}
          disabled={loadingSuggestions}
          className={`w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
            loadingSuggestions ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {loadingSuggestions ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner size="sm" className="mr-2" />
              Getting Suggestions...
            </div>
          ) : (
            'Get Campaign Suggestions'
          )}
        </button>
      </div>

      {suggestions.length > 0 && (
        <div className="mb-6 space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Suggested Campaigns</h3>
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-4 border rounded-md hover:bg-gray-50 cursor-pointer"
                onClick={() => handleSuggestionSelect(suggestion)}
              >
                <h4 className="font-medium text-gray-900">{suggestion.name}</h4>
                <p className="text-sm text-gray-500 mt-1">{suggestion.objective}</p>
                {suggestion.audienceSize && (
                  <div className="mt-2 text-sm text-gray-600">
                    Estimated audience: {suggestion.audienceSize} customers
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

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
            Target Audience Rules
          </label>
          <div className="space-y-4">
            <NaturalLanguageInput onRulesGenerated={handleRulesGenerated} />
            <RuleBuilder
              rules={campaignData.rules}
              onChange={(rules) => {
                setCampaignData({ ...campaignData, rules });
                handlePreview();
              }}
            />
          </div>
        </div>

        {previewStats && (
          <div className="bg-blue-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-blue-900">Preview</h4>
            <p className="mt-1 text-sm text-blue-700">
              Estimated audience size: {previewStats.audienceSize} customers
              <br />
              Estimated delivery time: {previewStats.estimatedDeliveryTime}
            </p>
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