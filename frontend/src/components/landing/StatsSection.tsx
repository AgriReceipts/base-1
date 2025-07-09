import React, { useEffect, useRef, useState } from 'react';

const stats = [
  { label: 'Market Committees', value: 9 },
  { label: 'Receipts Processed', value: 12456 },
  { label: 'Active Users', value: 312 },
  { label: 'Verified Receipts', value: 12000 },
  { label: 'Districts Covered', value: 13 },
];

function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const startTimestamp = useRef<number | null>(null);

  useEffect(() => {
    function step(timestamp: number) {
      if (!startTimestamp.current) startTimestamp.current = timestamp;
      const progress = Math.min((timestamp - startTimestamp.current) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    }
    requestAnimationFrame(step);
    // eslint-disable-next-line
  }, [target, duration]);
  return count;
}

const StatsSection: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-6 py-8">
      {stats.map((stat, idx) => {
        const count = useCountUp(stat.value, 1200 + idx * 200);
        return (
          <div
            key={stat.label}
            className="flex flex-col items-center bg-white/80 rounded-lg shadow-md p-4 transition-transform hover:scale-105"
          >
            <span className="text-3xl md:text-4xl font-bold text-blue-700 animate-pulse">
              {count.toLocaleString()}
            </span>
            <span className="text-sm md:text-base text-gray-700 mt-2 text-center">
              {stat.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default StatsSection; 