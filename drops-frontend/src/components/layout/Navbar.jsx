import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="text-xl font-bold text-indigo-600">
            Drops
          </Link>

          <div className="flex items-center gap-1">
            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/dashboard') ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/habits"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/habits') ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Hábitos
            </Link>
            <Link
              to="/categories"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/categories') ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Categorías
            </Link>
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/admin') ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Admin
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{user?.name}</span>
            <button
              onClick={logout}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
