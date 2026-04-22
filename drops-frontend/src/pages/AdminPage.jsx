import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Alert from '../components/common/Alert';
import Button from '../components/common/Button';

export default function AdminPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUsers = () => {
    setLoading(true);
    api.get('/admin/users')
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadUsers(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`¿Eliminar al usuario "${name}"? Esta acción no se puede deshacer.`)) return;
    try {
      await api.delete(`/admin/users/${id}`);
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Panel de administración</h1>
        <p className="text-sm text-gray-500 mt-1">Gestión de usuarios registrados en la plataforma</p>
      </div>

      <Alert type="error" message={error} onClose={() => setError('')} />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Usuarios</h2>
          <span className="text-sm text-gray-400">{users.length} registrados</span>
        </div>
        <div className="divide-y divide-gray-50">
          {users.map((u) => (
            <div key={u.id} className="flex items-center gap-4 px-6 py-4">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900">{u.name}</div>
                <div className="text-sm text-gray-400">{u.email}</div>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  u.role === 'admin'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {u.role}
              </span>
              <div className="text-center w-16">
                <div className="font-semibold text-gray-900">{u._count.habits}</div>
                <div className="text-xs text-gray-400">hábitos</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(u.id, u.name)}
                disabled={u.id === user?.id}
                className={
                  u.id === user?.id
                    ? 'opacity-30 cursor-not-allowed'
                    : 'text-red-600 hover:bg-red-50'
                }
              >
                Eliminar
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
