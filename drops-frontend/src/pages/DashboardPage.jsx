import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as habitService from '../services/habitService';
import HabitHeatmap from '../components/habits/HabitHeatmap';
import HabitStatsCard from '../components/habits/HabitStatsCard';

function computeStreaks(dates) {
  if (dates.length === 0) return { current: 0, best: 0 };
  const unique = [...new Set(dates)].sort();
  const dateSet = new Set(unique);

  let current = 0;
  const check = new Date();
  check.setHours(0, 0, 0, 0);
  while (dateSet.has(check.toISOString().split('T')[0])) {
    current++;
    check.setDate(check.getDate() - 1);
  }

  let best = 0;
  let temp = 1;
  for (let i = 1; i < unique.length; i++) {
    const diff = (new Date(unique[i]) - new Date(unique[i - 1])) / 86400000;
    if (diff === 1) {
      temp++;
    } else {
      best = Math.max(best, temp);
      temp = 1;
    }
  }
  best = Math.max(best, temp, current);

  return { current, best };
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    habitService.getHabits()
      .then(setHabits)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const globalStats = useMemo(() => {
    if (!habits.length) return null;
    const completedToday = habits.filter((h) => h.entries?.some((e) => e.date === today)).length;
    const allDates = habits.flatMap((h) => (h.entries || []).map((e) => e.date));
    const uniqueDates = [...new Set(allDates)];
    const { current: currentStreak, best: bestStreak } = computeStreaks(uniqueDates);
    const dateSet = new Set(uniqueDates);
    let activeDays = 0;
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      if (dateSet.has(d.toISOString().split('T')[0])) activeDays++;
    }
    const completionRate = Math.round((activeDays / 30) * 100);
    return { completedToday, currentStreak, bestStreak, completionRate };
  }, [habits, today]);

  const heatmapEntries = useMemo(
    () => habits.flatMap((h) => h.entries || []),
    [habits]
  );

  const habitRows = useMemo(() => {
    return habits.map((habit) => {
      const dates = (habit.entries || []).map((e) => e.date);
      const { current, best } = computeStreaks(dates);
      const dateSet = new Set(dates);
      let activeDays = 0;
      for (let i = 0; i < 30; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        if (dateSet.has(d.toISOString().split('T')[0])) activeDays++;
      }
      return {
        ...habit,
        currentStreak: current,
        bestStreak: best,
        completionRate: Math.round((activeDays / 30) * 100),
        completedToday: dateSet.has(today),
      };
    });
  }, [habits, today]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Hola, {user?.name} 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Resumen de tu actividad</p>
      </div>

      {globalStats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <HabitStatsCard icon="📋" value={habits.length} label="Hábitos activos" color="bg-indigo-50" />
          <HabitStatsCard icon="✅" value={globalStats.completedToday} label="Completados hoy" color="bg-green-50" />
          <HabitStatsCard icon="🔥" value={globalStats.currentStreak} label="Racha actual" color="bg-orange-50" />
          <HabitStatsCard icon="🏆" value={globalStats.bestStreak} label="Mejor racha" color="bg-amber-50" />
          <HabitStatsCard icon="📈" value={`${globalStats.completionRate}%`} label="Tasa del mes" color="bg-purple-50" />
        </div>
      )}

      <HabitHeatmap entries={heatmapEntries} />

      {habitRows.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Estadísticas por hábito</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {habitRows.map((habit) => (
              <Link
                key={habit.id}
                to={`/habits/${habit.id}`}
                className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: habit.color }} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">{habit.name}</div>
                  {habit.category && (
                    <div className="text-xs text-gray-400">
                      {habit.category.icon} {habit.category.name}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-orange-600">{habit.currentStreak}</div>
                    <div className="text-xs text-gray-400">Racha</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-amber-600">{habit.bestStreak}</div>
                    <div className="text-xs text-gray-400">Mejor</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-indigo-600">{habit.completionRate}%</div>
                    <div className="text-xs text-gray-400">30 días</div>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      habit.completedToday
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {habit.completedToday ? '✓' : '–'}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
