import { HeatmapCalendar } from '../ui/heatmap-calendar';

export default function HabitHeatmap({ entries = [], title }) {
  const data = entries.map((entry) => ({
    date: typeof entry === 'string' ? entry : entry.date,
    value: 1,
  }));

  return <HeatmapCalendar data={data} title={title ?? 'Actividad anual'} />;
}
