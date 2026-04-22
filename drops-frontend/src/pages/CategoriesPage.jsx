import { useState, useEffect } from 'react';
import * as categoryService from '../services/categoryService';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Alert from '../components/common/Alert';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form, setForm] = useState({ name: '', color: '#6366f1', icon: '' });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingCategory(null);
    setForm({ name: '', color: '#6366f1', icon: '' });
    setShowModal(true);
  };

  const openEdit = (cat) => {
    setEditingCategory(cat);
    setForm({ name: cat.name, color: cat.color, icon: cat.icon });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, form);
      } else {
        await categoryService.createCategory(form);
      }
      setShowModal(false);
      loadCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta categoría?')) return;
    try {
      await categoryService.deleteCategory(id);
      loadCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
        <Button onClick={openCreate}>+ Nueva categoría</Button>
      </div>

      <Alert type="error" message={error} onClose={() => setError('')} />

      {categories.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500 mb-4">No hay categorías</p>
          <Button onClick={openCreate}>Crear categoría</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cat.icon}</span>
                  <div>
                    <h3 className="font-medium text-gray-900">{cat.name}</h3>
                    <p className="text-sm text-gray-500">{cat._count?.habits || 0} hábitos</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }}></div>
                  <Button variant="ghost" size="sm" onClick={() => openEdit(cat)}>Editar</Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(cat.id)} className="text-red-600 hover:bg-red-50">
                    Eliminar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingCategory ? 'Editar categoría' : 'Nueva categoría'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Ej: Salud"
            required
          />
          <Input
            label="Icono (emoji)"
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
            placeholder="Ej: 💚"
          />
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
            <Button type="submit" className="flex-1">{editingCategory ? 'Guardar' : 'Crear'}</Button>
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
