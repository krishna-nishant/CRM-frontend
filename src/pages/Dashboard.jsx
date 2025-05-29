import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { 
  UserGroupIcon, 
  CurrencyRupeeIcon, 
  ChartBarIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState({
    totalCustomers: 0,
    totalCampaigns: 0,
    totalRevenue: 0,
    averageSpent: 0,
    spendingRanges: {
      low: 0,
      medium: 0,
      high: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [metricsRes, campaignsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/metrics`, { withCredentials: true }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/campaigns`, { withCredentials: true })
      ]);

      setMetrics({
        totalCustomers: metricsRes.data.totalCustomers || 0,
        totalCampaigns: metricsRes.data.totalCampaigns || 0,
        totalRevenue: metricsRes.data.totalRevenue || 0,
        averageSpent: metricsRes.data.averageSpent || 0,
        spendingRanges: metricsRes.data.spendingDistribution || {
          low: 0,
          medium: 0,
          high: 0
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, subtitle, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color.replace('text', 'bg')}/10`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <div className="mb-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name || 'User'}
        </h1>
        <div className="flex items-center text-blue-100">
          <EnvelopeIcon className="h-5 w-5 mr-2" />
          <span>{user?.email}</span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Customers"
          value={metrics.totalCustomers.toLocaleString()}
          icon={UserGroupIcon}
          color="text-blue-600"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${metrics.totalRevenue.toLocaleString('en-IN')}`}
          icon={CurrencyRupeeIcon}
          color="text-green-600"
        />
        <StatCard
          title="Average Spent"
          value={`₹${metrics.averageSpent.toLocaleString('en-IN')}`}
          subtitle="per customer"
          icon={ChartBarIcon}
          color="text-purple-600"
        />
        <StatCard
          title="Active Campaigns"
          value={metrics.totalCampaigns.toLocaleString()}
          icon={UserGroupIcon}
          color="text-orange-600"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Segments</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Basic</span>
              <span className="text-xs text-gray-500">₹1k-5k</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-blue-600">
                {metrics.spendingRanges.low}
              </span>
              <span className="text-sm text-gray-500 mb-1">customers</span>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Premium</span>
              <span className="text-xs text-gray-500">₹5k-15k</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-purple-600">
                {metrics.spendingRanges.medium}
              </span>
              <span className="text-sm text-gray-500 mb-1">customers</span>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">VIP</span>
              <span className="text-xs text-gray-500">₹15k+</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-green-600">
                {metrics.spendingRanges.high}
              </span>
              <span className="text-sm text-gray-500 mb-1">customers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 