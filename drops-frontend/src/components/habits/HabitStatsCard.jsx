export default function HabitStatsCard({ icon, value, label, color = 'bg-indigo-50' }) {
  return (
    <div className={`${color} rounded-xl p-4 text-center`}>
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}
