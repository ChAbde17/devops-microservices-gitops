import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Badge from './ui/Badge.jsx';

export default function MetricsCard({
  title,
  value,
  change,
  changeType = 'increase',
  status,
  statusVariant = 'emerald',
  icon: Icon,
  iconColor = 'text-indigo-400',
  iconBg = 'bg-indigo-500/10 border-indigo-500/20',
  sparklineData = [4, 7, 5, 8, 9, 12, 11, 14, 13, 16],
  subtext,
}) {
  // Generate SVG path for the sparkline
  const max = Math.max(...sparklineData);
  const min = Math.min(...sparklineData);
  const range = max - min || 1;
  const height = 36;
  const width = 110;
  const points = sparklineData
    .map((val, i) => {
      const x = (i / (sparklineData.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 8) - 4;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const strokeColor = changeType === 'decrease' ? '#f43f5e' : '#10b981';

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.18, ease: 'easeOut' } }}
      className="relative flex flex-col justify-between p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-card-dark hover:border-slate-700/80 transition-colors backdrop-blur-sm overflow-hidden group"
    >
      {/* Subtle top gradient glow on hover */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div>
        {/* Header row */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </span>
          {Icon && (
            <div className={`p-2 rounded-lg border ${iconBg} ${iconColor} shrink-0`}>
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Metric Value */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl lg:text-3xl font-bold font-mono tracking-tight text-white">
            {value}
          </span>
          {change && (
            <span
              className={`inline-flex items-center text-xs font-semibold ${
                changeType === 'decrease' ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {changeType === 'decrease' ? (
                <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
              ) : (
                <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
              )}
              {change}
            </span>
          )}
        </div>
      </div>

      {/* Footer row: Sparkline & Status */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        {status ? (
          <Badge variant={statusVariant} dot pulse={statusVariant === 'emerald'}>
            {status}
          </Badge>
        ) : subtext ? (
          <span className="text-xs text-slate-400 font-mono">{subtext}</span>
        ) : <span />}

        {/* Micro Sparkline */}
        <div className="w-[110px] h-[36px] overflow-hidden shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            <polyline
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}
