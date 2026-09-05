import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, Zap, ArrowUpRight } from 'lucide-react';

export default function TelemetryChart({ telemetryHistory = [] }) {
  const [timeWindow, setTimeWindow] = useState('5m');
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Take the latest 20 data points
  const data = telemetryHistory.slice(-20);

  // SVG Chart Dimensions
  const width = 760;
  const height = 220;
  const padding = { top: 20, right: 20, bottom: 30, left: 45 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Compute Scales
  const maxLatency = Math.max(...data.map((d) => d.latency), 100);
  const minLatency = 0;

  const points = data.map((d, index) => {
    const x = padding.left + (index / (Math.max(data.length - 1, 1))) * chartWidth;
    const y = padding.top + chartHeight - ((d.latency - minLatency) / (maxLatency - minLatency)) * chartHeight;
    return { x, y, ...d };
  });

  // SVG Path creation
  const pathD = points.reduce((acc, point, index) => {
    return index === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, '');

  // Gradient area path (close down to bottom axis)
  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`
    : '';

  return (
    <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-card-dark backdrop-blur-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-400" />
            <h3 className="font-semibold text-white text-base">Live Latency & Traffic Telemetry</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Round-trip response duration (ms) streamed from FastAPI backend
          </p>
        </div>

        {/* Time Window Buttons */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 self-start">
          {['1m', '5m', '15m'].map((tw) => (
            <button
              key={tw}
              onClick={() => setTimeWindow(tw)}
              className={`px-2.5 py-1 text-xs font-mono rounded ${
                timeWindow === tw
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tw}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Chart Area */}
      <div className="relative mt-4 overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            {/* Smooth Indigo Gradient */}
            <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
              <stop offset="90%" stopColor="#6366f1" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((fraction, i) => {
            const y = padding.top + chartHeight * (1 - fraction);
            const val = Math.round(minLatency + fraction * (maxLatency - minLatency));
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#1e293b"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[10px] font-mono fill-slate-400"
                >
                  {val}ms
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          {areaD && (
            <motion.path
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              d={areaD}
              fill="url(#latencyGradient)"
            />
          )}

          {/* Line Curve */}
          {pathD && (
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              d={pathD}
              fill="none"
              stroke="#818cf8"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Interactive Data Points */}
          {points.map((p, idx) => (
            <g key={idx} onMouseEnter={() => setHoveredPoint(p)} onMouseLeave={() => setHoveredPoint(null)}>
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredPoint?.x === p.x ? 5 : 3}
                className="fill-slate-950 stroke-indigo-400 stroke-2 cursor-pointer transition-all"
              />
            </g>
          ))}

          {/* Bottom Time Axis Labels */}
          {points.filter((_, i) => i % 4 === 0 || i === points.length - 1).map((p, idx) => (
            <text
              key={idx}
              x={p.x}
              y={height - 8}
              textAnchor="middle"
              className="text-[10px] font-mono fill-slate-400"
            >
              {p.time || 'now'}
            </text>
          ))}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && (
          <div
            className="absolute top-2 right-4 bg-slate-950/95 border border-indigo-500/40 rounded-lg p-2.5 shadow-xl text-xs font-mono pointer-events-none"
          >
            <div className="text-slate-400">Timestamp: {hoveredPoint.time}</div>
            <div className="text-indigo-300 font-bold mt-1">
              Latency: {hoveredPoint.latency} ms
            </div>
            <div className="text-emerald-400">Status: {hoveredPoint.status || '200 OK'}</div>
          </div>
        )}
      </div>

      {/* Footer / Legend */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span>P95 HTTP Latency</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>Synthetic Health Probes</span>
          </div>
        </div>
        <div className="font-mono text-slate-400">
          Max observed: {maxLatency} ms
        </div>
      </div>
    </div>
  );
}
