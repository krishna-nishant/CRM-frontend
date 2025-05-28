import React, { useState } from 'react';
import axios from 'axios';

const NaturalLanguageInput = ({ onRulesGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/campaigns/natural-language`,
        { prompt },
        { withCredentials: true }
      );

      onRulesGenerated(response.data.rules);
      setPrompt('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process natural language input');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Natural Language Rules</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
            Describe your target audience
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Customers who spent more than 10000 and visited less than 3 times"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
        </div>
        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || !prompt.trim()}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            loading || !prompt.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Processing...' : 'Generate Rules'}
        </button>
      </div>
    </div>
  );
};

export default NaturalLanguageInput; 