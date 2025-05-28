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
    <div>
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
            placeholder="Examples:
- Customers who spent between ₹3,000 and ₹14,000 AND visited more than 5 times
- Customers who spent more than ₹10,000 OR haven't visited in the last 30 days
- Customers who visited between 3 and 8 times AND spent less than ₹5,000
- Customers who spent between ₹1,000 and ₹5,000 OR visited more than 10 times
- Customers who haven't visited in 60 days AND spent between ₹8,000 and ₹15,000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="6"
          />
          <p className="mt-2 text-sm text-gray-500">
            You can combine conditions using AND/OR and specify ranges using 'between'. Available conditions: Total Spent (₹), Number of Visits, Days Since Last Visit
          </p>
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