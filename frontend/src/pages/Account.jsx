import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, LogOut, Heart, ShoppingBag, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * Account page component
 * User profile and account settings
 */
const Account = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    navigate('/');
  };

  const stats = [
    {
      icon: Heart,
      label: 'Favorites',
      value: user?.favorites?.length || 0,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
    },
    {
      icon: ShoppingBag,
      label: 'Orders',
      value: 0,
      color: 'text-savora-green-600',
      bgColor: 'bg-savora-green-50',
    },
    {
      icon: Calendar,
      label: 'Meal Plans',
      value: 1,
      color: 'text-savora-brown-600',
      bgColor: 'bg-savora-brown-50',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-savora-brown-800 mb-2">
          My Account
        </h1>
        <p className="text-savora-brown-500">
          Manage your profile and preferences
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="md:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <h2 className="text-xl font-serif font-semibold text-savora-brown-800 mb-6">
              Profile Information
            </h2>

            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="w-20 h-20 bg-savora-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-3xl font-serif font-bold text-savora-green-600">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>

              {/* Details */}
              <div className="flex-1 space-y-4">
                <div>
                  <label className="text-sm text-savora-brown-500">Full Name</label>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="w-4 h-4 text-savora-brown-400" />
                    <span className="text-savora-brown-800 font-medium">
                      {user?.name || 'Not set'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-savora-brown-500">Email Address</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4 text-savora-brown-400" />
                    <span className="text-savora-brown-800 font-medium">
                      {user?.email || 'Not set'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-savora-brown-500">Member Since</label>
                  <p className="text-savora-brown-800 font-medium mt-1">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric',
                        })
                      : 'January 2026'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="space-y-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card flex items-center gap-4"
            >
              <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-savora-brown-800">
                  {stat.value}
                </p>
                <p className="text-sm text-savora-brown-500">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8"
      >
        <div className="card">
          <h2 className="text-xl font-serif font-semibold text-savora-brown-800 mb-6">
            Account Actions
          </h2>

          <div className="space-y-4">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              <LogOut className="w-5 h-5" />
              {isLoggingOut ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Account;
