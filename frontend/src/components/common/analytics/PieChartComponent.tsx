import {formatMoney} from '@/lib/helpers';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884D8',
  '#82CA9D',
];

type PieChartComponentProps = {
  data: {name: string; value: number}[];
  onClickData?: (entry: any) => void;
};

const PieChartComponent = ({data, onClickData}: PieChartComponentProps) => {
  return (
    <ResponsiveContainer width='100%' height='100%'>
      <PieChart>
        <Pie
          data={data}
          cx='50%'
          cy='50%'
          labelLine={false}
          outerRadius={80}
          fill='#8884d8'
          dataKey='value'
          animationDuration={400}
          label={({name, value, percent}) =>
            `${name}: ${formatMoney(value || 0)} (${(
              percent || 0 * 100
            ).toFixed(0)}%)`
          }
          onClick={
            onClickData ? (_, index) => onClickData(data[index]) : undefined
          }>
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number, name: string) => {
            const total = data.reduce((sum, entry) => sum + entry.value, 0);
            const percent =
              total > 0 ? ((value / total) * 100).toFixed(2) : '0.00';
            return [formatMoney(value), `${name} (${percent}%)`];
          }}
        />

        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartComponent;
