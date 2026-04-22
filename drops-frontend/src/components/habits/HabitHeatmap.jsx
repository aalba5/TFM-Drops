import { useMemo } from 'react';

const DAY_LABELS = ['L', '', 'X', '', 'V', '', 'D'];

function getColor(count, isFuture) {
  if (isFuture) return 'bg-transparent';
  if (count === 0) return 'bg-gray-100';
  if (count === 1) return 'bg-green-200';
  if (count <= 3) return 'bg-green-400';
  return 'bg-green-600';
}

export default function HabitHeatmap({ entries = [], title }) {
  const { weeks, monthLabels } = useMemo(() => {
    const dateMap = {};
    for (const entry of entries) {
      const date = typeof entry === 'string' ? entry : entry.date;
      if (date) dateMap[date] = (dateMap[date] || 0) + 1;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Start 364 days ago aligned to Monday
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 364);
    const dow = startDate.getDay();
    startDate.setDate(startDate.getDate() - (dow === 0 ? 6 : dow - 1));

    const weeks = [];
    const monthLabels = [];
    let current = new Date(startDate);
    let lastMonth = -1;

    while (current <= today) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        if (current > today) {
          week.push({ date: '', count: 0, isFuture: true });
        } else {
          const dateStr = current.toISOString().split('T')[0];
          const month = current.getMonth();
          if (d === 0 && month !== lastMonth) {
            monthLabels.push({
              week: weeks.length,
              label: current.toLocaleString('es', { month: 'short' }),
            });
            lastMonth = month;
          }
          week.push({ date: dateStr, count: dateMap[dateStr] || 0, isFuture: false });
        }
        current = new Date(current);
        current.setDate(current.getDate() + 1);
      }
      weeks.push(week);
    }

    return { weeks, monthLabels };
  }, [entries]);

  return (
    <div>
      {title && <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>}
      <div className="overflow-x-auto">
        <div className="inline-flex flex-col gap-1 min-w-max">
          {/* Month row */}
          <div className="flex gap-1 ml-5">
            {weeks.map((_, wi) => {
              const m = monthLabels.find((ml) => ml.week === wi);
              return (
                <div key={wi} className="w-3 text-center overflow-visible">
                  {m && <span className="text-xs text-gray-400 whitespace-nowrap">{m.label}</span>}
                </div>
              );
            })}
          </div>
          {/* Grid with day labels */}
          <div className="flex gap-1">
            <div className="flex flex-col gap-1 mr-1">
              {DAY_LABELS.map((label, i) => (
                <div key={i} className="w-3 h-3 flex items-center justify-end pr-0.5">
                  <span className="text-xs text-gray-400 leading-none">{label}</span>
                </div>
              ))}
            </div>
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1">
                {week.map((day, di) => (
                  <div
                    key={di}
                    title={!day.isFuture && day.date ? `${day.date}${day.count > 0 ? ` — ${day.count} completado${day.count > 1 ? 's' : ''}` : ' — Sin actividad'}` : ''}
                    className={`w-3 h-3 rounded-sm ${getColor(day.count, day.isFuture)}`}
                  />
                ))}
              </div>
            ))}
          </div>
          {/* Legend */}
          <div className="flex items-center gap-1 mt-1 ml-5 justify-end">
            <span className="text-xs text-gray-400 mr-1">Menos</span>
            {['bg-gray-100', 'bg-green-200', 'bg-green-400', 'bg-green-600'].map((c) => (
              <div key={c} className={`w-3 h-3 rounded-sm ${c}`} />
            ))}
            <span className="text-xs text-gray-400 ml-1">Más</span>
          </div>
        </div>
      </div>
    </div>
  );
}
