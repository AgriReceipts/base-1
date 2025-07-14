// Reusable components with proper TypeScript interfaces
interface MetricCardProps {
  title?: string;
  value: string;
  subtitle: string;
  color: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  color,
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-4 border-l-4`}
      style={{ borderLeftColor: color }}
    >
      <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">
        {title}
      </h3>
      <p className="text-2xl font-bold my-2" style={{ color }}>
        {value}
      </p>
      <p className="text-gray-400 text-xs">{subtitle}</p>
    </div>
  );
};

interface ChartCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  children,
  className = "",
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      <h2 className="text-gray-700 text-lg font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
};
