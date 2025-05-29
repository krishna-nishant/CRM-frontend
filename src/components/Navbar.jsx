import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { UserCircleIcon } from '@heroicons/react/24/outline'

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-white">CRM Platform</span>
            </Link>
            
            {user && (
              <div className="ml-10 flex items-center space-x-6">
                <Link to="/" className="text-white hover:text-blue-100 transition-colors px-3 py-2 text-sm font-medium rounded-md hover:bg-blue-600">
                  Dashboard
                </Link>
                <Link to="/customers" className="text-white hover:text-blue-100 transition-colors px-3 py-2 text-sm font-medium rounded-md hover:bg-blue-600">
                  Customers
                </Link>
                <Link to="/campaigns" className="text-white hover:text-blue-100 transition-colors px-3 py-2 text-sm font-medium rounded-md hover:bg-blue-600">
                  Campaigns
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="w-8 h-8 rounded-full ring-2 ring-white"
                    />
                  ) : (
                    <UserCircleIcon className="h-8 w-8 text-white" />
                  )}
                  <span className="text-white text-sm font-medium">{user.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="text-white hover:text-blue-100 transition-colors px-3 py-2 text-sm font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center text-white hover:text-blue-100 transition-colors"
              >
                <UserCircleIcon className="h-6 w-6 mr-1" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 