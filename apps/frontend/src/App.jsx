import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Server,
  Zap,
  GitBranch,
  Layers,
  Radio,
  ShieldCheck,
  Cpu,
  HardDrive,
  Clock,
  Terminal,
  AlertTriangle,
} from 'lucide-react';

import Sidebar from './components/layout/Sidebar.jsx';
import Header from './components/layout/Header.jsx';
import MetricsCard from './components/MetricsCard.jsx';
import TelemetryChart from './components/dashboard/TelemetryChart.jsx';
import WorkloadSimulator from './components/dashboard/WorkloadSimulator.jsx';
import ServiceMeshTable from './components/dashboard/ServiceMeshTable.jsx';
import GitOpsDrawer from './components/dashboard/GitOpsDrawer.jsx';
import Badge from './components/ui/Badge.jsx';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [environment, setEnvironment] = useState('development');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [backendConnected, setBackendConnected] = useState(false);
  const [lastScrapeTime, setLastScrapeTime] = useState('');
  const [telemetryHistory, setTelemetryHistory] = useState([
    { time: '14:20:00', latency: 45, status: '200 OK' },
    { time: '14:20:15', latency: 52, status: '200 OK' },
    { time: '14:20:30', latency: 48, status: '200 OK' },
    { time: '14:20:45', latency: 65, status: '200 OK' },
    { time: '14:21:00', latency: 42, status: '200 OK' },
    { time: '14:21:15', latency: 50, status: '200 OK' },
    { time: '14:21:30', latency: 46, status: '200 OK' },
    { time: '14:21:45', latency: 85, status: '200 OK' },
    { time: '14:22:00', latency: 44, status: '200 OK' },
    { time: '14:22:15', latency: 49, status: '200 OK' },
  ]);

  const [kpiMetrics, setKpiMetrics] = useState({
    latency: '44 ms',
    latencyDelta: '-6ms',
    throughput: '284 req/s',
    throughputDelta: '+12.4%',
    podHealth: '100%',
    activePods: '7 / 7 Running',
    gitopsStatus: '0 Drift',
    commitSha: '45b6192',
  });

  // Poll backend health and metrics
  const pollBackend = async () => {
    setIsRefreshing(true);
    const start = performance.now();
    try {
      const res = await fetch('/api/v1/healthz');
      const duration = Math.round(performance.now() - start);
      if (res.ok) {
        setBackendConnected(true);
        const now = new Date().toLocaleTimeString();
        setLastScrapeTime(now);
        setTelemetryHistory((prev) => [
          ...prev.slice(-30),
          { time: now, latency: duration || 25, status: '200 OK' },
        ]);
        setKpiMetrics((prev) => ({
          ...prev,
          latency: `${duration || 25} ms`,
        }));
      } else {
        throw new Error('Non-200 response');
      }
    } catch (err) {
      setBackendConnected(false);
      const now = new Date().toLocaleTimeString();
      setLastScrapeTime(now);
      // Realistic simulated background jitter
      const simulatedDuration = 40 + Math.floor(Math.random() * 20);
      setTelemetryHistory((prev) => [
        ...prev.slice(-30),
        { time: now, latency: simulatedDuration, status: '200 OK' },
      ]);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    pollBackend();
    const interval = setInterval(pollBackend, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSimulateWorkload = async (latencyMs, errorRate) => {
    const start = performance.now();
    try {
      await fetch(`/api/v1/simulate-workload?latency_ms=${latencyMs}&error_rate=${errorRate}`, {
        method: 'POST',
      });
      const duration = Math.round(performance.now() - start);
      const now = new Date().toLocaleTimeString();
      setTelemetryHistory((prev) => [
        ...prev.slice(-30),
        {
          time: now,
          latency: latencyMs || duration,
          status: errorRate > 0 ? '500 ERROR' : '200 OK',
        },
      ]);
    } catch (e) {
      const now = new Date().toLocaleTimeString();
      setTelemetryHistory((prev) => [
        ...prev.slice(-30),
        {
          time: now,
          latency: latencyMs,
          status: errorRate > 0 ? '500 ERROR' : '200 OK',
        },
      ]);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        environment={environment}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          environment={environment}
          setEnvironment={setEnvironment}
          isRefreshing={isRefreshing}
          onRefresh={pollBackend}
          lastScrapeTime={lastScrapeTime}
          backendConnected={backendConnected}
        />

        {/* Scrollable Dashboard Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Welcome Banner with Cruip-style Gradient Accent */}
          <div className="relative rounded-2xl p-6 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-card-dark overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="brand" dot pulse>
                    Cluster: kind-local
                  </Badge>
                  <span className="text-xs text-slate-400 font-mono">env: {environment}</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Cloud-Native Observability & GitOps Console
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                  Real-time RED metrics (Rate, Errors, Duration), declarative ArgoCD reconciliation, and containerized microservice telemetry.
                </p>
              </div>

              {/* Quick Summary Pill */}
              <div className="flex items-center gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 shrink-0">
                <div className="text-right font-mono">
                  <div className="text-xs text-slate-400">Target Namespace</div>
                  <div className="text-sm font-bold text-indigo-400">devops-{environment.slice(0, 4)}</div>
                </div>
                <div className="h-8 w-px bg-slate-800" />
                <div className="text-right font-mono">
                  <div className="text-xs text-slate-400">Prometheus Port</div>
                  <div className="text-sm font-bold text-emerald-400">:9090 / :8000</div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Cruip-style KPI Analytics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricsCard
              title="API Response Latency"
              value={kpiMetrics.latency}
              change={kpiMetrics.latencyDelta}
              changeType="decrease"
              status="p95 Target &lt; 80ms"
              statusVariant="emerald"
              icon={Activity}
              iconColor="text-indigo-400"
              iconBg="bg-indigo-500/10 border-indigo-500/20"
              sparklineData={[52, 48, 55, 42, 60, 44, 49, 41, 44]}
            />

            <MetricsCard
              title="HTTP Request Rate"
              value={kpiMetrics.throughput}
              change={kpiMetrics.throughputDelta}
              changeType="increase"
              status="Prometheus Counter"
              statusVariant="sky"
              icon={Zap}
              iconColor="text-sky-400"
              iconBg="bg-sky-500/10 border-sky-500/20"
              sparklineData={[210, 240, 230, 270, 260, 290, 280, 284]}
            />

            <MetricsCard
              title="Cluster Pod Health"
              value={kpiMetrics.podHealth}
              subtext={kpiMetrics.activePods}
              status="All Replicas Up"
              statusVariant="emerald"
              icon={Server}
              iconColor="text-emerald-400"
              iconBg="bg-emerald-500/10 border-emerald-500/20"
              sparklineData={[100, 100, 100, 100, 100, 100, 100, 100]}
            />

            <MetricsCard
              title="GitOps Synchronizer"
              value="ArgoCD"
              subtext={`SHA: ${kpiMetrics.commitSha}`}
              status="Auto-Heal Active"
              statusVariant="brand"
              icon={GitBranch}
              iconColor="text-violet-400"
              iconBg="bg-violet-500/10 border-violet-500/20"
              sparklineData={[1, 1, 1, 1, 1, 1, 1, 1]}
            />
          </div>

          {/* Dynamic Tab Views */}
          <AnimatePresence mode="wait">
            {(activeTab === 'overview' || activeTab === 'telemetry') && (
              <motion.div
                key="overview-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Telemetry Line Chart */}
                <TelemetryChart telemetryHistory={telemetryHistory} />

                {/* SRE Workload Simulator */}
                <WorkloadSimulator
                  onSimulate={handleSimulateWorkload}
                  isSimulating={isRefreshing}
                />

                {/* Microservices Table */}
                <ServiceMeshTable />
              </motion.div>
            )}

            {activeTab === 'services' && (
              <motion.div
                key="services-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <ServiceMeshTable />
                <WorkloadSimulator
                  onSimulate={handleSimulateWorkload}
                  isSimulating={isRefreshing}
                />
              </motion.div>
            )}

            {activeTab === 'simulator' && (
              <motion.div
                key="simulator-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <WorkloadSimulator
                  onSimulate={handleSimulateWorkload}
                  isSimulating={isRefreshing}
                />
                <TelemetryChart telemetryHistory={telemetryHistory} />
              </motion.div>
            )}

            {activeTab === 'gitops' && (
              <motion.div
                key="gitops-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <GitOpsDrawer commitSha={kpiMetrics.commitSha} syncStatus="Synced" />
                <ServiceMeshTable />
              </motion.div>
            )}

            {activeTab === 'cluster' && (
              <motion.div
                key="cluster-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-card-dark">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <Server className="w-5 h-5 text-indigo-400" />
                      <div>
                        <h3 className="font-semibold text-white text-base">KinD Local Node Architecture</h3>
                        <p className="text-xs text-slate-400">Kubernetes v1.30 control plane container node</p>
                      </div>
                    </div>
                    <Badge variant="emerald" dot pulse>Node: Ready</Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 font-mono text-xs">
                    <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
                      <div className="text-slate-400 font-sans font-semibold">Node Role</div>
                      <div className="text-white font-bold mt-1">control-plane, master</div>
                    </div>
                    <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
                      <div className="text-slate-400 font-sans font-semibold">Container Runtime</div>
                      <div className="text-indigo-400 font-bold mt-1">containerd://1.7.15</div>
                    </div>
                    <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
                      <div className="text-slate-400 font-sans font-semibold">Allocated CPU / Memory</div>
                      <div className="text-emerald-400 font-bold mt-1">4 Cores / 8.0 GiB</div>
                    </div>
                  </div>
                </div>
                <ServiceMeshTable />
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                key="security-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-card-dark">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      <div>
                        <h3 className="font-semibold text-white text-base">Trivy DevSecOps Vulnerability Scanner</h3>
                        <p className="text-xs text-slate-400">Automated CVE static analysis in GitHub Actions CI</p>
                      </div>
                    </div>
                    <Badge variant="emerald" dot>Audit Passed</Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-5 font-mono text-xs">
                    <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
                      <div className="text-slate-400 font-sans font-semibold">CRITICAL CVEs</div>
                      <div className="text-emerald-400 text-xl font-bold mt-1">0</div>
                    </div>
                    <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
                      <div className="text-slate-400 font-sans font-semibold">HIGH CVEs</div>
                      <div className="text-emerald-400 text-xl font-bold mt-1">0</div>
                    </div>
                    <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
                      <div className="text-slate-400 font-sans font-semibold">Base Image</div>
                      <div className="text-white text-sm font-bold mt-1 truncate">nginx:alpine / py:slim</div>
                    </div>
                    <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800">
                      <div className="text-slate-400 font-sans font-semibold">Non-Root User</div>
                      <div className="text-indigo-400 text-sm font-bold mt-1">UID 10001 (Enforced)</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
