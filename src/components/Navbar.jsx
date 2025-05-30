import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { UserCircleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-white">CRM Platform</span>
            </Link>
            
            {user && (
              <div className="hidden md:flex ml-10 items-center space-x-6">
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
              <div className="hidden md:flex items-center space-x-4">
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
            
            {/* Mobile menu button */}
            {user && (
              <div className="flex items-center md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none"
                >
                  {isMenuOpen ? (
                    <XMarkIcon className="h-6 w-6" />
                  ) : (
                    <Bars3Icon className="h-6 w-6" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && user && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 border-t border-blue-500">
            <Link
              to="/"
              className="text-white hover:bg-blue-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/customers"
              className="text-white hover:bg-blue-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Customers
            </Link>
            <Link
              to="/campaigns"
              className="text-white hover:bg-blue-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Campaigns
            </Link>
            <div className="border-t border-blue-500 pt-2 mt-2">
              <div className="px-3 py-2 flex items-center space-x-2">
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
                onClick={() => {
                  setIsMenuOpen(false);
                  logout();
                }}
                className="text-white hover:bg-blue-600 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar 