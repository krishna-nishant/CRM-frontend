import { useState } from 'react';
import Modal from './Modal';
import RuleBuilder from './RuleBuilder';

const CreateCampaign = ({ isOpen, onClose, onSubmit }) => {
  const [campaignData, setCampaignData] = useState({
    name: '',
    message: '',
    rules: []
  });

  const [previewStats, setPreviewStats] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit(campaignData);
  };

  const handlePreview = async () => {
    setPreviewStats({
      audienceSize: 0,
      estimatedDeliveryTime: '5 minutes'
    });
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
            Audience Rules
          </label>
          <RuleBuilder
            rules={campaignData.rules}
            onChange={(rules) => setCampaignData({ ...campaignData, rules })}
          />
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
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Preview Audience
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create Campaign
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateCampaign; 