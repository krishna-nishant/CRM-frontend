import { Link } from 'react-router-dom'
import { UserCircleIcon } from '@heroicons/react/24/outline'

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              CRM Platform
            </Link>
            <div className="hidden md:flex ml-10 space-x-8">
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Link to="/customers" className="text-gray-600 hover:text-gray-900">
                Customers
              </Link>
              <Link to="/campaigns" className="text-gray-600 hover:text-gray-900">
                Campaigns
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <Link to="/login" className="flex items-center text-gray-600 hover:text-gray-900">
              <UserCircleIcon className="h-6 w-6 mr-1" />
              <span>Login</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 