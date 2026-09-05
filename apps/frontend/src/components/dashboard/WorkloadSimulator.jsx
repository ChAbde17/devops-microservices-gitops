import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  AlertTriangle,
  Radio,
  Sliders,
  Terminal,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import Button from '../ui/Button.jsx';
import Badge from '../ui/Badge.jsx';

export default function WorkloadSimulator({ onSimulate, isSimulating }) {
  const [latency, setLatency] = useState(200);
  const [errorRate, setErrorRate] = useState(0);
  const [burstCount, setBurstCount] = useState(5);
  const [logs, setLogs] = useState([
    {
      id: 1,
      time: new Date().toLocaleTimeString(),
      method: 'GET',
      path: '/api/v1/healthz',
      status: 200,
      duration: 18,
    },
    {
      id: 2,
      time: new Date().toLocaleTimeString(),
      method: 'GET',
      path: '/metrics',
      status: 200,
      duration: 24,
    },
  ]);

  const logContainerRef = useRef(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const handleBurst = async (forcedError = false) => {
    const err = forcedError ? 1.0 : errorRate / 100;
    const now = new Date().toLocaleTimeString();

    for (let i = 0; i < burstCount; i++) {
      const simulatedDuration = latency + Math.floor(Math.random() * 40 - 20);
      const isErr = forcedError || Math.random() < err;

      // Call parent simulation handler
      if (onSimulate) {
        onSimulate(latency, isErr ? 1.0 : 0.0);
      }

      setLogs((prev) => [
        ...prev.slice(-40),
        {
          id: Date.now() + i,
          time: new Date().toLocaleTimeString(),
          method: 'POST',
          path: `/api/v1/simulate-workload?latency=${latency}ms`,
          status: isErr ? 500 : 200,
          duration: simulatedDuration,
        },
      ]);
      await new Promise((r) => setTimeout(r, 60));
    }
  };

  return (
    <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-card-dark backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-base">Traffic & Incident Generator</h3>
            <p className="text-xs text-slate-400">
              Trigger real-time requests to test Prometheus metric scraping and Grafana alerts
            </p>
          </div>
        </div>
        <Badge variant="brand" dot pulse>
          SRE Interactive Lab
        </Badge>
      </div>

      {/* Control sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
        {/* Latency slider */}
        <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="text-slate-400 font-medium">Artificial Latency</span>
            <span className="font-mono text-indigo-400 font-bold">{latency} ms</span>
          </div>
          <input
            type="range"
            min="0"
            max="1500"
            step="50"
            value={latency}
            onChange={(e) => setLatency(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
            <span>0ms (fast)</span>
            <span>1500ms (slow)</span>
          </div>
        </div>

        {/* Error Rate slider */}
        <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="text-slate-400 font-medium">Injected 500 Error Rate</span>
            <span className="font-mono text-rose-400 font-bold">{errorRate}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={errorRate}
            onChange={(e) => setErrorRate(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
            <span>0% (stable)</span>
            <span>100% (failure)</span>
          </div>
        </div>

        {/* Concurrency Burst slider */}
        <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="text-slate-400 font-medium">Burst Concurrency</span>
            <span className="font-mono text-sky-400 font-bold">{burstCount} requests</span>
          </div>
          <input
            type="range"
            min="1"
            max="20"
            step="1"
            value={burstCount}
            onChange={(e) => setBurstCount(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
            <span>1 req</span>
            <span>20 concurrent</span>
          </div>
        </div>
      </div>

      {/* Action Trigger Buttons */}
      <div className="flex flex-wrap items-center gap-3 mt-5">
        <Button
          variant="primary"
          icon={Zap}
          loading={isSimulating}
          onClick={() => handleBurst(false)}
        >
          Generate Normal Traffic (200 OK)
        </Button>

        <Button
          variant="danger"
          icon={AlertTriangle}
          loading={isSimulating}
          onClick={() => handleBurst(true)}
        >
          Inject HTTP 500 Spike
        </Button>

        <button
          onClick={() => setLogs([])}
          className="text-xs text-slate-400 hover:text-slate-200 transition-colors ml-auto font-mono"
        >
          Clear Stream
        </button>
      </div>

      {/* Live Stream Terminal */}
      <div className="mt-4 rounded-lg bg-slate-950 border border-slate-800/90 overflow-hidden font-mono text-xs">
        <div className="px-3.5 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-slate-400">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-medium text-[11px]">Streamed Request Telemetry Log</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-slate-400">Listening to :8000</span>
          </div>
        </div>

        <div
          ref={logContainerRef}
          className="p-3 max-h-48 overflow-y-auto space-y-1.5 select-text"
        >
          {logs.map((log) => (
            <div key={log.id} className="flex items-center justify-between gap-2 text-[11px]">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="text-slate-400 shrink-0">{log.time}</span>
                <span className="text-indigo-400 font-semibold shrink-0">{log.method}</span>
                <span className="text-slate-300 truncate">{log.path}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`font-semibold ${
                    log.status === 200 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {log.status}
                </span>
                <span className="text-slate-400">{log.duration}ms</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
