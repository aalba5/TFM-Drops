import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as habitService from '../services/habitService';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import HabitHeatmap from '../components/habits/HabitHeatmap';
import HabitStatsCard from '../components/habits/HabitStatsCard';

export default function HabitDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [habit, setHabit] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [habitData, statsData] = await Promise.all([
        habitService.getHabit(id),
        habitService.getStats(id),
      ]);
      setHabit(habitData);
      setStats(statsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (date) => {
    try {
      await habitService.toggleEntry(id, date);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  // Generate last 30 days for the calendar grid
  const getLast30Days = () => {
    const days = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  const isCompleted = (date) => {
    return habit?.entries?.some((e) => e.date === date);
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  }

  if (!habit) {
    return <Alert type="error" message="Hábito no encontrado" />;
  }

  const days = getLast30Days();

  return (
    <div>
      <button onClick={() => navigate('/habits')} className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block">
        &larr; Volver a hábitos
      </button>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: habit.color }}></div>
          <h1 className="text-2xl font-bold text-gray-900">{habit.name}</h1>
        </div>
        {habit.description && <p className="text-gray-500 mb-4">{habit.description}</p>}
        {habit.category && (
          <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
            {habit.category.icon} {habit.category.name}
          </span>
        )}
      </div>

      <Alert type="error" message={error} onClose={() => setError('')} />

      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <HabitStatsCard icon="🔥" value={stats.currentStreak} label="Racha actual" color="bg-orange-50" />
          <HabitStatsCard icon="🏆" value={stats.bestStreak} label="Mejor racha" color="bg-amber-50" />
          <HabitStatsCard icon="📅" value={stats.totalEntries} label="Días completados" color="bg-indigo-50" />
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actividad anual</h2>
        <HabitHeatmap entries={habit.entries || []} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Últimos 30 días</h2>
        <div className="grid grid-cols-10 gap-2">
          {days.map((date) => {
            const completed = isCompleted(date);
            const dayNum = new Date(date).getDate();
            return (
              <button
                key={date}
                onClick={() => handleToggle(date)}
                title={date}
                className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
                  completed
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
              >
                {dayNum}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
