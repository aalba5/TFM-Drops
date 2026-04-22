import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as habitService from '../services/habitService';
import * as categoryService from '../services/categoryService';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Alert from '../components/common/Alert';

export default function HabitsPage() {
  const [habits, setHabits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', frequency: 'daily', color: '#6366f1', categoryId: '' });

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [habitsData, categoriesData] = await Promise.all([
        habitService.getHabits(),
        categoryService.getCategories(),
      ]);
      setHabits(habitsData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingHabit(null);
    setForm({ name: '', description: '', frequency: 'daily', color: '#6366f1', categoryId: '' });
    setShowModal(true);
  };

  const openEdit = (habit) => {
    setEditingHabit(habit);
    setForm({
      name: habit.name,
      description: habit.description || '',
      frequency: habit.frequency,
      color: habit.color,
      categoryId: habit.categoryId || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingHabit) {
        await habitService.updateHabit(editingHabit.id, form);
      } else {
        await habitService.createHabit(form);
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este hábito?')) return;
    try {
      await habitService.deleteHabit(id);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggle = async (habitId) => {
    try {
      await habitService.toggleEntry(habitId, today);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const isCompletedToday = (habit) => {
    return habit.entries?.some((e) => e.date === today);
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mis hábitos</h1>
        <Button onClick={openCreate}>+ Nuevo hábito</Button>
      </div>

      <Alert type="error" message={error} onClose={() => setError('')} />

      {habits.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500 mb-4">No tienes hábitos todavía</p>
          <Button onClick={openCreate}>Crear tu primer hábito</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {habits.map((habit) => (
            <div key={habit.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
              <button
                onClick={() => handleToggle(habit.id)}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  isCompletedToday(habit)
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-gray-300 hover:border-indigo-400'
                }`}
              >
                {isCompletedToday(habit) && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>

              <Link to={`/habits/${habit.id}`} className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: habit.color }}></div>
                  <h3 className="font-medium text-gray-900 truncate">{habit.name}</h3>
                  {habit.category && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {habit.category.icon} {habit.category.name}
                    </span>
                  )}
                </div>
                {habit.description && (
                  <p className="text-sm text-gray-500 truncate mt-0.5">{habit.description}</p>
                )}
              </Link>

              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => openEdit(habit)}>
                  Editar
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(habit.id)} className="text-red-600 hover:bg-red-50">
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingHabit ? 'Editar hábito' : 'Nuevo hábito'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Ej: Beber 2L de agua"
            required
          />
          <Input
            label="Descripción (opcional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Descripción breve"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Frecuencia</label>
            <select
              value={form.frequency}
              onChange={(e) => setForm({ ...form, frequency: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="daily">Diario</option>
              <option value="weekly">Semanal</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Sin categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <input
              type="color"
              value={form.color}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
              className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1">{editingHabit ? 'Guardar cambios' : 'Crear hábito'}</Button>
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
