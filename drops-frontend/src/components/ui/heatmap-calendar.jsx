import { useMemo } from 'react';
import { cn } from '../../lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

const LEVELS = [
  'bg-gray-100',
  'bg-green-200',
  'bg-green-400',
  'bg-green-600',
  'bg-green-800',
];

const DAY_LABELS = ['Lun', '', 'Mié', '', 'Vie', '', ''];

function getLevel(value) {
  if (!value || value === 0) return 0;
  if (value === 1) return 1;
  if (value <= 3) return 2;
  if (value <= 5) return 3;
  return 4;
}

function toDateStr(date) {
  return date instanceof Date ? date.toISOString().split('T')[0] : date;
}

export function HeatmapCalendar({
  data = [],
  title = 'Actividad',
  rangeDays = 365,
  cellSize = 12,
  axisLabels = true,
  onCellClick,
  renderTooltip,
}) {
  const { weeks, monthLabels } = useMemo(() => {
    const dateMap = {};
    for (const datum of data) {
      const date = toDateStr(datum.date);
      if (date) dateMap[date] = (dateMap[date] || 0) + (datum.value ?? 1);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - (rangeDays - 1));
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
          week.push({ date: '', value: 0, isFuture: true });
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
          const meta = data.find((d) => toDateStr(d.date) === dateStr)?.meta;
          week.push({ date: dateStr, value: dateMap[dateStr] || 0, isFuture: false, meta });
        }
        current = new Date(current);
        current.setDate(current.getDate() + 1);
      }
      weeks.push(week);
    }

    return { weeks, monthLabels };
  }, [data, rangeDays]);

  const cellStyle = { width: cellSize, height: cellSize };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipProvider delayDuration={0}>
          <div className="overflow-x-auto">
            <div className="inline-flex flex-col gap-1 min-w-max">
              {axisLabels && (
                <div className="flex gap-1 ml-5">
                  {weeks.map((_, wi) => {
                    const m = monthLabels.find((ml) => ml.week === wi);
                    return (
                      <div key={wi} style={{ width: cellSize }} className="text-center overflow-visible">
                        {m && <span className="text-xs text-gray-400 whitespace-nowrap">{m.label}</span>}
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="flex gap-1">
                {axisLabels && (
                  <div className="flex flex-col gap-1 mr-1">
                    {DAY_LABELS.map((label, i) => (
                      <div key={i} style={cellStyle} className="flex items-center justify-end pr-0.5">
                        <span className="text-xs text-gray-400 leading-none">{label}</span>
                      </div>
                    ))}
                  </div>
                )}
                {weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-1">
                    {week.map((day, di) => (
                      <Tooltip key={di}>
                        <TooltipTrigger asChild>
                          <div
                            style={cellStyle}
                            onClick={() => !day.isFuture && onCellClick?.(day)}
                            className={cn(
                              'rounded-sm',
                              day.isFuture ? 'bg-transparent' : LEVELS[getLevel(day.value)],
                              onCellClick && !day.isFuture && 'cursor-pointer hover:ring-1 hover:ring-green-500'
                            )}
                          />
                        </TooltipTrigger>
                        {!day.isFuture && day.date && (
                          <TooltipContent side="top">
                            {renderTooltip
                              ? renderTooltip(day)
                              : day.value > 0
                              ? `${day.date} — ${day.value} completado${day.value > 1 ? 's' : ''}`
                              : `${day.date} — Sin actividad`}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    ))}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1 mt-1 ml-5 justify-end">
                <span className="text-xs text-gray-400 mr-1">Menos</span>
                {LEVELS.map((c) => (
                  <div key={c} style={cellStyle} className={cn('rounded-sm', c)} />
                ))}
                <span className="text-xs text-gray-400 ml-1">Más</span>
              </div>
            </div>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
