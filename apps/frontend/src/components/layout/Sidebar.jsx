import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Activity,
  Layers,
  GitBranch,
  Radio,
  Server,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Terminal,
  Cpu,
} from 'lucide-react';
import Badge from '../ui/Badge.jsx';

export default function Sidebar({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  environment = 'development',
}) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, category: 'Observability' },
    { id: 'telemetry', label: 'Metrics & Latency', icon: Activity, category: 'Observability' },
    { id: 'services', label: 'Microservices', icon: Layers, badge: '4 active', category: 'Observability' },
    { id: 'simulator', label: 'Traffic Simulator', icon: Radio, category: 'Platform SRE' },
    { id: 'gitops', label: 'ArgoCD GitOps', icon: GitBranch, badge: 'Synced', category: 'Platform SRE' },
    { id: 'cluster', label: 'Cluster Nodes', icon: Server, category: 'Infrastructure' },
    { id: 'security', label: 'Trivy DevSecOps', icon: ShieldCheck, badge: '0 CVE', category: 'Infrastructure' },
  ];

  // Group by category
  const categories = ['Observability', 'Platform SRE', 'Infrastructure'];

  return (
    <aside
      className={`fixed lg:static top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out bg-slate-900 border-r border-slate-800 flex flex-col justify-between ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Top Section */}
      <div>
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 p-0.5 shrink-0 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="whitespace-nowrap"
              >
                <div className="font-bold text-sm tracking-wide text-white flex items-center gap-1.5">
                  DEVOPS<span className="text-indigo-400">.CORE</span>
                </div>
                <div className="text-[10px] font-mono text-slate-400">GitOps & Telemetry</div>
              </motion.div>
            )}
          </div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)]">
          {categories.map((cat) => {
            const items = navItems.filter((i) => i.category === cat);
            return (
              <div key={cat} className="space-y-1">
                {sidebarOpen && (
                  <div className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    {cat}
                  </div>
                )}
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`relative w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'text-white bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      } ${!sidebarOpen ? 'justify-center px-0' : ''}`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activePill"
                          className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-indigo-500 rounded-r"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                      {sidebarOpen && (
                        <div className="flex-1 flex items-center justify-between overflow-hidden">
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <span
                              className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                                item.badge === 'Synced'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-slate-800 text-slate-400 border border-slate-700'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom Environment Status */}
      <div className="p-3 border-t border-slate-800/80">
        {sidebarOpen ? (
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400 font-medium">KinD Cluster</span>
              <Badge variant="emerald" dot pulse>
                Active
              </Badge>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
              <Terminal className="w-3 h-3 text-indigo-400" />
              <span>ctx: kind-cluster</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          </div>
        )}
      </div>
    </aside>
  );
}
